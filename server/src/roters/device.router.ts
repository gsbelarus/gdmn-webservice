import Router from 'koa-router';
import { IActivationCode } from '../models';
import { readFile } from '../workWithFile';
import { PATH_LOCAL_DB_ACTIVATION_CODES } from '../rest';
import { saveActivationCode } from './util';
import log4js from 'log4js';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const router = new Router({prefix: '/device'});

router.get('/verifyCode', ctx => verifyCode(ctx));
router.get('/getActivationCode', ctx => getActivationCode(ctx));

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

export default router;
