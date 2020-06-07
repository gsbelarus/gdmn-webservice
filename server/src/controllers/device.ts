import { ParameterizedContext } from 'koa';
import { readFile, writeFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_DEVICES, PATH_LOCAL_DB_USERS } from '../server';
import log from '../utils/logger';
import { IDevice, IResponse, IUser } from '../../../common';

const getDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const uid: string = ctx.params.id;
  const { userName } = ctx.request.body;

  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);

  let device: IDevice | undefined = undefined;
  let result: IResponse<string | IDevice>;

  if (userName) {
    // Проверяем по пользователю
    device = allDevices?.find(device => device.uid === uid && device.user === userName);

    if (!device) {
      log.warn(`the device (${uid}) is not assigned to the user`);
      result = { result: false, error: `the device (${uid}) is not assigned to the user` };
      ctx.throw(422, JSON.stringify(result));
    }

    log.info(`device status for current user:${device.isBlock || ' not'} active`);
    result = { result: true, data: device };
    ctx.status = 200;
    ctx.body = JSON.stringify(result);
    return;
  }

  device = allDevices?.find(device => device.uid === uid);

  if (!device) {
    log.warn('device does not exist');
    result = { result: false, error: 'device does not exist' };
    ctx.throw(422, JSON.stringify(result));
  }
  result = { result: true, data: device };
  ctx.status = 200;
  ctx.body = JSON.stringify(result);
};

interface IDeviceState {
  uid: string;
  user: string;
  state: string;
}

const getDevices = async (ctx: ParameterizedContext): Promise<void> => {
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);

  const result: IResponse<Array<string | IDeviceState>> = {
    result: true,
    data:
      !allDevices || !allDevices.length
        ? []
        : allDevices.map(device => {
            return { uid: device.user, user: device.user, state: device.isBlock ? 'blocked' : 'active' };
          }),
  };
  log.info(`get devices successfully`);
  ctx.status = 200;
  ctx.body = JSON.stringify(result);
};

const getDeviceByCurrentUser = async (ctx: ParameterizedContext): Promise<void> => {
  const uid: string = ctx.params.id;
  const userId: string = ctx.state.user.id;

  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const device: IDevice | undefined = allDevices?.find(device => device.uid === uid && device.user === userId);

  let result: IResponse<string | IDevice>;

  if (device) {
    log.info(`device status for current user:${device?.isBlock || ' not'} active`);
    result = { result: true, data: device };
    ctx.status = 200;
    ctx.body = JSON.stringify(result);
  } else {
    log.warn(`the device (${uid}) is not assigned to the current user)`);
    result = { result: false, error: 'device does not exist' };
    ctx.throw(422, JSON.stringify(result));
  }
};

const addDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { uid, userId } = ctx.request.body;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  let result: IResponse<string | IDevice>;

  if (!(allDevices && allDevices.find(device => device.uid === uid && device.user === userId))) {
    const newDevice: IDevice = { uid, user: userId, isBlock: false };
    await writeFile(PATH_LOCAL_DB_DEVICES, JSON.stringify(allDevices ? [...allDevices, newDevice] : [newDevice]));
    log.info('a new device has been added');
    result = { result: true, data: newDevice };
    ctx.status = 201;
    ctx.body = JSON.stringify(result);
  } else {
    log.warn(`the device(${uid}) is assigned to the user(${userId})`);
    result = { result: false, error: `the device(${uid}) is assigned to the user(${userId})` };
    ctx.throw(422, JSON.stringify(result));
  }
};

interface IUserState {
  user: string;
  state: string;
}

const getUsersByDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const idDevice: string = ctx.params.id;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  const result: IResponse<Array<string | IUserState>> = {
    result: true,
    data:
      !allDevices || !allDevices.length
        ? []
        : allDevices
            .filter(device => device.uid === idDevice)
            .map(device => {
              const user = allUsers && allUsers.find(el => el.id === device.user);
              return user ? { user: user.userName, state: device.isBlock ? 'blocked' : 'active' } : 'not found user';
            }),
  };
  ctx.status = 200;
  ctx.body = JSON.stringify(result);
  log.info('get users by device successfully');
};

const editDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const uid: string = ctx.params.id;
  const userId: string = ctx.params.userId;
  const editPart = ctx.request.body;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const idx = allDevices && allDevices.findIndex(device => device.uid === uid && device.user === userId);

  if (!allDevices || idx === undefined || idx < 0) {
    log.warn('no such device');
    const res: IResponse<string> = { result: false, error: 'no such device' };
    ctx.throw(422, JSON.stringify(res));
  }
  const device: IDevice = { uid: uid, user: userId, ...editPart };

  await writeFile(
    PATH_LOCAL_DB_DEVICES,
    JSON.stringify([...allDevices.slice(0, idx), device, ...allDevices.slice(idx + 1)]),
  );
  log.info('a device edited successfully');
  const res: IResponse<IDevice> = { result: true, data: device };
  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

const removeDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const uid: string = ctx.params.id;
  const { userId } = ctx.request.body;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const idx = allDevices && allDevices.findIndex(device => device.uid === uid && device.user === userId);

  if (!allDevices || idx === undefined || idx < 0) {
    log.warn(`the device(${uid}) is not assigned to the user(${userId})`);
    const result: IResponse<string> = {
      result: false,
      error: `the device(${uid}) is not assigned to the user(${userId})`,
    };
    ctx.throw(422, JSON.stringify(result));
  } else {
    await writeFile(PATH_LOCAL_DB_DEVICES, JSON.stringify([...allDevices.slice(0, idx), ...allDevices.slice(idx + 1)]));
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
          { uid, user: userId, isBlock: true },
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
            .map(device => ({ uid: device.uid, state: device.isBlock ? 'blocked' : 'active' })),
  });
  log.info('get devices by user successfully');
};*/

export { getDevice, getDevices, getDeviceByCurrentUser, getUsersByDevice, addDevice, editDevice, removeDevice };
