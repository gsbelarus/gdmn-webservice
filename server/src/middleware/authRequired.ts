import { Context } from 'koa';
import { IResponse } from '../models/requests';
import log from '../utils/logger';

export const authMiddleware: (ctx: Context) => void = (ctx: Context) => {
  if (!ctx.state.user) {
    log.info('not authenticated');
    const res: IResponse<string> = { status: 401, result: 'not authenticated' };
    ctx.throw(401, JSON.stringify(res));
  }
};
