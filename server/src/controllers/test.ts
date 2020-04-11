import { readFile } from '../utils/workWithFile';
import dev from '../../config/dev';
import { IGood, IContact, IDocumentType, IDocument } from '../models/models';
import { ParameterizedContext } from 'koa';
import log from '../utils/logger';

const PATH_GOODS = `${dev.FILES_PATH}\\Goods.json`;
const PATH_DOCUMENT_TYPE = `${dev.FILES_PATH}\\GD_DocumentType.json`;
const PATH_CONTACT = `${dev.FILES_PATH}\\GD_Contact.json`;
const PATH_DOCUMENT = `${dev.FILES_PATH}\\Document.json`;
const PATH_REMAINS = `${dev.FILES_PATH}\\Remains.json`;

const getAllData = async (ctx: ParameterizedContext): Promise<void> => {
  if (ctx.isAuthenticated()) {
    const goods: IGood[] | undefined = await readFile(PATH_GOODS);
    const documenttypes: IDocumentType[] | undefined = await readFile(PATH_DOCUMENT_TYPE);
    const contacts: IContact[] | undefined = await readFile(PATH_CONTACT);
    const docs: IDocument[] | undefined = await readFile(PATH_DOCUMENT);
    const remains: IDocument[] | undefined = await readFile(PATH_REMAINS);
    ctx.body = JSON.stringify({ status: 200, result: [goods, remains, documenttypes, contacts, docs] });
    log.info('get all data');
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: 'you are already logged in' });
    log.warn('this user has already logged in');
  }
};

export { getAllData };
