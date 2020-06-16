import { Context } from 'koa';
import log from '../utils/logger';
import { readFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_DEVICES } from '../server';
import { IResponse, IDevice } from '../../../common';

export const deviceMiddleware = async (ctx: Context, next: Function) => {
  if (ctx.query.deviceId === "WEB") {
    await next();
    return;
  }

  ctx.type = 'application/json';
  if (!ctx.query.deviceId) {
    log.info('not such all parameters');
    const res: IResponse<undefined> = { result: false, error: 'not such all parameters' };
    ctx.status = 422;
    ctx.body = JSON.stringify(res);
    return;
  }

  const devices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const currDevice = devices?.find(device => device.uid === ctx.query.deviceId && device.user === ctx.state.user.id);

  if (!currDevice) {
    log.info(`not such device (${ctx.query.deviceId})`);
    const res: IResponse<undefined> = { result: false, error: 'not such device' };
    ctx.status = 404;
    ctx.body = JSON.stringify(res);
    return;
  }

  if (currDevice.isBlock) {
    log.info(`device (${ctx.query.deviceId}) does not have access`);
    const res: IResponse<undefined> = { result: false, error: 'does not have access' };
    ctx.status = 401;
    ctx.body = JSON.stringify(res);
    return;
  }

  await next();
};
