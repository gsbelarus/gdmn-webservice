import { ParameterizedContext } from 'koa';
import { IDevice, IUser } from '../models/models';
import { readFile, writeFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_DEVICES, PATH_LOCAL_DB_USERS } from '../server';

import log4js from 'log4js';
import { IResponse } from '../models/requests';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const getDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const uid: string = ctx.params.id;

  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const device = allDevices?.find(device => device.uid === uid);

  const result: IResponse<boolean> = { status: device ? 200 : 400, result: !!device };
  logger.warn(`device (${uid}) ${device || 'does not'} exist`);

  ctx.status = device ? 200 : 400;
  ctx.body = JSON.stringify(result);
};

const getDeviceByCurrentUser = async (ctx: ParameterizedContext): Promise<void> => {
  const uid: string = ctx.params.id;
  const userId: string = ctx.state.user.id;

  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const device: IDevice | undefined = allDevices?.find(device => device.uid === uid && device.user === userId);

  let result: IResponse<string | boolean>;

  if (device) {
    logger.info(`device status for current user:${device?.isBlock || ' not'} active`);
    result = { status: 200, result: !device?.isBlock };
  } else {
    logger.warn(`the device (${uid}) is not assigned to the current user)`);
    result = { status: 200, result: `the device (${uid}) is not assigned to the current user` };
  }
  ctx.body = JSON.stringify(result);
};

const addDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { uid, userId } = ctx.request.body;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  if (!(allDevices && allDevices.find(device => device.uid === uid && device.user === userId))) {
    await writeFile(
      PATH_LOCAL_DB_DEVICES,
      JSON.stringify(
        allDevices ? [...allDevices, { uid, user: userId, isBlock: false }] : [{ uid, user: userId, isBlock: false }],
      ),
    );
    ctx.body = JSON.stringify({ status: 200, result: 'a new device has been added' });
    logger.info('a new device has been added');
  } else {
    ctx.body = JSON.stringify({ status: 400, result: `the device(${uid}) is assigned to the user(${userId})` });
    logger.warn(`the device(${uid}) is assigned to the user(${userId})`);
  }
};

const getUsersByDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const idDevice: string = ctx.params.id;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  ctx.body = JSON.stringify({
    status: 200,
    result:
      !allDevices || !allDevices.length
        ? []
        : allDevices
            .filter(device => device.uid === idDevice)
            .map(device => {
              const user = allUsers && allUsers.find(el => el.id === device.user);
              return user ? { user: user.userName, state: device.isBlock ? 'blocked' : 'active' } : 'not found user';
            }),
  });
  logger.info('get users by device successfully');
};

const editDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const uid: string = ctx.params.id;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  if (!(allDevices && allDevices.find(device => device.uid === uid))) {
    logger.info(`edit device (${uid}) successfully`);
  }
};

const removeDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const uid: string = ctx.params.id;
  const { userId } = ctx.request.body;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const idx = allDevices && allDevices.findIndex(device => device.uid === uid && device.user === userId);
  if (!allDevices || idx === undefined || idx < 0) {
    ctx.body = JSON.stringify({ status: 200, result: `the device(${uid}) is not assigned to the user(${userId})` });
    logger.warn(`the device(${uid}) is not assigned to the user(${userId})`);
  } else {
    await writeFile(PATH_LOCAL_DB_DEVICES, JSON.stringify([...allDevices.slice(0, idx), ...allDevices.slice(idx + 1)]));
    ctx.body = JSON.stringify({ status: 200, result: 'device removed successfully' });
    logger.info('device removed successfully');
  }
};

const lockDevice = async (ctx: ParameterizedContext): Promise<void> => {
  if (ctx.isAuthenticated()) {
    const { uid, userId } = ctx.request.body;
    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    const idx = allDevices && allDevices.findIndex(device => device.uid === uid && device.user === userId);
    if (!allDevices || idx === undefined || idx < 0) {
      ctx.body = JSON.stringify({ status: 400, result: `the device(${uid}) is not assigned to the user(${userId})` });
      logger.warn(`the device(${uid}) is not assigned to the user(${userId})`);
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
      logger.info('device locked successfully');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: 'access denied' });
    logger.warn('access denied');
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
  logger.info('get devices by user successfully');
};

export {
  getDevice,
  getDeviceByCurrentUser,
  getDevicesByUser,
  getUsersByDevice,
  addDevice,
  lockDevice,
  editDevice,
  removeDevice,
};
