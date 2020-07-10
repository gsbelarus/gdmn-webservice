import { Context, Next } from 'koa';
import { devices } from '../services/dao/db';

export const deviceMiddleware = async (ctx: Context, next: Next) => {
  // if (ctx.query.deviceId === 'WEB') {
  //   await next();
  //   return;
  // }

  if (!ctx.query.deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  const currDevice = await devices.find(device => device.uid === ctx.query.deviceId);

  if (!currDevice) {
    ctx.throw(400, 'устройство не найдено');
  }

  // ctx.params.deviceId = currDevice.id;
  await next();
};
