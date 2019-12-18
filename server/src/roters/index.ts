import Router from 'koa-router';
import { promisify } from 'util';
import koaPassport from 'koa-passport';
import { User, ActivationCode } from '../models';
import { writeFile, readFile } from '../workWithFile';
import { PATH_LOCAL_DB_USERS, PATH_LOCAL_DB_ACTIVATION_CODE } from '../rest';
import log4js from 'log4js';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const router = new Router();
router.get('/', async ctx => await getLogin(ctx));
router.post('/login', async ctx => getLogin(ctx));
router.get('/signout', async ctx => getSignOut(ctx));
router.post('/signup', ctx => signup(ctx));
router.get('/me', ctx => getMe(ctx));
router.get('/verifyCode', ctx => verifyCode(ctx));

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
      return user;
    } else {
      ctx.status = 204;
      ctx.body = JSON.stringify({ status: 204, result: 'wrong password or login'});
      logger.info('failed login attempt');
    }
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'you are already logged in'});
    logger.warn('this user has already logged in');
    return ctx.state.user;
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
    return undefined;
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'left before or didn’t enter'});
    logger.warn('left before or didn’t enter');
    return undefined;
  }
}

const signup = async (ctx: any) => {
  const newUser = ctx.request.body as User;
  await writeFile(PATH_LOCAL_DB_USERS, JSON.stringify(newUser));
  ctx.body = JSON.stringify({ status: 200, result: 'This signup'});
  logger.info('sign up successful');
}

const verifyCode = async(ctx: any) => {
  const data: ActivationCode[] = await readFile(PATH_LOCAL_DB_ACTIVATION_CODE);
  if (data.find(code => code.code === ctx.request.body.code)) {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'device activated successfully'});
    logger.info('device activated successfully');
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 404, result: 'invalid activation code'});
    logger.warn('invalid activation code');
  }
}

export default router;
