import { readFile, writeFile, removeFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_MESSAGES } from '../server';
import { v1 as uuidv1 } from 'uuid';
import { IMessage } from '../models/models';
import { promises } from 'fs';
import { ParameterizedContext } from 'koa';
import log from '../utils/logger';
import { IResponse } from '../models/requests';

const remove = async (company: string, uid: string) => removeFile(`${PATH_LOCAL_DB_MESSAGES}${company}\\${uid}.json`);

const newMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { head, body } = ctx.request.body;

  if (!ctx.state.user.companies) {
    log.warn(`The User (${ctx.state.user.id}) does not belongs to the Company (${head.companyId})`);
    const result: IResponse<string> = {
      result: false,
      error: `The User (${ctx.state.user.id}) does not belong to the Company (${head.companyId})`,
    };
    ctx.throw(403, JSON.stringify(result));
  }

  if (!((ctx.state.user.companies as unknown) as string[]).find(item => item === head.companyId)) {
    log.warn(`The User (${ctx.state.user.id}) does not belong to the Company (${head.companyId})`);
    const result: IResponse<string> = {
      result: false,
      error: `The User (${ctx.state.user.id}) does not belong to the Company (${head.companyId})`,
    };
    ctx.throw(403, JSON.stringify(result));
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
    log.info(`new message in queue: ${uuid}`);
    const result: IResponse<{ uid: string; date: Date }> = {
      result: true,
      data: { uid: uuid, date: new Date() },
    };
    ctx.status = 201;
    ctx.body = JSON.stringify(result);
  } else {
    log.warn('incorrect format message');
    const result: IResponse<string> = {
      result: false,
      error: `incorrect format message`,
    };
    ctx.throw(400, JSON.stringify(result));
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
    log.info('get message');
    const res: IResponse<IMessage[]> = {
      result: true,
      data: result.filter(res => res.head.consumer === ctx.state.user.userName),
    };
    ctx.status = 200;
    ctx.body = JSON.stringify(res);
  } catch (e) {
    log.verbose(`Error reading data from directory ${PATH_LOCAL_DB_MESSAGES}${companyId} - ${e}`);
    console.log(`Error reading data from directory ${PATH_LOCAL_DB_MESSAGES}${companyId} - ${e}`);
    const result: IResponse<string> = {
      result: false,
      error: `file or directory not found`,
    };
    ctx.throw(404, JSON.stringify(result));
  }
};

const removeMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, id: uid } = ctx.params;
  const result = await remove(companyId, uid);

  if (result === 'OK') {
    ctx.status = 204;
    const result: IResponse<undefined> = {
      result: true,
    };
    ctx.body = JSON.stringify(result);
    log.info('get message');
  } else {
    const result: IResponse<string> = {
      result: false,
      error: `could not delete file`,
    };
    ctx.throw(422, JSON.stringify(result));
  }
};

export { newMessage, removeMessage, getMessage };
