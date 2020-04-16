import { Context } from 'koa';
import { IResponse } from '../models/requests';
import log from '../utils/logger';
import { readFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_DEVICES } from '../server';
import { IDevice } from '../models/models';

export const deviceMiddleware: (ctx: Context, next: Function) => void = async (ctx: Context, next: Function) => {
  if (!ctx.query.devicId) {
    log.info('not such all parameters');
    const res: IResponse<string> = { status: 422, result: 'not such all parameters' };
    ctx.throw(422, JSON.stringify(res));
  }

  const devices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const currDevice = devices?.find(device => device.uid === ctx.query.devicId && device.user === ctx.state.user.id);

  if (!devices || !currDevice) {
    log.info(`not such device(${ctx.query.devicId})`);
    const res: IResponse<string> = { status: 404, result: 'not such device' };
    ctx.throw(404, JSON.stringify(res));
  }

  if (currDevice.isBlock) {
    log.info(`device(${ctx.query.devicId}) does not have access`);
    const res: IResponse<string> = { status: 401, result: 'does not have access' };
    ctx.throw(401, JSON.stringify(res));
  }

  return next();
};
