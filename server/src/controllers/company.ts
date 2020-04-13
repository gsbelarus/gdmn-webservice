import { ICompany, IUser } from '../models/models';
import { readFile, writeFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_COMPANIES, PATH_LOCAL_DB_USERS } from '../server';
import { editCompanies } from '../utils/util';
import { ParameterizedContext } from 'koa';
import { IResponse } from '../models/requests';
import { makeUser } from './user';
import log from '../utils/logger';

const addCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const title: string = ctx.request.body.title;
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);

  if (allCompanies?.filter(el => el.title === title)) {
    log.warn(`a company (${title}) already exists`);
    const res: IResponse<string> = { status: 400, result: `a company (${title}) already exists` };
    ctx.throw(400, JSON.stringify(res));
  }

  await writeFile(
    PATH_LOCAL_DB_COMPANIES,
    JSON.stringify(
      allCompanies
        ? [...allCompanies, { id: title, title, admin: ctx.state.user.id }]
        : [{ id: title, title, admin: ctx.state.user.id }],
    ),
  );
  const res = await editCompanies(ctx.state.user.id, [title]);
  // const res1 = await editCompanies('gdmn', [title]);
  if (res) {
    ctx.body = JSON.stringify({ status: 200, result: title });
    log.info('new company added successfully');
  } else {
    ctx.body = JSON.stringify({ status: 400, result: `a user (${ctx.state.user.id}) already exists` });
    log.warn(`a user (${ctx.state.user.id}) already exists`);
  }
};

const getCompanyProfile = async (ctx: ParameterizedContext): Promise<void> => {
  const companyId: string = ctx.params.id;
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
  const result = allCompanies && allCompanies.find(company => company.id === companyId);

  if (!allCompanies || !result) {
    log.warn('no such company');
    const res: IResponse<string> = { status: 400, result: 'no such company' };
    ctx.throw(400, JSON.stringify(res));
  }

  log.info('get profile company successfully');
  ctx.body = JSON.stringify({ status: 200, result });
};

const editCompanyProfile = async (ctx: ParameterizedContext): Promise<void> => {
  const companyId: string = ctx.params.id;
  const editPart = ctx.request.body;
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
  const idx = allCompanies && allCompanies.findIndex(company => company.id === companyId);

  if (!allCompanies || idx === undefined || idx < 0) {
    log.warn('no such company');
    const res: IResponse<string> = { status: 400, result: 'no such company' };
    ctx.throw(400, JSON.stringify(res));
  }
  delete editPart.admin;
  delete editPart.id;
  await writeFile(
    PATH_LOCAL_DB_COMPANIES,
    JSON.stringify([
      ...allCompanies.slice(0, idx),
      { ...allCompanies[idx], ...editPart },
      ...allCompanies.slice(idx + 1),
    ]),
  );
  log.info('a company edited successfully');
  ctx.body = JSON.stringify({ status: 200, result: 'a company edited successfully' });
};

const getUsersByCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const companyId: string = ctx.params.id;
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  ctx.body = JSON.stringify({
    status: 200,
    result:
      allUsers &&
      allUsers
        .filter(user => user.companies && user.companies.length && user.companies.find(org => org === companyId))
        .map(makeUser),
  });
  log.info('get users by company successfully');
};

export { addCompany, editCompanyProfile, getCompanyProfile, getUsersByCompany };
