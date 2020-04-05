import { ICompany, IUser } from '../models/models';
import { readFile, writeFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_COMPANIES, PATH_LOCAL_DB_USERS } from '../server';
import log4js from 'log4js';
import { editCompanies } from '../utils/util';
import { ParameterizedContext } from 'koa';
import { IResponse } from '../models/requests';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const addCompany = async (ctx: ParameterizedContext): Promise<void> => {
  const { title } = ctx.query;
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
  if (!(allCompanies && allCompanies.find(company => company.title === title))) {
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
  } else {
    logger.warn(`a company (${title}) already exists`);
    ctx.body = JSON.stringify({ status: 400, result: `a company (${title}) already exists` });
  }
};

const getCompaniesByUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { userId } = ctx.query;
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  const findUser = allUsers?.find(user => user.id === userId);
  const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);

  ctx.body = JSON.stringify({
    status: 200,
    result:
      !allCompanies || !allCompanies.length
        ? []
        : allCompanies
            .filter(company => findUser?.companies?.find(item => item === company.id))
            ?.map(company => ({
              companyName: company.title,
              companyId: company.id,
              userRole: company.admin === findUser?.id ? 'Admin' : '',
            })),
  });
  logger.info("'get companies by user' successfully executed");
};

const getCompanyProfile = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId } = ctx.query;
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
  const { companyId } = ctx.query;
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

export { addCompany, editCompanyProfile, getCompanyProfile, getCompaniesByUser };
