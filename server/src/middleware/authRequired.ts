import { Context, Next } from 'koa';

export const authMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  if (!ctx.state.user) {
    throw new Error('нет пройдена аутентификация');
  }
  await next();
};
