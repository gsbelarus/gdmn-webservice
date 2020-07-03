import { ParameterizedContext, Next, Context } from 'koa';
import { IResponse, IActivationCode, IUser } from '../../../common';
import log from '../utils/logger';
// import { v1 as uuidv1 } from 'uuid';
import { authService, deviceService } from '../services';

/** Вход пользователя */
const logIn = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const { deviceId } = ctx.query;
  const { userName, password } = ctx.request.body;

  if (!userName) {
    ctx.throw(400, 'не указано имя пользователя');
  }

  if (!password) {
    ctx.throw(400, 'не указан пароль');
  }

  if (!deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  try {
    await authService.authenticate(ctx as Context, next);

    const user = ctx.state.user as IUser;

    const result: IResponse<string> = { result: true, data: user.id };

    ctx.status = 200;
    ctx.body = result;

    log.info(`User '${user.id}' is successfully logged in`);
  } catch (err) {
    ctx.throw(404, err.message);
  }
};

/** Проверка текущего пользователя в сессии koa */
const getCurrentUser = (ctx: ParameterizedContext): void => {
  const user = ctx.state.user;

  delete user.password;

  const res: IResponse<string> = { result: true, data: user.id };

  ctx.status = 200;
  ctx.body = res;

  log.info(`user authenticated: ${ctx.state.user.userName}`);
};

const logOut = (ctx: Context): void => {
  const user = ctx.state.user;

  ctx.logout();

  const res: IResponse = { result: true };

  ctx.status = 200;
  ctx.body = res;

  log.info(`user '${user.userName}' successfully logged out`);
};

const signUp = async (ctx: ParameterizedContext): Promise<void> => {
  /*
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
    await writeFile({
      filename: PATH_LOCAL_DB_USERS,
      data: JSON.stringify(
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
    });

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
  } */
};

const verifyCode = async (ctx: ParameterizedContext): Promise<void> => {
  // const { code, uid = '0' } = ctx.request.body;
  // const codeList: IActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODES);
  // const codeRec = codeList?.find(el => el.code === code);
  // let result: IResponse<{ userId: string; deviceId: string }>;
  // let status: number;
  // ctx.type = 'application/json';
  // if (codeRec) {
  //   const date = new Date(codeRec.date);
  //   date.setDate(date.getDate() + 7);
  //   if (date >= new Date()) {
  //     // Сохраняем список кодов без использованного
  //     /* TODO
  //       1) Вынести добавление устройства в utils
  //       2) сделать вызов добавления устройства из метода addDevice (контроллер Device) и отсюда ниже
  //       3) если uid = 0 то сгенерировать uid
  //     addDevice({}) */
  //     const deviceId = uid == '0' ? uuidv1() : uid;
  //     const newDevice = await addNewDevice({ userId: codeRec.user, deviceId });
  //     if (newDevice) {
  //       status = 200;
  //       result = { result: true, data: { userId: codeRec.user, deviceId: deviceId as string } };
  //     } else {
  //       status = 404;
  //       result = { result: false, error: 'error' };
  //       log.warn('error');
  //     }
  //     await writeFile({
  //       filename: PATH_LOCAL_DB_ACTIVATION_CODES,
  //       data: JSON.stringify(codeList?.filter(el => el.code !== code)),
  //     });
  //   } else {
  //     status = 404;
  //     result = { result: false, error: 'invalid activation code' };
  //     log.warn('invalid activation code');
  //   }
  // } else {
  //   status = 404;
  //   result = { result: false, error: 'invalid activation code' };
  //   log.warn('invalid activation code');
  // }
  // ctx.status = status;
  // ctx.body = JSON.stringify(result);
};

const getActivationCode = async (ctx: ParameterizedContext): Promise<void> => {
  const { userId } = ctx.params;

  if (!userId) {
    ctx.throw(400, 'не указан идентификатор пользователя');
  }

  try {
    const code = await deviceService.genActivationCode(userId);
    const result: IResponse<string> = { result: true, data: code };

    ctx.status = 200;
    ctx.body = result;

    log.info('activation code generated successfully');
} catch (err) {
    ctx.throw(404, err.message);
  }
};

export { signUp, logIn, logOut, getCurrentUser, getActivationCode, verifyCode };
