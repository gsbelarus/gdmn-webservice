import Router from 'koa-router';
import { IOrganisation } from '../models';
import { readFile, writeFile } from '../workWithFile';
import { PATH_LOCAL_DB_ORGANISATIONS } from '../rest';
import log4js from 'log4js';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const router = new Router({prefix: '/organisation'});

router.post('/new', ctx => addOrganisation(ctx));
router.get('/profile', ctx => getProfile(ctx));
router.post('/editeProfile', ctx => editeProfile(ctx));

const addOrganisation = async(ctx: any) => {
  const {title} = ctx.request.body;
  const allOrganisations: IOrganisation[] | undefined = await readFile(PATH_LOCAL_DB_ORGANISATIONS);
  if(!(allOrganisations && allOrganisations.find( organisation => organisation.title === title))) {
    await writeFile(
      PATH_LOCAL_DB_ORGANISATIONS,
      JSON.stringify(allOrganisations
        ? [...allOrganisations, {id: allOrganisations[allOrganisations.length - 1].id + 1, title, admin: ctx.state.user}]
        : [{title}]
      )
    );
    ctx.body = JSON.stringify({ status: 200, result: 'new organisation added successfully'});
    logger.info('new organisation added successfully');
  } else {
    ctx.body = JSON.stringify({ status: 404, result: `such an organization(${title}) already exists`});
    logger.warn(`such an organization(${title}) already exists`);
  }
}

const getProfile = async (ctx: any) => {
  const {title} = ctx.request.body;
  const allOrganisations: IOrganisation[] | undefined = await readFile(PATH_LOCAL_DB_ORGANISATIONS);
  const result = allOrganisations && allOrganisations.find(organisation => organisation.title === title);
  if(!allOrganisations || !result) {
    ctx.body = JSON.stringify({ status: 404, result: `no such organization(${title})`});
    logger.warn(`no such organization(${title})`);
  } else {
    ctx.body = JSON.stringify({ status: 200, result});
    logger.info('get profile organisation successfully');
  }
}

const editeProfile = async (ctx: any) => {
  const newOrganisation = ctx.request.body;
  const allOrganisations: IOrganisation[] | undefined = await readFile(PATH_LOCAL_DB_ORGANISATIONS);
  const idx = allOrganisations && allOrganisations.findIndex( organisation => organisation.title === newOrganisation.title );
  console.log(idx);
  if(!allOrganisations || idx === undefined || idx < 0) {
    ctx.body = JSON.stringify({ status: 404, result: `no such organization(${newOrganisation.title})`});
    logger.warn(`no such organization(${newOrganisation.title})`);
  } else {
    await writeFile(
      PATH_LOCAL_DB_ORGANISATIONS,
      JSON.stringify([...allOrganisations.slice(0, idx), {id: allOrganisations[idx].id, ...newOrganisation}, ...allOrganisations.slice(idx + 1)]
      )
    );
    ctx.body = JSON.stringify({ status: 200, result: 'organisation edited successfully'});
    logger.info('organisation edited successfully');
  }
}

export default router;
