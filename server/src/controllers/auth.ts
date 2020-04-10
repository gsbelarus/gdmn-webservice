import log4js from 'log4js';
import koaPassport from 'koa-passport';
import { promisify } from 'util';
import { IUser, IActivationCode } from '../models/models';
import { PATH_LOCAL_DB_USERS, PATH_LOCAL_DB_ACTIVATION_CODES } from '../server';
import { readFile, writeFile } from '../utils/workWithFile';
import { findByUserName, saveActivationCode } from '../utils/util';
import { ParameterizedContext, Next } from 'koa';
import { IResponse } from '../models/requests';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const logIn = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  if (ctx.isAuthenticated()) {
    logger.warn('User has already logged in');
    const res: IResponse<string> = { status: 400, result: 'you are already logged in' };
    ctx.throw(400, JSON.stringify(res));
  }

  const user = (await promisify(cb => koaPassport.authenticate('local', cb)(ctx, next))()) as IUser | false;

  if (!user) {
    logger.info('failed login attempt');
    const res: IResponse<string> = { status: 400, result: 'incorrect login or password' };
    ctx.throw(400, JSON.stringify(res));
  }

  ctx.login(user);

  if (ctx.isAuthenticated()) {
    delete user.password;

    logger.info(`user ${user} successfully logged in`);

    const res: IResponse<boolean | IUser> = { status: 200, result: user || false };

    ctx.body = JSON.stringify(res);
  }
};

/** Проверка текущего пользователя в сессии koa */
const getCurrentUser = (ctx: ParameterizedContext): void => {
  logger.info(`user authenticated: ${ctx.state.user.userName}`);

  const user = ctx.state.user;

  delete user.password;

  const res: IResponse<IUser> = { status: 200, result: user };

  ctx.body = JSON.stringify(res);
};

const logOut = (ctx: ParameterizedContext): void => {
  const user = ctx.state.user.userName;
  logger.info(`user ${user} successfully logged out`);

  ctx.logout();

  const res: IResponse<string> = { status: 200, result: 'successfully logged out' };
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

    ctx.body = JSON.stringify({ status: 200, result: newUser });
    logger.info('signed up successful');
  } else {
    logger.info('a user already exists');
    const res: IResponse<string> = { status: 400, result: 'a user already exists' };
    ctx.throw(400, JSON.stringify(res));
  }
};

const verifyCode = async (ctx: ParameterizedContext): Promise<void> => {
  const data: IActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODES);
  const code = data && data.find(el => el.code === ctx.query.code);
  let result: IResponse<string>;

  if (code) {
    const date = new Date(code.date);
    date.setDate(date.getDate() + 7);

    if (date >= new Date()) {
      await writeFile(PATH_LOCAL_DB_ACTIVATION_CODES, JSON.stringify(data?.filter(el => el.code !== ctx.query.code)));
      result = { status: 200, result: code.user };
      logger.info('device has been successfully activated');
    } else {
      result = { status: 202, result: 'invalid activation code' };
      logger.warn('invalid activation code');
    }
  } else {
    result = { status: 202, result: 'invalid activation code' };
    logger.warn('invalid activation code');
  }
  ctx.body = JSON.stringify(result);
};

const getActivationCode = async (ctx: ParameterizedContext): Promise<void> => {
  const userId = ctx.query.user;
  const code = await saveActivationCode(userId);
  ctx.body = JSON.stringify({ status: 200, result: code });
  logger.info('activation code generated successfully');
};

export { signUp, logIn, logOut, getCurrentUser, getActivationCode, verifyCode };
