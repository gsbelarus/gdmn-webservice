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
router.post('/lock', ctx => lockDevice(ctx));
router.post('/remove', ctx => removeDevice(ctx));
router.get('/byUser', ctx => getDevicesByUser(ctx));

const verifyCode = async(ctx: any) => {
  const data: IActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODES);
  const code = data && data.find(code => code.code === ctx.request.body.code);
  if (code) {
    const date = new Date(code.date);
    date.setDate(date.getDate() + 7);
    if(date >= new Date()) {
      ctx.status = 200;
      ctx.body = JSON.stringify({ status: 200, result: 'device activated successfully'});
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
  const userName = ctx.request.body.user;
  const code = await saveActivationCode(userName);
  ctx.status = 200;
  ctx.body = JSON.stringify({ status: 200, result: code});
  logger.info('activation code generate successfully');
}

const newDevice = async(ctx: any) => {
  const {uid, idUser} = ctx.request.body;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  if(!(allDevices && allDevices.find( device => device.uid === uid && device.user === idUser))) {
    await writeFile(
      PATH_LOCAL_DB_DEVICES,
      JSON.stringify(allDevices
        ? [...allDevices, {uid, user: idUser, isBlock: false}]
        : [{uid, user: idUser, isBlock: false}]
      )
    );
    ctx.body = JSON.stringify({ status: 200, result: 'new device added successfully'});
    logger.info('new device added successfully');
  } else {
    ctx.body = JSON.stringify({ status: 404, result: `this device(${uid}) is assigned to this user(${idUser})`});
    logger.warn(`this device(${uid}) is assigned to this user(${idUser})`);
  }
}

const lockDevice = async(ctx: any) => {
  const {uid, idUser} = ctx.request.body;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const idx = allDevices && allDevices.findIndex( device => device.uid === uid && device.user === idUser);
  if(!allDevices || idx === undefined || idx < 0) {
    ctx.body = JSON.stringify({ status: 404, result: `the device(${uid}) is not assigned to the user(${idUser})`});
    logger.warn(`the device(${uid}) is not assigned to the user(${idUser})`);
  } else {
    await writeFile(
      PATH_LOCAL_DB_DEVICES,
      JSON.stringify([...allDevices.slice(0, idx), {uid, user: idUser, isBlock: true}, ...allDevices.slice(idx + 1)]
      )
    );
    ctx.body = JSON.stringify({ status: 200, result: 'device locked successfully'});
    logger.info('device locked successfully');
  }
}

const removeDevice = async(ctx: any) => {
  const {uid, idUser} = ctx.request.body;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const idx = allDevices && allDevices.findIndex( device => device.uid === uid && device.user === idUser);
  if(!allDevices || idx === undefined || idx < 0) {
    ctx.body = JSON.stringify({ status: 200, result: `the device(${uid}) is not assigned to the user(${idUser})`});
    logger.warn(`the device(${uid}) is not assigned to the user(${idUser})`);
  } else {
    await writeFile(
      PATH_LOCAL_DB_DEVICES,
      JSON.stringify([...allDevices.slice(0, idx), ...allDevices.slice(idx + 1)]
      )
    );
    ctx.body = JSON.stringify({ status: 200, result: 'device removed successfully'});
    logger.info('device removed successfully');
  }
}

const getDevicesByUser = async(ctx: any) => {
  const {idUser} = ctx.request.body;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  ctx.body = JSON.stringify({
    status: 200,
    result: !allDevices || !allDevices.length
      ? []
      : allDevices
        .filter( device => device.user === idUser)
        .map(device => {return {uid: device.uid, state: device.isBlock ? 'blocked' : 'active'}})
  });
  logger.info('get devices by user successfully');
}

export default router;