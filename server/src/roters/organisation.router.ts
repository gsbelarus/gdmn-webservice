import Router from 'koa-router';
import { IOrganisation, IUser } from '../models';
import { readFile, writeFile } from '../workWithFile';
import { PATH_LOCAL_DB_ORGANISATIONS, PATH_LOCAL_DB_USERS } from '../rest';
import log4js from 'log4js';
import { editeOrganisations } from './util';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const router = new Router({prefix: '/organisation'});

router.post('/new', ctx => addOrganisation(ctx));
router.get('/byUser', ctx => getOrganisationsByUser(ctx));
router.get('/profile', ctx => getProfile(ctx));
router.post('/editeProfile', ctx => editeProfile(ctx));

const addOrganisation = async(ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {title} = ctx.query;
    const allOrganisations: IOrganisation[] | undefined = await readFile(PATH_LOCAL_DB_ORGANISATIONS);
    if(!(allOrganisations && allOrganisations.find( organisation => organisation.title === title))) {
      await writeFile(
        PATH_LOCAL_DB_ORGANISATIONS,
        JSON.stringify(allOrganisations
          ? [...allOrganisations, {id: title, title, admin: ctx.state.user.userId}]
          : [{id: title, title, admin: ctx.state.user.userId}]
        )
      );
      const res = await editeOrganisations(ctx.state.user.id, [title]);
      const res1 = await editeOrganisations('GDMN', [title]);
      if(res === 0) {
        ctx.body = JSON.stringify({ status: 200, result: title});
        logger.info('new organisation added successfully');
      } else {
        ctx.body = JSON.stringify({ status: 404, result: `such an user(${ctx.state.user.userId}) already exists`});
        logger.warn(`such an user(${ctx.state.user.userId}) already exists`);
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

const getOrganisationsByUser = async (ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {userId} = ctx.query;
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    const findUser = allUsers && allUsers.find( user => user.userId === userId);
    const allOrganisations: IOrganisation[] | undefined = await readFile(PATH_LOCAL_DB_ORGANISATIONS);
    ctx.body = JSON.stringify({
      status: 200,
      result: !allOrganisations || !allOrganisations.length
      ? []
      : allOrganisations
        .filter( organisation => findUser?.organisations?.find(item => item === organisation.id))!
        .map(organisation => {
          return {companyName: organisation.title, companyId: organisation.id, userRole: organisation.admin === findUser?.userId ? 'Admin' : ''}
        })
    });
    logger.info('get organisations by user successfully');
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const getProfile = async (ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {idOrganisation} = ctx.query;
    const allOrganisations: IOrganisation[] | undefined = await readFile(PATH_LOCAL_DB_ORGANISATIONS);
    const result = allOrganisations && allOrganisations.find(organisation => organisation.id === idOrganisation);
    if(!allOrganisations || !result) {
      ctx.body = JSON.stringify({ status: 404, result: `no such organization(${idOrganisation})`});
      logger.warn(`no such organization(${idOrganisation})`);
    } else {
      ctx.body = JSON.stringify({ status: 200, result});
      logger.info('get profile organisation successfully');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const editeProfile = async (ctx: any) => {
  if(ctx.isAuthenticated()) {
    const newOrganisation = ctx.request.body;
    const allOrganisations: IOrganisation[] | undefined = await readFile(PATH_LOCAL_DB_ORGANISATIONS);
    const idx = allOrganisations && allOrganisations.findIndex( organisation => organisation.id === newOrganisation.id );
    if(!allOrganisations || idx === undefined || idx < 0) {
      ctx.body = JSON.stringify({ status: 404, result: `no such organization(${newOrganisation.title})`});
      logger.warn(`no such organization(${newOrganisation.title})`);
    } else {
      await writeFile(
        PATH_LOCAL_DB_ORGANISATIONS,
        JSON.stringify([...allOrganisations.slice(0, idx), {id: allOrganisations[idx].id, admin: allOrganisations[idx].admin, ...newOrganisation}, ...allOrganisations.slice(idx + 1)]
        )
      );
      ctx.body = JSON.stringify({ status: 200, result: 'organisation edited successfully'});
      logger.info('organisation edited successfully');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

export default router;
