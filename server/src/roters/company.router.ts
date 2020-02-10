import Router from 'koa-router';
import { ICompany, IUser } from '../models';
import { readFile, writeFile } from '../workWithFile';
import { PATH_LOCAL_DB_COMPANIES, PATH_LOCAL_DB_USERS } from '../rest';
import log4js from 'log4js';
import { editeCompanies } from './util';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const router = new Router({prefix: '/company'});

router.post('/new', ctx => addCompany(ctx));
router.get('/byUser', ctx => getCompaniesByUser(ctx));
router.get('/profile', ctx => getProfile(ctx));
router.post('/editeProfile', ctx => editeProfile(ctx));

const addCompany = async(ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {title} = ctx.query;
    const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
    if(!(allCompanies && allCompanies.find( company => company.title === title))) {
      await writeFile(
        PATH_LOCAL_DB_COMPANIES,
        JSON.stringify(allCompanies
          ? [...allCompanies, {id: title, title, admin: ctx.state.user.id}]
          : [{id: title, title, admin: ctx.state.user.id}]
        )
      );
      const res = await editeCompanies(ctx.state.user.id, [title]);
      const res1 = await editeCompanies('gdmn', [title]);
      if(res === 0) {
        ctx.body = JSON.stringify({ status: 200, result: title});
        logger.info('new company added successfully');
      } else {
        ctx.body = JSON.stringify({ status: 404, result: `such an user(${ctx.state.user.id}) already exists`});
        logger.warn(`such an user(${ctx.state.user.id}) already exists`);
      }
    } else {
      ctx.body = JSON.stringify({ status: 404, result: `such an organization(${title}) already exists`});
      logger.warn(`such an organization(${title}) already exists`);
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const getCompaniesByUser = async (ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {userId} = ctx.query;
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    const findUser = allUsers && allUsers.find( user => user.id === userId);
    const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
    ctx.body = JSON.stringify({
      status: 200,
      result: !allCompanies || !allCompanies.length
      ? []
      : allCompanies
        .filter( company => findUser?.companies?.find(item => item === company.id))!
        .map(company => {
          return {companyName: company.title, companyId: company.id, userRole: company.admin === findUser?.id ? 'Admin' : ''}
        })
    });
    logger.info('get companies by user successfully');
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const getProfile = async (ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {companyId} = ctx.query;
    const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
    const result = allCompanies && allCompanies.find(company => company.id === companyId);
    if(!allCompanies || !result) {
      ctx.body = JSON.stringify({ status: 404, result: `no such organization(${companyId})`});
      logger.warn(`no such company(${companyId})`);
    } else {
      ctx.body = JSON.stringify({ status: 200, result});
      logger.info('get profile company successfully');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const editeProfile = async (ctx: any) => {
  if(ctx.isAuthenticated()) {
    const newCompany = ctx.request.body;
    const allCompanies: ICompany[] | undefined = await readFile(PATH_LOCAL_DB_COMPANIES);
    const idx = allCompanies && allCompanies.findIndex( company => company.id === newCompany.id );
    if(!allCompanies || idx === undefined || idx < 0) {
      ctx.body = JSON.stringify({ status: 404, result: `no such company(${newCompany.title})`});
      logger.warn(`no such company(${newCompany.title})`);
    } else {
      await writeFile(
        PATH_LOCAL_DB_COMPANIES,
        JSON.stringify([...allCompanies.slice(0, idx), {id: allCompanies[idx].id, admin: allCompanies[idx].admin, ...newCompany}, ...allCompanies.slice(idx + 1)]
        )
      );
      ctx.body = JSON.stringify({ status: 200, result: 'company edited successfully'});
      logger.info('company edited successfully');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

export default router;
