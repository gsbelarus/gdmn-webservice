import Router from 'koa-router';
import { IOrganisation } from '../models';
import { readFile, writeFile } from '../workWithFile';
import { PATH_LOCAL_DB_ORGANISATIONS } from '../rest';

const router = new Router({prefix: '/organisation'});

router.post('/new', ctx => addOrganisation(ctx));

const addOrganisation = async(ctx: any) => {
  // TODO: logic
}

export default router;
