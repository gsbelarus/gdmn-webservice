import Router from 'koa-router';
import { IActivationCode, IDevice } from '../models';
import { readFile, writeFile } from '../workWithFile';
import { PATH_LOCAL_DB_ACTIVATION_CODES, PATH_LOCAL_DB_DEVICES } from '../rest';
import { saveActivationCode } from './util';
import log4js from 'log4js';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const router = new Router({prefix: '/device'});

router.get('/verifyCode', ctx => verifyCode(ctx));
router.get('/getActivationCode', ctx => getActivationCode(ctx));
router.post('/new', ctx => newDevice(ctx));
router.post('/lock', ctx => lockDevices(ctx));
router.post('/remove', ctx => removeDevices(ctx));
router.get('/isExist', ctx => isExistDevice(ctx));
router.get('/isActive', ctx => isActiveDevice(ctx));
router.get('/byUser', ctx => getDevicesByUser(ctx));

const verifyCode = async(ctx: any) => {
  const data: IActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODES);
  const code = data && data.find(code => code.code === ctx.query.code);
  if (code) {
    const date = new Date(code.date);
    date.setDate(date.getDate() + 7);
    if(date >= new Date()) {
      await writeFile( PATH_LOCAL_DB_ACTIVATION_CODES, JSON.stringify(data?.filter(code => code.code !== ctx.query.code)) );
      ctx.status = 200;
      ctx.body = JSON.stringify({ status: 200, result: code.user});
      logger.info('device activated successfully');
    } else {
      ctx.status = 200;
      ctx.body = JSON.stringify({ status: 404, result: 'invalid activation code'});
      logger.warn('invalid activation code');
    }
  } else {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 404, result: 'invalid activation code'});
    logger.warn('invalid activation code');
  }
}

const getActivationCode = async(ctx: any) => {
  const userId = ctx.query.user;
  const code = await saveActivationCode(userId);
  ctx.status = 200;
  ctx.body = JSON.stringify({ status: 200, result: code});
  logger.info('activation code generate successfully');
}

