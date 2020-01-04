import Router from 'koa-router';
import { IUser, IDevice } from '../models';
import { readFile, writeFile } from '../workWithFile';
import { PATH_LOCAL_DB_USERS, PATH_LOCAL_DB_DEVICES } from '../rest';
import log4js from 'log4js';
import { editeOrganisations } from './util';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const router = new Router({prefix: '/user'});

router.get('/byDevice', ctx => getUsersByDevice(ctx));
router.get('/all', ctx => getUsers(ctx));
router.get('/byOrganisation', ctx => getUsersByOrganisation(ctx));
router.post('/edite', ctx => editeProfile(ctx));
router.post('/addOrganisation', ctx => addOrganisation(ctx));

const getUsersByDevice = async (ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {idDevice} = ctx.query;
    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    ctx.body = JSON.stringify({
      status: 200,
      result: !allDevices || !allDevices.length
      ? []
      : allDevices
        .filter( device => device.uid === idDevice)
        .map(device => {
          const user = allUsers && allUsers.find(user => user.id === device.user);
          return user ? {user: user.userName, state: device.isBlock ? 'blocked' : 'active'} : 'not found user'
        })
    });
    logger.info('get users by device successfully');
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const getUsers = async (ctx: any) => {
  if(ctx.isAuthenticated()) {
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    ctx.body = JSON.stringify({
      status: 200,
      result: !allUsers || !allUsers.length
      ? []
      : allUsers
      .map(user => {return {id: user.id, userName: user.userName, firstName: user.firstName, lastName: user.lastName, phone: user.numberPhone}})
    });
    logger.info('get users by device successfully');
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const getUsersByOrganisation = async (ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {idOrganisation} = ctx.query;
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    ctx.body = JSON.stringify({
      status: 200,
      result: allUsers && allUsers
        .filter(user => user.organisations && user.organisations.length && user.organisations.find( org => org === idOrganisation))
        .map(user => {return {id: user.id, userName: user.userName, firstName: user.firstName, lastName: user.lastName, phone: user.numberPhone}})
      });
    logger.info('get users by organisation successfully');
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const editeProfile = async(ctx: any) => {
  if(ctx.isAuthenticated()) {
    const newUser = ctx.request.body;
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    const idx = allUsers && allUsers.findIndex( user => user.userName === newUser.userName );
    if(!allUsers || idx === undefined || idx < 0) {
      ctx.body = JSON.stringify({ status: 404, result: `no such user(${newUser.userName})`});
      logger.warn(`no such user(${newUser.userName})`);
    } else {
      await writeFile(
        PATH_LOCAL_DB_USERS,
        JSON.stringify([...allUsers.slice(0, idx), {id: allUsers[idx].id, password: allUsers[idx].password, ...newUser}, ...allUsers.slice(idx + 1)]
        )
      );
      ctx.body = JSON.stringify({ status: 200, result: 'user edited successfully'});
      logger.info('user edited successfully');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const addOrganisation = async(ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {organisation, user} = ctx.request;
    const res = await editeOrganisations(user, [organisation]);
    if(res === 0) {
      ctx.body = JSON.stringify({ status: 200, result: `organization(${organisation}) added to user(${user})`});
      logger.info(`organization(${organisation}) added to user(${user})`);
    } else {
      ctx.body = JSON.stringify({ status: 404, result: `no such user(${user})`});
      logger.warn(`no such user(${user})`);
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

export default router;
