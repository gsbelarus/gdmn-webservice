import Router from 'koa-router';
import { Context } from 'koa';

const router = new Router();
router.get('/', ctx => getLogin(ctx));
router.get('/login', ctx => getLogin(ctx));
router.get('/signup', ctx => getSignup(ctx));
router.get('/authOrganization', ctx => getGetKeyAuthOrganization(ctx));

const getLogin = (ctx: Context) => {
  ctx.body = { status: 200, result: 'This login'};
}

const getSignup = (ctx: Context) => {
  ctx.body = { status: 200, result: 'This signup'};
}

const getGetKeyAuthOrganization = (ctx: Context) => {
  ctx.status = 200;
  ctx.body = { status: 200, result: 'getKeyAuthOrganization'};
}

export default router;
