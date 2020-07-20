import { v1 as uuidv1 } from 'uuid';
import { ParameterizedContext } from 'koa';
import log from '../utils/logger';
import { IResponse, IMessage } from '../../../common';
import { messageService, companyService } from '../services';

const newMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { head, body } = ctx.request.body;

  if (!head) {
    ctx.throw(400, 'отсутствует заголовок сообщения');
  }

  if (!body) {
    ctx.throw(400, 'отсутствует сообщение');
  }

  if (!(body.type && body.payload && head.companyId)) {
    ctx.throw(400, 'некорректный формат сообщения');
  }

  if (!(ctx.state.user.companies as string[]).find(item => item === head.companyId)) {
    ctx.throw(403, 'пользователь не входит в организацию указанную в заголовке сообщения');
  }

  try {
    const msgObject: IMessage = {
      head: {
        id: uuidv1(),
        companyid: head.companyId,
        consumer: head.consumer || 'gdmn',
        producer: ctx.state.user.id,
        dateTime: new Date().toISOString(),
        appSystem: head.appSystem,
      },
      body,
    };
    const messageId = await messageService.addOne(msgObject);

    const result: IResponse<{ uid: string; date: Date }> = { result: true, data: { uid: messageId, date: new Date() } };

    ctx.status = 201;
    ctx.body = result;

    log.info(`newMessage: OK`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const getMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId: companyName, appSystem } = ctx.params;

  if (!companyName) {
    ctx.throw(400, 'не указана органиазция');
  }

  const company = await companyService.findOneByName(companyName);

  try {
    const userId = ctx.state.user.id;
    const messageList = await messageService.FindMany({ appSystem, companyId: company.id, userId });

    console.log(companyName);
    console.log(appSystem);
    console.log(messageList);
    const result: IResponse<IMessage[]> = { result: true, data: messageList };
    ctx.status = 200;
    ctx.body = result;

    log.info('get message');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const removeMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, id: uid } = ctx.params;

  if (!companyId) {
    ctx.throw(400, 'не указана органиазция');
  }

  if (!uid) {
    ctx.throw(400, 'не указан идентификатор сообщения');
  }

  try {
    const userId = ctx.state.user.id;
    await messageService.deleteByUid({ companyId, uid, userId });

    const result: IResponse<void> = { result: true };

    ctx.status = 200;
    ctx.body = result; //TODO передавать только код 204 без body

    log.info('removeMessage: OK');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

export { newMessage, removeMessage, getMessage };
