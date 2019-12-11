import Router from 'koa-router';
import { Context } from 'koa';

const router = new Router();
  router.get('/', ctx => getIndex(ctx));
  router.get('/login', ctx => getLogin(ctx));

  const getIndex = (ctx: Context) => {
    ctx.body = 'This index';
  }

  const getLogin = (ctx: Context) => {
    ctx.body = 'This login';
  }

  export default router;