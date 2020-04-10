import { ICompany, IUser } from '../models/models';
import { readFile, writeFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_COMPANIES, PATH_LOCAL_DB_USERS } from '../server';
import log4js from 'log4js';
import { editCompanies } from '../utils/util';
import { ParameterizedContext } from 'koa';
import { IResponse } from '../models/requests';
import { makeUser } from './user';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const addCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const title: string = ctx.request.body.title;
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);

  if (allCompanies?.filter(el => el.title === title)) {
    logger.warn(`a company (${title}) already exists`);
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
  if (res === 0) {
    ctx.body = JSON.stringify({ status: 200, result: title });
    logger.info('new company added successfully');
  } else {
    ctx.body = JSON.stringify({ status: 400, result: `a user (${ctx.state.user.id}) already exists` });
    logger.warn(`a user (${ctx.state.user.id}) already exists`);
  }
};

const getCompanyProfile = async (ctx: ParameterizedContext): Promise<void> => {
  const companyId: string = ctx.params.id;
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
  const result = allCompanies && allCompanies.find(company => company.id === companyId);

  if (!allCompanies || !result) {
    logger.warn('no such company');
    const res: IResponse<string> = { status: 400, result: 'no such company' };
    ctx.throw(400, JSON.stringify(res));
  }

  logger.info('get profile company successfully');
  ctx.body = JSON.stringify({ status: 200, result });
};

const editCompanyProfile = async (ctx: ParameterizedContext): Promise<void> => {
  const companyId: string = ctx.params.id;
  const newCompany = ctx.request.body;
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
  const idx = allCompanies && allCompanies.findIndex(company => company.id === companyId);

  if (!allCompanies || idx === undefined || idx < 0) {
    logger.warn('no such company');
    const res: IResponse<string> = { status: 400, result: 'no such company' };
    ctx.throw(400, JSON.stringify(res));
  }
  await writeFile(
    PATH_LOCAL_DB_COMPANIES,
    JSON.stringify([
      ...allCompanies.slice(0, idx),
      { id: allCompanies[idx].id, admin: allCompanies[idx].admin, ...newCompany },
      ...allCompanies.slice(idx + 1),
    ]),
  );
  logger.info('a company edited successfully');
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
  logger.info('get users by company successfully');
};

export { addCompany, editCompanyProfile, getCompanyProfile, getUsersByCompany };
