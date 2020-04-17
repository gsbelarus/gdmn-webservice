import { ICompany, IUser, IMakeUser } from '../models/models';
import { readFile, writeFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_COMPANIES, PATH_LOCAL_DB_USERS } from '../server';
import { ParameterizedContext } from 'koa';
import { IResponse } from '../models/requests';
import { makeUser, addCompanyToUser } from './user';
import log from '../utils/logger';

/**
 * Добавление новой организации
 * @param {string} title - наименование организации
 * @return title, наименование организации
 * */
const addCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { title } = ctx.request.body;
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);

  if (allCompanies?.filter(el => el.title === title)) {
    log.warn(`a company (${title}) already exists`);
    const res: IResponse<string> = { result: true, error: `a company (${title}) already exists` };
    ctx.throw(409, JSON.stringify(res));
  }

  const newCompany: ICompany = { id: title, title, admin: ctx.state.user.id };

  await writeFile(PATH_LOCAL_DB_COMPANIES, JSON.stringify(allCompanies ? [...allCompanies, newCompany] : [newCompany]));
  /* Добавлям к текущему пользователю создаваемую организацию */
  const res = await addCompanyToUser(ctx.state.user.id, [title]);
  // const res1 = await editCompanies('gdmn', [title]);
  if (res) {
    const result: IResponse<ICompany> = { result: false, data: newCompany };
    log.info('new company added successfully');
    ctx.status = 201;
    ctx.body = JSON.stringify(result);
  } else {
    log.warn(`a user (${ctx.state.user.id}) already exists`);
    const res: IResponse<string> = { result: true, error: `a user (${ctx.state.user.id}) already exists` };
    ctx.throw(409, JSON.stringify(res));
  }
};

const getCompanyProfile = async (ctx: ParameterizedContext): Promise<void> => {
  const companyId: string = ctx.params.id;
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
  const result = allCompanies && allCompanies.find(company => company.id === companyId);

  if (!result) {
    log.warn('no such company');
    const res: IResponse<string> = { result: true, error: 'no such company' };
    ctx.throw(422, JSON.stringify(res));
  }

  log.info('get profile company successfully');
  const res: IResponse<ICompany> = { result: false, data: result };
  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

const editCompanyProfile = async (ctx: ParameterizedContext): Promise<void> => {
  const companyId: string = ctx.params.id;
  const editPart = ctx.request.body;
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
  const idx = allCompanies && allCompanies.findIndex(company => company.id === companyId);

  if (!allCompanies || idx === undefined || idx < 0) {
    log.warn('no such company');
    const res: IResponse<string> = { result: true, error: 'no such company' };
    ctx.throw(422, JSON.stringify(res));
  }

  const company: ICompany = { id: allCompanies[idx].id, ...editPart, admin: allCompanies[idx].admin };

  await writeFile(
    PATH_LOCAL_DB_COMPANIES,
    JSON.stringify([...allCompanies.slice(0, idx), company, ...allCompanies.slice(idx + 1)]),
  );
  log.info('a company edited successfully');
  const res: IResponse<ICompany> = { result: false, data: company };
  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

const getUsersByCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const companyId: string = ctx.params.id;
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  log.info('get users by company successfully');
  const res: IResponse<IMakeUser[]> = {
    result: false,
    data: !allUsers
      ? []
      : allUsers
          .filter(user => user.companies && user.companies.length && user.companies.find(org => org === companyId))
          .map(makeUser),
  };
  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

export { addCompany, editCompanyProfile, getCompanyProfile, getUsersByCompany };
