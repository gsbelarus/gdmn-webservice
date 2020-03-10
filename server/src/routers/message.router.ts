import Router from 'koa-router';
import { readFile, writeFile, removeFile } from '../workWithFile';
import { PATH_LOCAL_DB_MESSAGES } from '../rest';
import log4js from 'log4js';
import { v1 as uuidv1 } from 'uuid';
import { IMessage } from '../models';
import { promises } from 'fs';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const router = new Router();

router.post('/messages', ctx => newMessage(ctx));
router.get('/messages', ctx => getMessage(ctx));
router.delete('/messages/:companyId/:id', ctx => removeMessage(ctx));

const newMessage = async (ctx: any) => {
  if (ctx.isAuthenticated()) {
    const {
      head: { companyId, consumer },
      body,
    } = ctx.request.body;

    if (!ctx.state.user.companies) {
      ctx.body = JSON.stringify({
        status: 404,
        result: `The User (${ctx.state.user.id}) does not belong to the Company (${companyId})`,
      });
      logger.warn(`The User (${ctx.state.user.id}) does not belongs to the Company (${companyId})`);
      return;
    }

    if (!(ctx.state.user.companies as string[]).find(item => item === companyId)) {
      ctx.body = JSON.stringify({
        status: 404,
        result: `The User (${ctx.state.user.id}) does not belong to the Company (${companyId})`,
      });
      logger.warn(`The User (${ctx.state.user.id}) does not belong to the Company (${companyId})`);
      return;
    }

    const uuid = uuidv1();
    const msgObject = {
      head: {
        id: uuid,
        consumer: consumer || 'gdmn',
        producer: ctx.state.user.id,
        dateTime: new Date().toISOString(),
      },
      body,
    };

    if (msgObject instanceof Object && (msgObject as IMessage)) {
      await writeFile(`${PATH_LOCAL_DB_MESSAGES}${companyId}\\${uuid}.json`, JSON.stringify(msgObject));
      ctx.body = JSON.stringify({
        status: 200,
        result: { uid: uuid, date: new Date() },
      });
      logger.info(`new message in queue: ${uuid}`);
    } else {
      ctx.status = 403;
      ctx.body = JSON.stringify({
        status: 404,
        result: `incorrect format message`,
      });
      logger.warn(`incorrect format message`);
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied` });
    logger.warn(`access denied`);
  }
};

const getMessage = async (ctx: any) => {
  if (!ctx.isAuthenticated()) {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied` });
    logger.warn(`access denied`);
    return;
  }

  const { companyId } = ctx.query;
  const result: IMessage[] = [];

  try {
    const nameFiles = await promises.readdir(`${PATH_LOCAL_DB_MESSAGES}${companyId}`);
    for (const newFile of nameFiles) {
      const data = await readFile(`${PATH_LOCAL_DB_MESSAGES}${companyId}\\${newFile}`);
      result.push((data as unknown) as IMessage);
    }
    ctx.status = 200;
    ctx.body = JSON.stringify({
      status: 200,
      result: result.filter(res => res.head.consumer === ctx.state.user.userName),
    });
    logger.info('get message');
  } catch (e) {
    logger.trace(`Error reading data from directory ${PATH_LOCAL_DB_MESSAGES}${companyId} - ${e}`);
    console.log(`Error reading data from directory ${PATH_LOCAL_DB_MESSAGES}${companyId} - ${e}`);
    ctx.status = 404;
    ctx.body = JSON.stringify({
      status: 404,
      result: 'file or directory not found',
    });
  }
};

const removeMessage = async (ctx: any) => {
  if (ctx.isAuthenticated()) {
    const { companyId, id: uid } = ctx.params;
    const result = await remove(companyId, uid);

    if (result === 'OK') {
      ctx.status = 200;
      ctx.body = JSON.stringify({ status: 200, result: 'OK' });
      logger.info('get message');
    } else {
      ctx.status = 404;
      ctx.body = JSON.stringify({ status: 404, result: 'error' });
      logger.warn('could not delete file');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied` });
    logger.warn(`access denied`);
  }
};

const remove = async (company: string, uid: string) => removeFile(`${PATH_LOCAL_DB_MESSAGES}${company}\\${uid}.json`);

export default router;
