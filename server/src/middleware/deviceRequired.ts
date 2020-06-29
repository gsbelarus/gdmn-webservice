import { Context, Next } from 'koa';
import log from '../utils/logger';
import { IResponse } from '../../../common';
import { devices } from '../services/dao/db';

export const deviceMiddleware = async (ctx: Context, next: Next) => {
  if (ctx.query.deviceId === 'WEB') {
    await next();
    return;
  }

  if (!ctx.query.deviceId) {
    const res: IResponse = { result: false, error: 'не указан идентификатор устройства' };
    ctx.throw(400, JSON.stringify(res));
  }

  const currDevice = await devices.find(
    device => device.uid === ctx.query.deviceId && device.user === ctx.state.user.id,
  );

  if (!currDevice) {
    log.info(`device (${ctx.query.deviceId}) not found`);
    const res: IResponse = { result: false, error: 'устройство не найдено' };
    ctx.throw(400, JSON.stringify(res));
  }

  if (currDevice.blocked) {
    log.info(`device (${ctx.query.deviceId}) is blocked`);
    const res: IResponse = { result: false, error: 'устройство заблокировано' };
    ctx.throw(401, JSON.stringify(res));
  }

  await next();
};
