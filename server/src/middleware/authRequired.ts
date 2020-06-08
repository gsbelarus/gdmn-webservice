import { Context } from 'koa';
import log from '../utils/logger';
import { IResponse } from '../../../common';

export const authMiddleware = async (ctx: Context, next: Function) => {
  if (!ctx.state.user) {
    log.info('not authenticated');
    const res: IResponse<string> = { result: false, error: 'not authenticated' };
    ctx.status = 401;
    ctx.type = 'application/json';
    ctx.body = JSON.stringify(res);
    return;
  }
  await next();
};
