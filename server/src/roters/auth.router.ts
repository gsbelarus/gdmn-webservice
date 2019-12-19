import Router from 'koa-router';
import log4js from 'log4js';
import koaPassport from 'koa-passport';
import { promisify } from 'util';
import { User } from '../models';
import { findByEmail, PATH_LOCAL_DB_USERS } from '../rest';
import { readFile, writeFile } from '../workWithFile';
import { saveActivationCode } from './util';

const router = new Router();
const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

router.post('/login', async ctx => getLogin(ctx));
router.get('/signout', async ctx => getSignOut(ctx));
router.post('/signup', ctx => signup(ctx));
router.get('/me', ctx => getMe(ctx));

const getLogin = async (ctx: any) => {
  if(ctx.isUnauthenticated()) {
    const user = await promisify((cb) => {
      koaPassport.authenticate('local', cb)(ctx, async () => {});
    })() as User | false;
    ctx.login(user);
    if(ctx.isAuthenticated()) {
      ctx.status = 200;
      ctx.body = JSON.stringify({ status: 200, result: user ? user.id : false});
      logger.info(`login user ${user}`);
    } else {
      ctx.status = 200;
      ctx.body = JSON.stringify({ status: 404, result: 'wrong password or login'});
      logger.info('failed login attempt');
    }
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'you are already logged in'});
    logger.warn('this user has already logged in');
  }
}

const getMe = async (ctx: any) => {
  if(ctx.isAuthenticated()) {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: ctx.state.user});
    logger.info(`user authenticated: ${ctx.state.user}`);
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'not authenticated'});
    logger.info('is unauthenticated');
  }
}

const getSignOut = (ctx: any) => {
  if(ctx.isAuthenticated()) {
    ctx.logout();
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'sign out successful'});
    logger.info(`user ${ctx.state.user.userName} sign out successful`);
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'left before or didn’t enter'});
    logger.warn('left before or didn’t enter');
  }
}

const signup = async (ctx: any) => {
  const newUser = ctx.request.body as User;
  if(!(await findByEmail(newUser.userName))) {
    const allUsers: User[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    await writeFile(PATH_LOCAL_DB_USERS, JSON.stringify(allUsers ? [...allUsers, {id: newUser.userName, ...newUser}] : [{id: newUser.userName, ...newUser}]));
    ctx.body = JSON.stringify({ status: 200, result: await saveActivationCode(newUser.userName)});
    logger.info('sign up successful');
  } else {
    ctx.body = JSON.stringify({ status: 404, result: 'such user already exists'});
    logger.info('such user already exists');
  }
}

export default router;
