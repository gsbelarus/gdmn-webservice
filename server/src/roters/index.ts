import Router from 'koa-router';
import { promisify } from 'util';
import koaPassport from 'koa-passport';
import { User } from '../models';

const router = new Router();
router.get('/', async ctx => await getLogin(ctx));
router.post('/login', async ctx => getLogin(ctx));
router.get('/signout', async ctx => getSignOut(ctx));
router.get('/signup', ctx => getSignup(ctx));
router.get('/me', ctx => getMe(ctx));
router.get('/authOrganization', ctx => getGetKeyAuthOrganization(ctx));

const getLogin = async (ctx: any) => {
  const user = await promisify((cb) => {
    koaPassport.authenticate('local', cb)(ctx, async () => {});
  })() as User | false;
  ctx.login(user);
  ctx.status = 200;
  ctx.body = JSON.stringify({ status: 200, result: user ? user.id : false});
  return user;
}

const getMe = async (ctx: any) => {
  if(ctx.isAuthenticated()) {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: ctx.passport.user});
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'not authenticated'});
  }
}

const getSignOut = (ctx: any) => {
  if(ctx.isAuthenticated()) {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'sign out successful'});
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'вышел раньше или не заходил'});
  }
}

const getSignup = (ctx: any) => {
  ctx.body = JSON.stringify({ status: 200, result: 'This signup'});
}

const getGetKeyAuthOrganization = (ctx: any) => {
  ctx.status = 200;
  ctx.body = JSON.stringify({ status: 200, result: 'getKeyAuthOrganization'});
}

export default router;
