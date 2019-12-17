import Router from 'koa-router';
import { promisify } from 'util';
import koaPassport from 'koa-passport';
import { User, ActivationCode } from '../models';
import { writeFile, readFile } from '../workWithFile';
import { PATH_LOCAL_DB, PATH_LOCAL_DB_ACTIVATION_CODE } from '../rest';

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
      return user;
    } else {
      ctx.status = 204;
      ctx.body = JSON.stringify({ status: 204, result: 'wrong password or login'});
    }
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'you are already logged in'});
    return ctx.state.user;
  }
}

const getMe = async (ctx: any) => {
  if(ctx.isAuthenticated()) {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: ctx.state.user});
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'not authenticated'});
  }
}

const getSignOut = (ctx: any) => {
  if(ctx.isAuthenticated()) {
    ctx.logout();
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'sign out successful'});
    return undefined;
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'left before or didn’t enter'});
    return undefined;
  }
}

const signup = (ctx: any) => {
  const newUser = ctx.request.body as User;
  writeFile(PATH_LOCAL_DB, JSON.stringify(newUser));
  ctx.body = JSON.stringify({ status: 200, result: 'This signup'});
}

const verifyCode = async(ctx: any) => {
  const data: ActivationCode[] = await readFile(PATH_LOCAL_DB_ACTIVATION_CODE);
  if (data.find(code => code.code === ctx.request.body.code)) {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'device activated successfully'});
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 404, result: 'invalid activation code'});
  }
}

export default router;
