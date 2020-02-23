import Router from 'koa-router';
import log4js from 'log4js';
import { readFile, writeFile } from '../workWithFile';
import dev from '../../config/dev';
import { IGood, IContact, IDocumentType, IDocument } from '../models';

const PATH_GOODS = `${dev.FILES_PATH}\\Goods.json`;
const PATH_DOCUMENT_TYPE = `${dev.FILES_PATH}\\GD_DocumentType.json`;
const PATH_CONTACT = `${dev.FILES_PATH}\\GD_Contact.json`;
const PATH_DOCUMENT = `${dev.FILES_PATH}\\Document.json`;
const PATH_REMAINS = `${dev.FILES_PATH}\\Remains.json`;

const router = new Router({ prefix: '/test' });
const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

router.get('/all', async ctx => getAllData(ctx));

const getAllData = async (ctx: any) => {
  if (ctx.isAuthenticated()) {
    const goods: IGood[] | undefined = await readFile(PATH_GOODS);
    const docTypes: IDocumentType[] | undefined = await readFile(PATH_DOCUMENT_TYPE);
    const contacts: IContact[] | undefined = await readFile(PATH_CONTACT);
    const docs: IDocument[] | undefined = await readFile(PATH_DOCUMENT);
    const remains: IDocument[] | undefined = await readFile(PATH_REMAINS);
    ctx.body = JSON.stringify({ status: 200, result: [goods, remains, docTypes, contacts, docs] });
    logger.info('get all data');
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: 'you are already logged in' });
    logger.warn('this user has already logged in');
  }
};

export default router;
