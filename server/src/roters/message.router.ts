import Router from 'koa-router';
import { readFile, writeFile, removeFile } from '../workWithFile';
import { PATH_LOCAL_DB_MESSAGES } from '../rest';
import log4js from 'log4js';
import uuidv1 from 'uuid';
import { IMessage } from '../models';
import { promises } from 'fs';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const router = new Router({prefix: '/message'});

router.post('/new', ctx => newMessage(ctx));
router.get('/get', ctx => getMessage(ctx));
router.post('/getAndRemove', ctx => getMessageAndRemove(ctx));
router.post('/remove', ctx => removeMessage(ctx));

const newMessage = async(ctx:  any) => {
  if(ctx.isAuthenticated()) {
    const message = ctx.request.body;
    const organisation  = message.organisation;
    if(message instanceof Object && message as IMessage) {
      const uuid = uuidv1();
      await writeFile(
        `${PATH_LOCAL_DB_MESSAGES}${organisation}\\${uuid}.json`,
        JSON.stringify(message)
      );
      ctx.body = JSON.stringify({ status: 200, result: {uid: uuid, date: new Date()}});
      logger.info(`new message in queue: ${uuid}`);
    } else {
      ctx.status = 403;
      ctx.body = JSON.stringify({ status: 404, result: `incorrect format message`});
      logger.warn(`incorrect format message`);
    }
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
    const {organisation} = ctx.query;
    const result: IMessage[] = [];
    try {
      const nameFiles = await promises.readdir(`${PATH_LOCAL_DB_MESSAGES}${organisation}`)
      for(const newFile of nameFiles ) {
        const data = await readFile(`${PATH_LOCAL_DB_MESSAGES}${organisation}\\${newFile}`);
        result.push(data as IMessage);
      }
      result.filter(res => res.toAll || (res.consumer && res.consumer === ctx.state.user.userName))
      ctx.status = 200;
      ctx.body = JSON.stringify({ status: 200, result});
      logger.info('get message');
    }
    catch (e) {
      logger.trace(`Error reading data to directory ${PATH_LOCAL_DB_MESSAGES}${organisation} - ${e}`);
      console.log(`Error reading data to directory ${PATH_LOCAL_DB_MESSAGES}${organisation} - ${e}`);
      ctx.status = 404;
      ctx.body = JSON.stringify({ status: 404, result: 'not found file or directory'});
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
