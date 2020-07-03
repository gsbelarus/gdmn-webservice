import { Context, ParameterizedContext } from 'koa';
import log from '../utils/logger';
import { IDevice, IResponse, IDeviceState } from '../../../common';
import { deviceService } from '../services';

const getDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId }: { id: string } = ctx.params;
  const { userId }: { userId: string } = ctx.request.body;

  if (!deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  try {
    const device = await deviceService.findOne({ deviceId, userId });

    const result: IResponse<string | IDevice> = { result: true, data: device };

    if (!device) {
      ctx.throw(422, `устройство '${deviceId}' не найдено`);
    }

    ctx.status = 200;
    ctx.body = result;

    log.info(`getDevice: device status for current user:${device.blocked || ' not'} active`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const getDevices = async (ctx: ParameterizedContext): Promise<void> => {
  try {
    const deviceList = await deviceService.findAll();

    const result: IResponse<IDevice[]> = { result: true, data: deviceList };

    ctx.status = 200;
    ctx.body = result;

    log.info(`getDevices: OK`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const getDeviceByCurrentUser = async (ctx: Context): Promise<void> => {
  const { id: deviceId }: { id: string } = ctx.params;
  const { id: userId }: { id: string } = ctx.state.user;

  if (!deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  if (!userId) {
    ctx.throw(400, 'не указан идентификатор пользователя');
  }

  try {
    const device = await deviceService.findOne({ deviceId, userId });

    if (!device) {
      ctx.throw(422, `устройство '${deviceId}' не найдено`);
    }

    const result: IResponse<IDevice> = { result: true, data: device };

    ctx.status = 200;
    ctx.body = result;

    log.info(`getDevice: device status for current user:${device.blocked || ' not'} active`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const addDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { uid: deviceId, userId } = ctx.request.body;

  if (!deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  if (!userId) {
    ctx.throw(400, 'не указан идентификатор пользователя');
  }

  try {
    const device = await deviceService.addOne({ userId, deviceId });

    const result: IResponse<IDevice> = { result: true, data: device };

    ctx.status = 201;
    ctx.body = result;

    log.info(`addDevice: OK`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const getUsersByDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId }: { id: string } = ctx.params;

  if (!deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  try {
    const userList = await deviceService.findUsers(deviceId);

    const result: IResponse<IDeviceState[]> = { result: true, data: userList };

    ctx.status = 200;
    ctx.body = result;

    log.info('getUsersByDevice: ok');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const updateDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const uid: string = ctx.params.id;
  const userId: string = ctx.params.userId;
  const editPart = ctx.request.body;

  const idx = (await devices.read()).findIndex(device => device.uid === uid && device.user === userId);
  ctx.type = 'application/json';

  if (!devices || idx === undefined || idx < 0) {
    log.warn('no such device');
    const res: IResponse<string> = { result: false, error: 'no such device' };
    ctx.status = 422;
    ctx.body = JSON.stringify(res);
    return;
  }
  const device: IDevice = { uid: uid, user: userId, ...editPart };
  // TODO перенести в службы
  /*   await writeFile({
    filename: PATH_LOCAL_DB_DEVICES,
    data: JSON.stringify([...allDevices.slice(0, idx), device, ...allDevices.slice(idx + 1)]),
  }); */

  log.info('a device edited successfully');
  const res: IResponse<IDevice> = { result: true, data: device };
  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

const removeDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const uid: string = ctx.params.id;
  const { userId } = ctx.request.body;

  const idx = (await devices.read()).findIndex(device => device.uid === uid && device.user === userId);
  ctx.type = 'application/json';

  if (!devices || idx === undefined || idx < 0) {
    log.warn(`the device(${uid}) is not assigned to the user(${userId})`);
    const result: IResponse<string> = {
      result: false,
      error: `the device(${uid}) is not assigned to the user(${userId})`,
    };
    ctx.status = 422;
    ctx.body = JSON.stringify(result);
  } else {
    // await writeFile({
    //   filename: PATH_LOCAL_DB_DEVICES,
    //   data: JSON.stringify([...allDevices.slice(0, idx), ...allDevices.slice(idx + 1)]),
    // });
    log.info('device removed successfully');
    ctx.status = 204;
  }
};

/*const lockDevice = async (ctx: ParameterizedContext): Promise<void> => {
  if (ctx.isAuthenticated()) {
    const { uid, userId } = ctx.request.body;
    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    const idx = allDevices && allDevices.findIndex(device => device.uid === uid && device.user === userId);
    if (!allDevices || idx === undefined || idx < 0) {
      ctx.body = JSON.stringify({ status: 422, result: `the device(${uid}) is not assigned to the user(${userId})` });
      log.warn(`the device(${uid}) is not assigned to the user(${userId})`);
    } else {
      await writeFile(
        PATH_LOCAL_DB_DEVICES,
        JSON.stringify([
          ...allDevices.slice(0, idx),
          { uid, user: userId, blocked: true },
          ...allDevices.slice(idx + 1),
        ]),
      );
      ctx.body = JSON.stringify({ status: 200, result: 'device locked successfully' });
      log.info('device locked successfully');
    }
  } else {
    ctx.body = JSON.stringify({ status: 401, result: 'access denied' });
    log.warn('access denied');
  }
};

const getDevicesByUser = async (ctx: ParameterizedContext): Promise<void> => {
  const userId: string = ctx.params.id;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  ctx.body = JSON.stringify({
    status: 200,
    result:
      !allDevices || !allDevices.length
        ? []
        : allDevices
            .filter(device => device.user === userId)
            .map(device => ({ uid: device.uid, state: device.blocked ? 'blocked' : 'active' })),
  });
  log.info('get devices by user successfully');
};*/

export { getDevice, getDevices, getDeviceByCurrentUser, getUsersByDevice, addDevice, updateDevice, removeDevice };
