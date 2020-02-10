import Router from 'koa-router';
import { readFile, writeFile, removeFile } from '../workWithFile';
import { PATH_LOCAL_DB_MESSAGES } from '../rest';
import log4js from 'log4js';
import uuidv1 from 'uuid';
import { IMessage } from '../models';
import { promises } from 'fs';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const router = new Router();

router.post('/messages', ctx => newMessage(ctx));
router.get('/messages', ctx => getMessage(ctx));
router.delete('/messages/:id', ctx => removeMessage(ctx));

const newMessage = async(ctx:  any) => {
  if(ctx.isAuthenticated()) {
    const message = ctx.request.body;
    const organisation  = message.organisation;
    if(!(ctx.state.user.organisations as Array<string>).find( item => item === organisation)) {
      ctx.body = JSON.stringify({ status: 404, result: `The user(${ctx.state.user.id}) not part of the organisation(${organisation})`});
      logger.warn(`The user(${ctx.state.user.id}) not part of the organisation(${organisation})`);
    }
    const newMessage = {...message, head: {consumer: ctx.state.user.id, producer: 'gdmn', dateTime: new Date().toString()}};
    if(newMessage instanceof Object && newMessage as IMessage) {
      const uuid = uuidv1();
      await writeFile(
        `${PATH_LOCAL_DB_MESSAGES}${organisation}\\${uuid}.json`,
        JSON.stringify(newMessage)
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
      ctx.status = 200;
      ctx.body = JSON.stringify({
        status: 200,
        result: result.filter(res => (!res.head.consumer || res.head.consumer && res.head.consumer === ctx.state.user.userName) && ctx.state.user.userName !== res.head.producer)
      });
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
