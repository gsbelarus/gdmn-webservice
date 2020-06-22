import { Context, Next } from 'koa';

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    ctx.type = 'application/json';
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
};
