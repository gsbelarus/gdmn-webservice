import { Context } from 'koa';
import { IResponse } from '../models/requests';
import log from '../utils/logger';

export const authMiddleware = async (ctx: Context, next: Function) => {
  if (!ctx.state.user) {
    log.info('not authenticated');
    const res: IResponse<string> = { result: false, error: 'not authenticated' };
    ctx.throw(401, JSON.stringify(res));
  }
  await next();
};
