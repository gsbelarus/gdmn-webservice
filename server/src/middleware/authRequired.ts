import { Context } from 'koa';
import log from '../utils/logger';
import { IResponse } from '../../../common';

export const authMiddleware = async (ctx: Context, next: Function) => {
  if (!ctx.state.user) {
    log.info('not authenticated');
    const res: IResponse<string> = { result: false, error: 'not authenticated' };
    ctx.throw(401, JSON.stringify(res));
  }
  await next();
};
