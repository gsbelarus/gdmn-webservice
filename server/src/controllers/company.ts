import { ParameterizedContext } from 'koa';
import log from '../utils/logger';
import { ICompany, IResponse, IUserProfile } from '../../../common';
import { companyService } from '../services';

const addCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { title } = ctx.request.body as ICompany;

  if (!title) {
    log.info('addCompany: name is required');
    const res: IResponse = { result: false, error: 'название организации должно быть заполнено' };
    ctx.throw(400, JSON.stringify(res));
  }

  let companyId;
  const company: ICompany = { id: title, title, admin: ctx.state.user.id };

  try {
    companyId = await companyService.addOne({ ...company, admin: ctx.state.user.id });
  } catch (err) {
    log.info(`addCompany: ${err.message}`);
    const res: IResponse = { result: false, error: err.message };
    ctx.throw(500, JSON.stringify(res));
  }

  const result: IResponse<string> = { result: true, data: companyId };
  log.info('addCompany: OK');
  ctx.status = 201;
  ctx.body = JSON.stringify(result);
};

const getCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;

  if (!companyId) {
    log.info('getCompany: id is required');
    const res: IResponse = { result: false, error: 'идентификатор организации должен быть указан' };
    ctx.throw(400, JSON.stringify(res));
  }

  const company = await companyService.findOne(companyId);
  ctx.type = 'application/json';

  if (!company) {
    log.info(`getCompany: company '${company}' not found`);
    const res: IResponse = { result: false, error: 'организация не найдена' };
    ctx.throw(422, JSON.stringify(res));
  }

  log.info('getCompany: OK');
  const res: IResponse<ICompany> = { result: true, data: company };
  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

const updateCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;
  const company = ctx.request.body as ICompany;

  if (!companyId) {
    log.info('updateCompany: id is required');
    const res: IResponse = { result: false, error: 'идентификатор организации должен быть указан' };
    ctx.throw(400, JSON.stringify(res));
  }

  if (!company.title) {
    log.info('updateCompany: name is required');
    const res: IResponse = { result: false, error: 'название организации должно быть заполнено' };
    ctx.throw(400, JSON.stringify(res));
  }

  try {
    await companyService.updateOne(company);
  } catch (err) {
    log.info(`updateCompany: ${err.message}`);
    const res: IResponse = { result: false, error: err.message };
    ctx.throw(400, JSON.stringify(res));
  }

  log.info('updateCompany: OK');
  const res: IResponse<string> = { result: true, data: company.id };
  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

const getUsersByCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;

  if (!companyId) {
    log.info('getUsersByCompany: id is required');
    const res: IResponse = { result: false, error: 'идентификатор организации должен быть указан' };
    ctx.throw(400, JSON.stringify(res));
  }

  let users;
  try {
    users = await companyService.findUsers(companyId);
  } catch (err) {
    log.info(`getUsersByCompany: ${err.message}`);
    const res: IResponse = { result: false, error: err.message };
    ctx.throw(400, JSON.stringify(res));
  }

  const res: IResponse<IUserProfile[]> = {
    result: true,
    data: users,
  };

  log.info('getUsersByCompany: OK');
  ctx.type = 'application/json';
  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

const getCompanies = async (ctx: ParameterizedContext): Promise<void> => {
  let companies;
  try {
    companies = await companyService.findAll();
  } catch (err) {
    log.info(`getCompanies: ${err.message}`);
    const res: IResponse = { result: false, error: err.message };
    ctx.throw(400, JSON.stringify(res));
  }
  const result: IResponse<ICompany[]> = {
    result: true,
    data: companies,
  };
  log.info('getCompanies: OK');
  ctx.type = 'application/json';
  ctx.status = 200;
  ctx.body = JSON.stringify(result);
};

const deleteCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: companyId } = ctx.params;

  if (!companyId) {
    log.info('updateCompany: id is required');
    const res: IResponse = { result: false, error: 'идентификатор организации должен быть указан' };
    ctx.throw(400, JSON.stringify(res));
  }

  try {
    await companyService.deleteOne(companyId);
  } catch (err) {
    log.info(`getCompanies: ${err.message}`);
    const res: IResponse = { result: false, error: err.message };
    ctx.throw(400, JSON.stringify(res));
  }

  log.info('deleteCompany: OK');
  ctx.status = 204;
};

export { addCompany, updateCompany, getCompany, getUsersByCompany, getCompanies, deleteCompany };
