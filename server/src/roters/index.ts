import Router from 'koa-router';
import { promisify } from 'util';
import koaPassport from 'koa-passport';
import { User } from '../models';
import { writeFile } from '../workWithFile';
import { PATH_LOCAL_DB } from '../rest';

const router = new Router();
router.get('/', async ctx => await getLogin(ctx));
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
      return user;
    } else {
      ctx.status = 204;
      ctx.body = JSON.stringify({ status: 204, result: 'неверный пароль или логин'});
    }
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'вы уже вошли'});
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
    ctx.body = JSON.stringify({ status: 200, result: 'вышел раньше или не заходил'});
    return undefined;
  }
}

const signup = (ctx: any) => {
  const newUser = ctx.request.body as User;
  writeFile(PATH_LOCAL_DB, JSON.stringify(newUser));
  ctx.body = JSON.stringify({ status: 200, result: 'This signup'});
}

export default router;
