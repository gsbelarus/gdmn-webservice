import koaPassport from 'koa-passport';
import { promisify } from 'util';
import { IUser, IActivationCode } from '../models/models';
import { PATH_LOCAL_DB_USERS, PATH_LOCAL_DB_ACTIVATION_CODES } from '../server';
import { readFile, writeFile } from '../utils/workWithFile';
import { findByUserName, saveActivationCode } from '../utils/util';
import { ParameterizedContext, Next } from 'koa';
import { IResponse } from '../models/requests';
import log from '../utils/logger';

const logIn = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const user = (await promisify(cb => koaPassport.authenticate('local', cb)(ctx, next))()) as IUser | false;

  if (!user) {
    log.info('failed login attempt');
    const res: IResponse<string> = { result: false, error: 'не верный пользователь и\\или пароль ' };
    ctx.throw(404, JSON.stringify(res));
  }

  ctx.login(user);

  if (ctx.isAuthenticated()) {
    delete user.password;

    log.info(`user ${user} successfully logged in`);

    const res: IResponse<IUser> = { result: true, data: user };
    ctx.status = 200;
    ctx.body = JSON.stringify(res);
  }
};

/** Проверка текущего пользователя в сессии koa */
const getCurrentUser = (ctx: ParameterizedContext): void => {
  log.info(`user authenticated: ${ctx.state.user.userName}`);

  const user = ctx.state.user;

  delete user.password;

  const res: IResponse<IUser> = { result: true, data: user };
  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

const logOut = (ctx: ParameterizedContext): void => {
  const user = ctx.state.user.userName;
  log.info(`user ${user} successfully logged out`);

  ctx.logout();

  const res: IResponse<string> = { result: true, data: 'successfully logged out' };
  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

const signUp = async (ctx: ParameterizedContext): Promise<void> => {
  const newUser = ctx.request.body as IUser;
  if (!(await findByUserName(newUser.userName))) {
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    await writeFile(
      PATH_LOCAL_DB_USERS,
      JSON.stringify(
        allUsers
          ? [...allUsers, { id: newUser.userName, ...newUser }]
          : [
              { id: newUser.userName, ...newUser },
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

    const res = { result: true, data: newUser };
    ctx.status = 201;
    ctx.body = JSON.stringify(res);
    log.info('signed up successful');
  } else {
    log.info('a user already exists');
    const res: IResponse<string> = { result: false, error: 'a user already exists' };
    ctx.throw(400, JSON.stringify(res));
  }
};

const verifyCode = async (ctx: ParameterizedContext): Promise<void> => {
  const data: IActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODES);
  const code = data && data.find(el => el.code === ctx.query.code);
  let result: IResponse<string>;
  let status: number;

  if (code) {
    const date = new Date(code.date);
    date.setDate(date.getDate() + 7);

    if (date >= new Date()) {
      await writeFile(PATH_LOCAL_DB_ACTIVATION_CODES, JSON.stringify(data?.filter(el => el.code !== ctx.query.code)));
      status = 200;
      result = { result: true, data: code.user };
      log.info('device has been successfully activated');
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
  const userId = ctx.query.user;
  const code = await saveActivationCode(userId);
  ctx.status = 200;
  const result: IResponse<string> = { result: true, data: code };
  ctx.body = JSON.stringify(result);
  log.info('activation code generated successfully');
};

export { signUp, logIn, logOut, getCurrentUser, getActivationCode, verifyCode };
