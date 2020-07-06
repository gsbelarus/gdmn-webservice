import { Context, Next } from 'koa';
import { devices, deviceBinding } from '../services/dao/db';

export const deviceMiddleware = async (ctx: Context, next: Next) => {
  if (ctx.query.deviceId === 'WEB') {
    await next();
    return;
  }

  const device = await devices.find(ctx.query.deviceId);

  if (!device) {
    throw new Error('устройство не найдено');
  }

  const currDevice = await deviceBinding.find(i => i.deviceId === device.id && i.userId === ctx.state.user.id);

  if (!currDevice) {
    throw new Error('устройство для пользователя не найдено');
  }

  if (currDevice.state !== 'ACTIVE') {
    throw new Error('устройство заблокировано');
  }

  await next();
};