const newDevice = async(ctx: any) => {
  if(ctx.isUnauthenticated()) {
    const {uid, userId} = ctx.request.body;
    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    if(!(allDevices && allDevices.find( device => device.uid === uid && device.user === userId))) {
      await writeFile(
        PATH_LOCAL_DB_DEVICES,
        JSON.stringify(allDevices
          ? [...allDevices, {uid, user: userId, isBlock: false}]
          : [{uid, user: userId, isBlock: false}]
        )
      );
      ctx.body = JSON.stringify({ status: 200, result: 'new device added successfully'});
      logger.info('new device added successfully');
    } else {
      ctx.body = JSON.stringify({ status: 404, result: `this device(${uid}) is assigned to this user(${userId})`});
      logger.warn(`this device(${uid}) is assigned to this user(${userId})`);
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const lockDevice = async(ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {uid, userId} = ctx.request.body;
    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    const idx = allDevices && allDevices.findIndex( device => device.uid === uid && device.user === userId);
    if(!allDevices || idx === undefined || idx < 0) {
      ctx.body = JSON.stringify({ status: 404, result: `the device(${uid}) is not assigned to the user(${userId})`});
      logger.warn(`the device(${uid}) is not assigned to the user(${userId})`);
    } else {
      await writeFile(
        PATH_LOCAL_DB_DEVICES,
        JSON.stringify([...allDevices.slice(0, idx), {uid, user: userId, isBlock: true}, ...allDevices.slice(idx + 1)]
        )
      );
      ctx.body = JSON.stringify({ status: 200, result: 'device locked successfully'});
      logger.info('device locked successfully');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const lockDevices = async(ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {uIds, userId} = ctx.request.body;
    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    if (!uIds || !userId || !allDevices?.filter( device => uIds.findIndex((u: string) => u === device.uid) > -1 && device.user === userId).length) {
      ctx.body = JSON.stringify({ status: 200, result: `the devices(${JSON.stringify(uIds)}) is not assigned to the user(${userId})`});
      logger.warn(`the device(${JSON.stringify(uIds)}) is not assigned to the user(${userId})`);
    } else {
      const newDevices = allDevices?.map( device => uIds.findIndex((u: string) => u === device.uid) > -1 && device.user === userId ? {...device, isBlock: true} : device);
      await writeFile(
        PATH_LOCAL_DB_DEVICES,
        JSON.stringify(newDevices)
      );
      ctx.body = JSON.stringify({ status: 200, result: 'devices locked successfully'});
      logger.info('devices locked successfully');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const removeDevice = async(ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {uid, userId} = ctx.request.body;
    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    const idx = allDevices && allDevices.findIndex( device => device.uid === uid && device.user === userId);
    if(!allDevices || idx === undefined || idx < 0) {
      ctx.body = JSON.stringify({ status: 200, result: `the device(${uid}) is not assigned to the user(${userId})`});
      logger.warn(`the device(${uid}) is not assigned to the user(${userId})`);
    } else {
      await writeFile(
        PATH_LOCAL_DB_DEVICES,
        JSON.stringify([...allDevices.slice(0, idx), ...allDevices.slice(idx + 1)]
        )
      );
      ctx.body = JSON.stringify({ status: 200, result: 'device removed successfully'});
      logger.info('device removed successfully');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const removeDevices = async(ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {uIds, userId} = ctx.request.body;
    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    if (!uIds || !userId || !allDevices?.filter( device => uIds.findIndex((u: string) => u === device.uid) > -1 && device.user === userId).length) {
      ctx.body = JSON.stringify({ status: 200, result: `the devices(${JSON.stringify(uIds)}) is not assigned to the user(${userId})`});
      logger.warn(`the device(${JSON.stringify(uIds)}) is not assigned to the user(${userId})`);
    } else {
      const newDevices = allDevices?.filter( device => !(uIds.findIndex((u: string) => u === device.uid) > -1 && device.user === userId));
      await writeFile(
        PATH_LOCAL_DB_DEVICES,
        JSON.stringify(newDevices)
      );
      ctx.body = JSON.stringify({ status: 200, result: 'devices removed successfully'});
      logger.info('devices removed successfully');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const isActiveDevice = async(ctx: any) => {
  const {uid, userId} = ctx.query;
  console.log(userId);
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const idx = allDevices && allDevices.findIndex( device => device.uid === uid && device.user === userId);
  if(!allDevices || idx === undefined || idx < 0) {
    ctx.body = JSON.stringify({ status: 404, result: `the device(${uid}) is not assigned to the user(${userId})`});
    logger.warn(`the device(${uid}) is not assigned to the user(${userId})`);
  } else {
    ctx.body = JSON.stringify({ status: 200, result: !allDevices[idx].isBlock});
    logger.info( `device active: ${!allDevices[idx].isBlock}`);
  }
}

const isExistDevice = async(ctx: any) => {
  const {uid} = ctx.query;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const idx = allDevices && allDevices.findIndex( device => device.uid === uid);
  if(!allDevices || idx === undefined || idx < 0) {
    ctx.body = JSON.stringify({ status: 200, result: false});
    logger.warn(`the device(${uid}) is not exist`);
  } else {
    ctx.body = JSON.stringify({ status: 200, result: true});
    logger.info( `the device(${uid}) is exist`);
  }
}

const getDevicesByUser = async(ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {userId} = ctx.query;
    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    ctx.body = JSON.stringify({
      status: 200,
      result: !allDevices || !allDevices.length
        ? []
        : allDevices
          .filter( device => device.user === userId)
          .map(device => {return {uid: device.uid, state: device.isBlock ? 'blocked' : 'active'}})
    });
    logger.info('get devices by user successfully');
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

export default router;
