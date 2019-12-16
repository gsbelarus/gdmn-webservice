import Router from 'koa-router';
import { promisify } from 'util';
import koaPassport from 'koa-passport';
import { User } from '../models';

const router = new Router();
router.get('/', async ctx => await getLogin(ctx));
router.post('/login', async ctx => getLogin(ctx));
router.get('/signup', ctx => getSignup(ctx));
router.get('/authOrganization', ctx => getGetKeyAuthOrganization(ctx));

const getLogin = async (ctx: any) => {
  const user = await promisify((cb) => {
    koaPassport.authenticate('local', cb)(ctx, async () => {});
  })() as User | false;
  ctx.login(user);
  ctx.status = 200;
  ctx.body = JSON.stringify({ status: 200, result: user ? user.id : false});
}

const getSignup = (ctx: any) => {
  ctx.body = JSON.stringify({ status: 200, result: 'This signup'});
}

const getGetKeyAuthOrganization = (ctx: any) => {
  ctx.status = 200;
  ctx.body = JSON.stringify({ status: 200, result: 'getKeyAuthOrganization'});
}

export default router;
