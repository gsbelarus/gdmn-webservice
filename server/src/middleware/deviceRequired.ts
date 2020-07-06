import { Context, Next } from 'koa';
import { devices } from '../services/dao/db';

export const deviceMiddleware = async (ctx: Context, next: Next) => {
  if (ctx.query.deviceId === 'WEB') {
    await next();
    return;
  }

  if (!ctx.query.deviceId) {
    throw new Error('не указан идентификатор устройства');
  }

  const currDevice = await devices.find(device => device.uid === ctx.query.deviceId);

  if (!currDevice) {
    throw new Error('устройство не найдено');
  }

  await next();
};
