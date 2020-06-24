import { readFile, writeFile, removeFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_MESSAGES } from '../server';
import { v1 as uuidv1 } from 'uuid';
import { promises } from 'fs';
import { ParameterizedContext } from 'koa';
import log from '../utils/logger';
import { IResponse, IMessage, IUser } from '../../../common';

interface IInfo {
  status: number;
  body: string;
}

const remove = async (company: string, uid: string) => removeFile(`${PATH_LOCAL_DB_MESSAGES}${company}\\${uid}.json`);

const createMessage = (
  head: { companyId: string; consumer?: string },
  body: IMessage['body'],
  user: IUser,
): IInfo | IMessage => {
  if (!user.companies) {
    log.warn(`The User (${user.id}) does not belongs to the Company (${head.companyId})`);
    const result: IResponse<string> = {
      result: false,
      error: `The User (${user.id}) does not belong to the Company (${head.companyId})`,
    };
    return { status: 403, body: JSON.stringify(result) };
  }

  if (!((user.companies as unknown) as string[]).find(item => item === head.companyId)) {
    log.warn(`The User (${user.id}) does not belong to the Company (${head.companyId})`);
    const result: IResponse<string> = {
      result: false,
      error: `The User (${user.id}) does not belong to the Company (${head.companyId})`,
    };
    return { status: 403, body: JSON.stringify(result) };
  }

  if (!body || !body.type || !body.payload) {
    log.warn('incorrect format message');
    const result: IResponse<string> = {
      result: false,
      error: `incorrect format message`,
    };
    return { status: 400, body: JSON.stringify(result) };
  }

  const uuid = uuidv1();
  return {
    head: {
      id: uuid,
      consumer: head.consumer || 'gdmn',
      producer: user.id,
      dateTime: new Date().toISOString(),
    },
    body,
  } as IMessage;
};

const findMessage = async (companyId: string, user: IUser) => {
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
      data: result.filter(res => res.head.consumer === user.userName),
    };
    return { status: 200, body: JSON.stringify(res) };
  } catch (e) {
    log.warn(`Error reading data from directory ${PATH_LOCAL_DB_MESSAGES}${companyId} - ${e}`);
    const result: IResponse<undefined> = {
      result: false,
      error: `file or directory not found`,
    };
    return { status: 404, body: JSON.stringify(result) };
  }
};

const newMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { head, body } = ctx.request.body;
  ctx.type = 'application/json';

  const response = createMessage(head, body, ctx.state.user);

  if ((response as IInfo).status !== undefined && response.body) {
    ctx.status = (response as IInfo).status;
    ctx.body = response.body;
  }

  const msgObject = response as IMessage;

  await writeFile(`${PATH_LOCAL_DB_MESSAGES}${head.companyId}\\${msgObject.head.id}.json`, JSON.stringify(msgObject));
  log.info(`new message in queue: ${msgObject.head.id}`);
  const result: IResponse<{ uid: string; date: Date }> = {
    result: true,
    data: { uid: msgObject.head.id, date: new Date() },
  };
  ctx.status = 201;
  ctx.body = JSON.stringify(result);
};

const getMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId } = ctx.params;
  ctx.type = 'application/json';

  const response = await findMessage(companyId, ctx.state.user);
  ctx.status = response.status;
  ctx.body = response.body;
};

const removeMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, id: uid } = ctx.params;
  const result = await remove(companyId, uid);
  ctx.type = 'application/json';

  let response: IResponse<undefined>;
  if (result === 'OK') {
    ctx.status = 200;
    response = {
      result: true,
    };
    log.info('get message');
  } else {
    ctx.status = 422;
    response = {
      result: false,
      error: `could not delete file`,
    };
  }
  ctx.body = JSON.stringify(response);
};

let clients: ((result: IMessage[]) => void)[] = [];

const subscribe = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId } = ctx.params;
  ctx.set('Cache-Control', 'no-cache,must-revalidate');
  ctx.type = 'application/json';

  const response = await findMessage(companyId, ctx.state.user);
  const body: IResponse<IMessage[]> = JSON.parse(response.body);
  if (!body.result || (body.result && body.data !== [])) {
    ctx.status = response.status;
    ctx.body = response.body;
    return;
  }

  const promise = new Promise<IMessage[]>((resolve, reject) => {
    clients.push(resolve);

    ctx.res.on('close', function () {
      clients.splice(clients.indexOf(resolve), 1);
      const error = new Error('Connection closed');
      error.name = 'ECONNRESET';
      reject(error);
    });
  });

  let message;

  try {
    message = (await promise).filter(mes => mes.head.consumer === ctx.state.user.id);
  } catch (err) {
    if (err instanceof Error && err.name === 'ECONNRESET') return;
    log.warn(`Error - ${err}`);
    const result: IResponse<undefined> = {
      result: false,
      error: `file or directory not found`,
    };
    ctx.status = 404;
    ctx.body = JSON.stringify(result);
    return;
  }

  if (message && message.length > 0) {
    console.log('DONE', message);
    clients = [];
    ctx.status = 200;
    const result: IResponse<IMessage[]> = {
      result: true,
      data: message,
    };
    ctx.body = JSON.stringify(result);
  }
};

const publish = async (ctx: ParameterizedContext): Promise<void> => {
  const { head, body } = ctx.request.body;
  ctx.type = 'application/json';

  const response = createMessage(head, body, ctx.state.user);

  if ((response as IInfo).status !== undefined && response.body) {
    ctx.status = (response as IInfo).status;
    ctx.body = response.body;
    return;
  }

  const msgObject = response as IMessage;

  clients.forEach(function (resolve) {
    resolve([msgObject]);
  });

  await writeFile(`${PATH_LOCAL_DB_MESSAGES}${head.companyId}\\${msgObject.head.id}.json`, JSON.stringify(msgObject));
  log.info(`new message in queue: ${msgObject.head.id}`);
  const result: IResponse<{ uid: string; date: Date }> = {
    result: true,
    data: { uid: msgObject.head.id, date: new Date() },
  };
  ctx.status = 201;
  ctx.body = JSON.stringify(result);
};

export { newMessage, removeMessage, getMessage, subscribe, publish };
