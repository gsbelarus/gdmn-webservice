import { readFile, writeFile, removeFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_MESSAGES } from '../server';
import { v1 as uuidv1 } from 'uuid';
import { IMessage } from '../models/models';
import { promises } from 'fs';
import { ParameterizedContext } from 'koa';
import log from '../utils/logger';

const remove = async (company: string, uid: string) => removeFile(`${PATH_LOCAL_DB_MESSAGES}${company}\\${uid}.json`);

const newMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { head, body } = ctx.request.body;

  if (!ctx.state.user.companies) {
    ctx.body = JSON.stringify({
      status: 400,
      result: `The User (${ctx.state.user.id}) does not belong to the Company (${head.companyId})`,
    });
    log.warn(`The User (${ctx.state.user.id}) does not belongs to the Company (${head.companyId})`);
    return;
  }

  if (!((ctx.state.user.companies as unknown) as string[]).find(item => item === head.companyId)) {
    ctx.body = JSON.stringify({
      status: 400,
      result: `The User (${ctx.state.user.id}) does not belong to the Company (${head.companyId})`,
    });
    log.warn(`The User (${ctx.state.user.id}) does not belong to the Company (${head.companyId})`);
    return;
  }

  const uuid = uuidv1();
  const msgObject = {
    head: {
      id: uuid,
      consumer: head.consumer || 'gdmn',
      producer: ctx.state.user.id,
      dateTime: new Date().toISOString(),
    },
    body,
  };

  if (msgObject instanceof Object && (msgObject as IMessage)) {
    await writeFile(`${PATH_LOCAL_DB_MESSAGES}${head.companyId}\\${uuid}.json`, JSON.stringify(msgObject));
    ctx.body = JSON.stringify({
      status: 200,
      result: { uid: uuid, date: new Date() },
    });
    log.info(`new message in queue: ${uuid}`);
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({
      status: 400,
      result: 'incorrect format message',
    });
    log.warn('incorrect format message');
  }
};

const getMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId } = ctx.request.body;
  const result: IMessage[] = [];

  try {
    const nameFiles = await promises.readdir(`${PATH_LOCAL_DB_MESSAGES}${companyId}`);
    for await (const newFile of nameFiles) {
      const data = await readFile(`${PATH_LOCAL_DB_MESSAGES}${companyId}\\${newFile}`);
      result.push((data as unknown) as IMessage);
    }
    ctx.status = 200;
    ctx.body = JSON.stringify({
      status: 200,
      result: result.filter(res => res.head.consumer === ctx.state.user.userName),
    });
    log.info('get message');
  } catch (e) {
    log.verbose(`Error reading data from directory ${PATH_LOCAL_DB_MESSAGES}${companyId} - ${e}`);
    console.log(`Error reading data from directory ${PATH_LOCAL_DB_MESSAGES}${companyId} - ${e}`);
    ctx.status = 400;
    ctx.body = JSON.stringify({
      status: 400,
      result: 'file or directory not found',
    });
  }
};

const removeMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, id: uid } = ctx.params;
  const result = await remove(companyId, uid);

  if (result === 'OK') {
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: 'OK' });
    log.info('get message');
  } else {
    ctx.status = 400;
    ctx.body = JSON.stringify({ status: 400, result: 'error' });
    log.warn('could not delete file');
  }
};

export { newMessage, removeMessage, getMessage };
