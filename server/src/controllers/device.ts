import { ParameterizedContext } from 'koa';
import { IDevice } from '../models/models';
import { readFile, writeFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_DEVICES } from '../server';

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

const newDevice = async (ctx: ParameterizedContext): Promise<void> => {
  if (ctx.isUnauthenticated()) {
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
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: 'access denied' });
    logger.warn('access denied');
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

const lockDevices = async (ctx: ParameterizedContext): Promise<void> => {
  if (ctx.isAuthenticated()) {
    const { uIds, userId } = ctx.request.body;
    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    if (
      !uIds ||
      !userId ||
      !allDevices?.filter(device => uIds.findIndex((u: string) => u === device.uid) > -1 && device.user === userId)
        .length
    ) {
      ctx.body = JSON.stringify({
        status: 200,
        result: `the devices(${JSON.stringify(uIds)}) is not assigned to the user(${userId})`,
      });
      logger.warn(`the device(${JSON.stringify(uIds)}) is not assigned to the user(${userId})`);
    } else {
      const newDevices = allDevices?.map(device =>
        uIds.findIndex((u: string) => u === device.uid) > -1 && device.user === userId
          ? { ...device, isBlock: true }
          : device,
      );
      await writeFile(PATH_LOCAL_DB_DEVICES, JSON.stringify(newDevices));
      ctx.body = JSON.stringify({ status: 200, result: 'devices locked successfully' });
      logger.info('devices locked successfully');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: 'access denied' });
    logger.warn('access denied');
  }
};

const removeDevice = async (ctx: ParameterizedContext): Promise<void> => {
  if (ctx.isAuthenticated()) {
    const { uid, userId } = ctx.request.body;
    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    const idx = allDevices && allDevices.findIndex(device => device.uid === uid && device.user === userId);
    if (!allDevices || idx === undefined || idx < 0) {
      ctx.body = JSON.stringify({ status: 200, result: `the device(${uid}) is not assigned to the user(${userId})` });
      logger.warn(`the device(${uid}) is not assigned to the user(${userId})`);
    } else {
      await writeFile(
        PATH_LOCAL_DB_DEVICES,
        JSON.stringify([...allDevices.slice(0, idx), ...allDevices.slice(idx + 1)]),
      );
      ctx.body = JSON.stringify({ status: 200, result: 'device removed successfully' });
      logger.info('device removed successfully');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: 'access denied' });
    logger.warn('access denied');
  }
};

const removeDevices = async (ctx: ParameterizedContext): Promise<void> => {
  if (ctx.isAuthenticated()) {
    const { uIds, userId } = ctx.request.body;
    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    if (
      !uIds ||
      !userId ||
      !allDevices?.filter(device => uIds.findIndex((u: string) => u === device.uid) > -1 && device.user === userId)
        .length
    ) {
      ctx.body = JSON.stringify({
        status: 200,
        result: `the devices(${JSON.stringify(uIds)}) is not assigned to the user(${userId})`,
      });
      logger.warn(`the device(${JSON.stringify(uIds)}) is not assigned to the user(${userId})`);
    } else {
      const newDevices = allDevices?.filter(
        device => !(uIds.findIndex((u: string) => u === device.uid) > -1 && device.user === userId),
      );
      await writeFile(PATH_LOCAL_DB_DEVICES, JSON.stringify(newDevices));
      ctx.body = JSON.stringify({ status: 200, result: 'devices removed successfully' });
      logger.info('devices removed successfully');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: 'access denied' });
    logger.warn('access denied');
  }
};

/* const isExistDevice = async (ctx: any): Promise<any> => {
  const { uid } = ctx.query;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const idx = allDevices && allDevices.findIndex((device) => device.uid === uid);
  if (!allDevices || idx === undefined || idx < 0) {
    ctx.body = JSON.stringify({ status: 200, result: false });
    logger.warn(`the device(${uid}) is not exist`);
  } else {
    ctx.body = JSON.stringify({ status: 200, result: true });
    logger.info(`the device(${uid}) is exist`);
  }
}; */

const getDevicesByUser = async (ctx: ParameterizedContext): Promise<void> => {
  if (ctx.isAuthenticated()) {
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
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: 'access denied' });
    logger.warn('access denied');
  }
};

export {
  getDevice,
  getDeviceByCurrentUser,
  getDevicesByUser,
  removeDevices,
  removeDevice,
  lockDevice,
  lockDevices,
  newDevice,
};
