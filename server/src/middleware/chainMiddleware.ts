import { Context } from 'koa';
import { authMiddleware } from './authRequired';
import { deviceMiddleware } from './deviceRequired';

export const chainMiddleware = (ctx: Context, next: Function) => {
  authMiddleware(ctx);
  deviceMiddleware(ctx);
  return next();
};
