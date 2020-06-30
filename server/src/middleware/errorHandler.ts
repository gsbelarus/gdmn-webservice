import { Context, Next } from 'koa';
import log from '../utils/logger';

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { result: false, error: err.message };
    ctx.app.emit('error', err, ctx);

    log.warn(err);
  }
};
