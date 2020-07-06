import { Context, Next } from 'koa';

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { result: false, error: err.message };

    if (ctx.status <= 400) {
      ctx.app.emit('user-error', err, ctx);
    }
    if (ctx.status > 400 && ctx.status <= 500) {
      ctx.app.emit('error', err, ctx);
    }
  }
};
