import Router from 'koa-router';
import { Organisation } from '../models';
import { readFile, writeFile } from '../workWithFile';
import { PATH_LOCAL_DB_ORGANISATIONS, PATH_LOCAL_DB_ACTIVATION_CODE } from '../rest';

const router = new Router({prefix: '/organisation'});

router.post('/new', ctx => addOrganisation(ctx));

const addOrganisation = async(ctx: any) => {
  const allOrganisations: Organisation[] | undefined = await readFile(PATH_LOCAL_DB_ORGANISATIONS);
  await writeFile(
    PATH_LOCAL_DB_ACTIVATION_CODE,
    JSON.stringify(allOrganisations && allOrganisations.length
      ? [...allOrganisations, {id: allOrganisations[allOrganisations.length - 1].id + 1, title: ctx.request.body.title}]
      : [{id: 0, title: ctx.request.body.title}]
    )
  );
}

export default router;
