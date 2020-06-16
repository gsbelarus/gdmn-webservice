/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import koaPassport from 'koa-passport';
import { promisify } from 'util';
import { PATH_LOCAL_DB_USERS, PATH_LOCAL_DB_ACTIVATION_CODES, PATH_LOCAL_DB_DEVICES } from '../server';
import { readFile, writeFile } from '../utils/workWithFile';
import { findByUserName, saveActivationCode, addNewDevice } from '../utils/util';
import { ParameterizedContext, Next } from 'koa';
import { IResponse, IActivationCode, IUser, IDevice } from '../../../common';
import log from '../utils/logger';
import { v1 as uuidv1 } from 'uuid';

const logIn = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const devices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const { deviceId } = ctx.query;
  const { userName } = ctx.request.body;

  if (deviceId !== 'WEB') {
    const currDevice = devices?.find(
      device => (device.uid === deviceId || deviceId === 'WEB') && device.user === userName,
    );
    ctx.type = 'application/json';

    if (!currDevice) {
      log.info(`not such device (${deviceId})`);
      const res: IResponse<string> = { result: false, error: 'not device or user' };
      ctx.status = 404;
      ctx.body = JSON.stringify(res);
      return;
    }

    if (currDevice.isBlock) {
      log.info(`device(${deviceId}) does not have access`);
      const res: IResponse<undefined> = { result: false, error: 'does not have access' };
      ctx.status = 401;
      ctx.response.body = JSON.stringify(res);
      return;
    }
  }

  const user = (await promisify(cb => koaPassport.authenticate('local', cb)(ctx, next))()) as IUser | false;

  if (!user) {
    log.info('failed login attempt');
    const res: IResponse<undefined> = { result: false, error: 'не верный пользователь и\\или пароль' };
    ctx.status = 404;
    ctx.response.body = JSON.stringify(res);
    return;
  }

  ctx.login(user);

  delete user.password;

  log.info(`user ${user.id} successfully logged in`);

  const res: IResponse<IUser> = { result: true, data: user };
  ctx.status = 200;
  ctx.type = 'application/json';
  ctx.body = JSON.stringify(res);
};

/** Проверка текущего пользователя в сессии koa */
const getCurrentUser = (ctx: ParameterizedContext): void => {
  log.info(`user authenticated: ${ctx.state.user.userName}`);

  const user = ctx.state.user;

  delete user.password;

  const res: IResponse<IUser> = { result: true, data: user };
  ctx.status = 200;
  ctx.type = 'application/json';
  ctx.body = JSON.stringify(res);
};

const logOut = (ctx: ParameterizedContext): void => {
  const user = ctx.state.user.userName;
  log.info(`user ${user} successfully logged out`);

  ctx.logout();

  const res: IResponse<undefined> = { result: true };
  ctx.status = 200;
  ctx.type = 'application/json';
  ctx.body = JSON.stringify(res);
};

const signUp = async (ctx: ParameterizedContext): Promise<void> => {
  let newUser = ctx.request.body as IUser;
  ctx.type = 'application/json';
  if (!(await findByUserName(newUser.userName))) {
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    newUser = {
      id: newUser.userName,
      ...newUser,
      companies: newUser.companies ?? [],
      creatorId: ctx.state.user ? ctx.state.user.id : newUser.userName,
    };
    await writeFile(
      PATH_LOCAL_DB_USERS,
      JSON.stringify(
        allUsers
          ? [...allUsers, newUser]
          : [
              newUser,
              {
                id: 'gdmn',
                userName: 'gdmn',
                creatorId: newUser.userName,
                password: 'gdmn',
                companies: [],
              },
            ],
      ),
    );

    delete newUser.password;

    const res = { result: true, data: newUser };
    ctx.status = 201;
    ctx.body = JSON.stringify(res);
    log.info('signed up successful');
  } else {
    log.info('a user already exists');
    const res: IResponse<string> = { result: false, error: 'a user already exists' };
    ctx.status = 400;
    ctx.response.body = JSON.stringify(res);
  }
};

const verifyCode = async (ctx: ParameterizedContext): Promise<void> => {
  const { code, uid = '0' } = ctx.request.body;
  const codeList: IActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODES);
  const codeRec = codeList?.find(el => el.code === code);

  let result: IResponse<{ userId: string; deviceId: string }>;
  let status: number;
  ctx.type = 'application/json';

  if (codeRec) {
    const date = new Date(codeRec.date);
    date.setDate(date.getDate() + 7);

    if (date >= new Date()) {
      // Сохраняем список кодов без использованного
      /* TODO
        1) Вынести добавление устройства в utils
        2) сделать вызов добавления устройства из метода addDevice (контроллер Device) и отсюда ниже
        3) если uid = 0 то сгенерировать uid
      addDevice({}) */
      const deviceId = uid == '0' ? uuidv1() : uid;

      const newDevice = await addNewDevice({ userId: codeRec.user, deviceId });
      if (newDevice) {
        status = 200;
        result = { result: true, data: { userId: codeRec.user, deviceId: deviceId as string } };
      } else {
        status = 404;
        result = { result: false, error: 'error' };
        log.warn('error');
      }
      await writeFile(PATH_LOCAL_DB_ACTIVATION_CODES, JSON.stringify(codeList?.filter(el => el.code !== code)));
    } else {
      status = 404;
      result = { result: false, error: 'invalid activation code' };
      log.warn('invalid activation code');
    }
  } else {
    status = 404;
    result = { result: false, error: 'invalid activation code' };
    log.warn('invalid activation code');
  }
  ctx.status = status;
  ctx.body = JSON.stringify(result);
};

const getActivationCode = async (ctx: ParameterizedContext): Promise<void> => {
  const { userId }: { userId: string } = ctx.params;
  const code = await saveActivationCode(userId);
  ctx.status = 200;
  ctx.type = 'application/json';
  const result: IResponse<string> = { result: true, data: code };
  ctx.body = JSON.stringify(result);
  log.info('activation code generated successfully');
};

export { signUp, logIn, logOut, getCurrentUser, getActivationCode, verifyCode };
