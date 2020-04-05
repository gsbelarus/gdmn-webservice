import { Context } from 'koa';
import log4js from 'log4js';
import { IResponse } from '../models/requests';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

export const authMiddleware: (ctx: Context, next: Function) => void = (ctx: Context, next: Function) => {
  if (!ctx.state.user) {
    logger.info('not authenticated');
    const res: IResponse<string> = { status: 401, result: 'not authenticated' };
    ctx.throw(401, JSON.stringify(res));
  }
  return next();
};
