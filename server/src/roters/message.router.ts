import Router from 'koa-router';
import { readFile, writeFile, removeFile } from '../workWithFile';
import { PATH_LOCAL_DB_MESSAGES } from '../rest';
import log4js from 'log4js';
import uuidv1 from 'uuid';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const router = new Router({prefix: '/message'});

router.post('/new', ctx => newMessage(ctx));
router.get('/get', ctx => getMessage(ctx));
router.post('/getAndRemove', ctx => getMessageAndRemove(ctx));
router.post('/remove', ctx => removeMessage(ctx));

const newMessage = async(ctx:  any) => {
  if(ctx.isAuthenticated()) {
    const {organisation, body} = ctx.query;
    const uuid = uuidv1();
    await writeFile(
      `${PATH_LOCAL_DB_MESSAGES}${organisation}\\${uuid}.json`,
      JSON.stringify({
        body
      })
    );
    ctx.body = JSON.stringify({ status: 200, result: {uid: uuid, date: new Date()}});
    logger.info(`new message in queue: ${uuid}`);
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const getMessageAndRemove = async(ctx:  any) => {
  if(ctx.isAuthenticated()) {
    const {organisation, uid} = ctx.query;
    const message = await get(organisation, uid);
    const result = await remove(organisation, uid);
    if(result === 'OK') {
      ctx.status = 200;
      ctx.body = JSON.stringify({ status: 200, result: message});
      logger.info('get message');
    } else {
      ctx.status = 404;
      ctx.body = JSON.stringify({ status: 404, result: 'error'});
      logger.warn('not deleted message');
    }

  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const getMessage = async(ctx:  any) => {
  if(ctx.isAuthenticated()) {
    const {organisation, uid} = ctx.query;
    const message = await readFile(`${PATH_LOCAL_DB_MESSAGES}${organisation}\\${uid}.json`);
    if(message) {
      ctx.status = 200;
      ctx.body = JSON.stringify({ status: 200, result: message});
      logger.info('get message');
    } else {
      ctx.status = 404;
      ctx.body = JSON.stringify({ status: 404, result: 'error'});
      logger.warn('not message');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const removeMessage = async(ctx:  any) => {
  if(ctx.isAuthenticated()) {
    const {organisation, uid} = ctx.query;
    const result = await remove(organisation, uid);
    if(result === 'OK') {
      ctx.status = 200;
      ctx.body = JSON.stringify({ status: 200, result: 'OK'});
      logger.info('get message');
    } else {
      ctx.status = 404;
      ctx.body = JSON.stringify({ status: 404, result: 'error'});
      logger.warn('not deleted message');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const remove = async(organisation: string, uid: string) => {
  return await removeFile(`${PATH_LOCAL_DB_MESSAGES}${organisation}\\${uid}.json`)
}

const get = async(organisation: string, uid: string) => {
  const body = await readFile(`${PATH_LOCAL_DB_MESSAGES}${organisation}\\${uid}.json`);
  return body;
}

export default router;
