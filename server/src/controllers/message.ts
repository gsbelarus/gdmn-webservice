import { v1 as uuidv1 } from 'uuid';
import { ParameterizedContext } from 'koa';
import log from '../utils/logger';
import { IResponse, IMessage } from '../../../common';

const newMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { head, body } = ctx.request.body;
  ctx.type = 'application/json';

  if (!ctx.state.user.companies) {
    log.warn(`The User (${ctx.state.user.id}) does not belongs to the Company (${head.companyId})`);
    const result: IResponse<string> = {
      result: false,
      error: `The User (${ctx.state.user.id}) does not belong to the Company (${head.companyId})`,
    };
    ctx.status = 403;
    ctx.body = JSON.stringify(result);
    return;
  }

  if (!((ctx.state.user.companies as unknown) as string[]).find(item => item === head.companyId)) {
    log.warn(`The User (${ctx.state.user.id}) does not belong to the Company (${head.companyId})`);
    const result: IResponse<string> = {
      result: false,
      error: `The User (${ctx.state.user.id}) does not belong to the Company (${head.companyId})`,
    };
    ctx.status = 403;
    ctx.body = JSON.stringify(result);
    return;
  }

  if (!body || !body.type || !body.payload) {
    log.warn('incorrect format message');
    const result: IResponse<string> = {
      result: false,
      error: `incorrect format message`,
    };
    ctx.status = 400;
    ctx.body = JSON.stringify(result);
    return;
  }

  const uuid = uuidv1();
  const msgObject: IMessage = {
    head: {
      id: uuid,
      consumer: head.consumer || 'gdmn',
      producer: ctx.state.user.id,
      dateTime: new Date().toISOString(),
      appSystem: head.appSystem,
    },
    body,
  };

  /*   await writeFile({
      filename: `${PATH_LOCAL_DB_MESSAGES}${head.companyId}\\${uuid}.json`,
      data: JSON.stringify(msgObject),
    });
  */
  log.info(`new message in queue: ${uuid}`);
  const result: IResponse<{ uid: string; date: Date }> = {
    result: true,
    data: { uid: uuid, date: new Date() },
  };

  ctx.status = 201;
  ctx.body = JSON.stringify(result);
};

const getMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId } = ctx.params;
  const result: IMessage[] = [];
  ctx.type = 'application/json';

  /*   try {
      const nameFiles = await promises.readdir(`${PATH_LOCAL_DB_MESSAGES}${companyId}`);
      for await (const newFile of nameFiles) {
        const data = await readFile(`${PATH_LOCAL_DB_MESSAGES}${companyId}\\${newFile}`);
        result.push(data as IMessage);
      }
      log.info('get message');
      const res: IResponse<IMessage[]> = {
        result: true,
        data: result.filter(res => res.head.consumer === ctx.state.user.userName),
      };
      ctx.status = 200;
      ctx.body = JSON.stringify(res);
    } catch (e) {
      log.warn(`Error reading data from directory ${PATH_LOCAL_DB_MESSAGES}${companyId} - ${e}`);
      const result: IResponse = {
        result: false,
        error: `file or directory not found`,
      };
      ctx.status = 404;
      ctx.body = JSON.stringify(result);
    } */
  ctx.status = 404;
  ctx.body = JSON.stringify(result);
};

const removeMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, id: uid } = ctx.params;
  /*  const result = await remove(companyId, uid);
   ctx.type = 'application/json';

   let response: IResponse;
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
   */
  ctx.body = JSON.stringify({});
};

export { newMessage, removeMessage, getMessage };
