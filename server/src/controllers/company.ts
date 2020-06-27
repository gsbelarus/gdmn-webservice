import { readFile, writeFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_COMPANIES, PATH_LOCAL_DB_USERS } from '../server';
import { ParameterizedContext } from 'koa';
import { makeUser, addCompanyToUser } from './user';
import log from '../utils/logger';
import { ICompany, IResponse, IUser, IMakeUser } from '../../../common';

/**
 * Добавление новой организации
 * @param {string} title - наименование организации
 * @return title, наименование организации
 * */
const addCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { title } = ctx.request.body;
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
  ctx.type = 'application/json';

  if (!title) {
    const res: IResponse<string> = { result: false, error: 'not such all parameters' };
    ctx.status = 422;
    ctx.body = JSON.stringify(res);
    return;
  }

  if (allCompanies?.some(el => el.title === title)) {
    log.warn(`a company (${title}) already exists`);
    const res: IResponse<string> = { result: false, error: `a company (${title}) already exists` };
    ctx.status = 409;
    ctx.body = JSON.stringify(res);
    return;
  }

  const newCompany: ICompany = { id: title, title, admin: ctx.state.user.id };

  await writeFile({
    filename: PATH_LOCAL_DB_COMPANIES,
    data: JSON.stringify(allCompanies ? [...allCompanies, newCompany] : [newCompany]),
  });

  /* Добавлям к пользователю gdmn создаваемую организацию */
  await addCompanyToUser('gdmn', [title]);
  /* Добавлям к текущему пользователю создаваемую организацию */
  const res = await addCompanyToUser(ctx.state.user.id, [title]);
  // const res1 = await editCompanies('gdmn', [title]);
  if (res) {
    const result: IResponse<ICompany> = { result: true, data: newCompany };
    log.info('new company added successfully');
    ctx.status = 201;
    ctx.body = JSON.stringify(result);
  } else {
    log.warn(`a user (${ctx.state.user.id}) already exists`);
    const res: IResponse<string> = { result: false, error: `a user (${ctx.state.user.id}) already exists` };
    ctx.status = 409;
    ctx.body = JSON.stringify(res);
  }
};

const getCompanyProfile = async (ctx: ParameterizedContext): Promise<void> => {
  const companyId: string = ctx.params.id;
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
  const result = allCompanies && allCompanies.find(company => company.id === companyId);
  ctx.type = 'application/json';

  if (!result) {
    log.warn('no such company');
    const res: IResponse<string> = { result: false, error: 'no such company' };
    ctx.status = 422;
    ctx.body = JSON.stringify(res);
    return;
  }

  log.info('get profile company successfully');
  const res: IResponse<ICompany> = { result: true, data: result };
  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

const editCompanyProfile = async (ctx: ParameterizedContext): Promise<void> => {
  const companyId: string = ctx.params.id;
  const editPart = ctx.request.body;
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
  const idx = allCompanies && allCompanies.findIndex(company => company.id === companyId);
  ctx.type = 'application/json';

  if (!editPart.title) {
    const res: IResponse<string> = { result: false, error: 'not such all parameters' };
    ctx.status = 422;
    ctx.body = JSON.stringify(res);
    return;
  }

  if (!allCompanies || idx === undefined || idx < 0) {
    log.warn('no such company');
    const res: IResponse<string> = { result: false, error: 'no such company' };
    ctx.status = 422;
    ctx.body = JSON.stringify(res);
    return;
  }

  const company: ICompany = { ...editPart, id: allCompanies[idx].id, admin: allCompanies[idx].admin };

  await writeFile({
    filename: PATH_LOCAL_DB_COMPANIES,
    data: JSON.stringify([...allCompanies.slice(0, idx), company, ...allCompanies.slice(idx + 1)]),
  });
  log.info('a company edited successfully');
  const res: IResponse<ICompany> = { result: true, data: company };
  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

const getUsersByCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const companyId: string = ctx.params.id;
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  ctx.type = 'application/json';
  log.info('get users by company successfully');
  const res: IResponse<IMakeUser[]> = {
    result: true,
    data: !allUsers
      ? []
      : allUsers
          .filter(user => user.companies && user.companies.length && user.companies.find(org => org === companyId))
          .map(makeUser),
  };
  ctx.type = 'application/json';
  ctx.status = 200;
  ctx.body = JSON.stringify(res);
};

const getCompanies = async (ctx: ParameterizedContext): Promise<void> => {
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
  const result: IResponse<ICompany[]> = {
    result: true,
    data: !allCompanies || !allCompanies.length ? [] : allCompanies,
  };
  log.info('get companies successfully');
  ctx.type = 'application/json';
  ctx.status = 200;
  ctx.body = JSON.stringify(result);
};

const deleteCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.params;
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
  const newCompanies = allCompanies?.filter(el => id !== el.id);
  ctx.type = 'application/json';

  if (allCompanies?.length === newCompanies?.length) {
    log.warn('no such company');
    const res: IResponse<string> = { result: false, error: 'no such company' };
    ctx.status = 422;
    ctx.body = JSON.stringify(res);
    return;
  }

  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  if (allUsers?.some(user => user.companies?.some(comapny => comapny === id))) {
    await writeFile({
      filename: PATH_LOCAL_DB_USERS,
      data: JSON.stringify(
        allUsers.map(user => {
          return { ...user, companies: user.companies?.filter(company => company !== id) };
        }),
      ),
    });
  }

  await writeFile({ filename: PATH_LOCAL_DB_COMPANIES, data: JSON.stringify(newCompanies ?? []) });

  log.info('company removed successfully');
  ctx.status = 204;
};

export { addCompany, editCompanyProfile, getCompanyProfile, getUsersByCompany, getCompanies, deleteCompany };
