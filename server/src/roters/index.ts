import Router from 'koa-router';
import { promisify } from 'util';
import koaPassport from 'koa-passport';
import { User, ActivationCode } from '../models';
import { writeFile, readFile } from '../workWithFile';
import { PATH_LOCAL_DB_USERS, PATH_LOCAL_DB_ACTIVATION_CODE, findByEmail } from '../rest';
import log4js from 'log4js';
import { generateCode } from '../generateCode';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const router = new Router();
router.get('/', async ctx => await getLogin(ctx));
router.post('/login', async ctx => getLogin(ctx));
router.get('/signout', async ctx => getSignOut(ctx));
router.post('/signup', ctx => signup(ctx));
router.get('/me', ctx => getMe(ctx));
router.get('/verifyCode', ctx => verifyCode(ctx));
router.get('/getActivationCode', ctx => getActivationCode(ctx));

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

const verifyCode = async(ctx: any) => {
  const data: ActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODE);
  const code = data && data.find(code => code.code === ctx.request.body.code);
  if (code) {
    const date = new Date(code.date);
    date.setDate(date.getDate() + 7);
    if(date >= new Date()) {
      ctx.status = 200;
      ctx.body = JSON.stringify({ status: 200, result: 'device activated successfully'});
      logger.info('device activated successfully');
      } else {
        ctx.status = 200;
        ctx.body = JSON.stringify({ status: 404, result: 'invalid activation code'});
        logger.warn('invalid activation code');
      }
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 404, result: 'invalid activation code'});
    logger.warn('invalid activation code');
  }
}

const getActivationCode = async(ctx: any) => {
  const userName = ctx.request.body.user;
  const code = await saveActivationCode(userName);
  ctx.status = 200;
  ctx.body = JSON.stringify({ status: 200, result: code});
  logger.info('activation code generate successfully');
}

const saveActivationCode = async (idUser: string) => {
  const code = generateCode(idUser);
  const allCodes: ActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODE);
  await writeFile(
    PATH_LOCAL_DB_ACTIVATION_CODE,
    JSON.stringify(allCodes
      ? [...allCodes, {code, date: (new Date()).toString(), user: idUser}]
      : [{code, date: Date().toString(), user: idUser}]
    )
  );
  return code;
}

export default router;
