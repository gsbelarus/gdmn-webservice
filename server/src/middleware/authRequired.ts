import { Context, Next } from 'koa';
import log from '../utils/logger';
import { IResponse } from '../../../common';

export const authMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  if (!ctx.state.user) {
    log.info('authMiddleware: not authenticated');
    const res: IResponse<string> = { result: false, error: 'not authenticated' };
    ctx.status = 401;
    ctx.type = 'application/json';
    ctx.body = JSON.stringify(res);
    return;
  }
  await next();
};
