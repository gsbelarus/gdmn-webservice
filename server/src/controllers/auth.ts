import log4js from 'log4js';
import koaPassport from 'koa-passport';
import { promisify } from 'util';
import { IUser } from '../models/models';
import { PATH_LOCAL_DB_USERS } from '../server';
import { readFile, writeFile } from '../utils/workWithFile';
import { findByUserName } from '../utils/util';
import { ParameterizedContext, Next } from 'koa';
import { IResponse } from '../models/requests';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const logIn = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  if (!ctx.isUnauthenticated()) {
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

    const res: IResponse<boolean | IUser> = { status: 200, result: user ? user : false };

    ctx.status = 200;
    ctx.body = JSON.stringify(res);
  }
};

/** Проверка текущего пользователя в сессии koa */
const getCurrentUser = (ctx: ParameterizedContext): void => {
  logger.info(`user authenticated: ${ctx.state.user.userName}`);

  const user = ctx.state.user;

  delete user.password;

  const res: IResponse<IUser> = { status: 200, result: user };

  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

const logOut = (ctx: ParameterizedContext): void => {
  const user = ctx.state.user.userName;
  logger.info(`user ${user} successfully logged out`);

  ctx.logout();

  const res: IResponse<string> = { status: 200, result: 'successfully logged out' };
  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

const signUp = async (ctx: ParameterizedContext): Promise<void> => {
  const newUser = ctx.request.body as IUser;
  if (!(await findByUserName(newUser.userName))) {
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    //  const code = await saveActivationCode(newUser.userName);
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
                code: 'jqgxmm',
              },
            ],
      ),
    );

    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: newUser });
    logger.info('signed up successful');
  } else {
    logger.info('a user already exists');
    const res: IResponse<string> = { status: 400, result: 'a user already exists' };
    ctx.throw(400, JSON.stringify(res));
  }
};

export { signUp, logIn, logOut, getCurrentUser };
