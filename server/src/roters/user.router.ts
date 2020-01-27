import Router from 'koa-router';
import { IUser, IDevice, IActivationCode } from '../models';
import { readFile, writeFile } from '../workWithFile';
import { PATH_LOCAL_DB_USERS, PATH_LOCAL_DB_DEVICES, PATH_LOCAL_DB_ACTIVATION_CODES } from '../rest';
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
router.post('/removeUsers', ctx => removeUsers(ctx));
router.post('/removeUsersFromOrganisation', ctx => removeUsersFromOrganisation(ctx));

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
      .map(user => ({id: user.id, userName: user.userName, firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber, creatorId: user.creatorId}))
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
        .map(user => ({id: user.id, userName: user.userName, firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber, creatorId: user.creatorId}))
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
        JSON.stringify([...allUsers.slice(0, idx), {...allUsers[idx], lastName: newUser.lastName, firstName: newUser.firstName, phoneNumber: newUser.phoneNumber, password: newUser.password}, ...allUsers.slice(idx + 1)]
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
    const {organisationId, userId} = ctx.request.body;
    const res = await editeOrganisations(userId, [organisationId]);
    if(res === 0) {
      ctx.body = JSON.stringify({ status: 200, result: `organization(${organisationId}) added to user(${userId})`});
      logger.info(`organization(${organisationId}) added to user(${userId})`);
    } else {
      ctx.body = JSON.stringify({ status: 404, result: `no such user(${userId})`});
      logger.warn(`no such user(${userId})`);
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const removeUsers = async(ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {users} = ctx.request.body;
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    const newUsers = allUsers?.filter(all_u => !users.findIndex((u: any) => u.id === all_u.id));

    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    const newDevices = allDevices?.filter(all_d => !users.findIndex((u: any) => u.id === all_d.user));

    const allCodes: IActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODES);
    const newCodes = allCodes?.filter(all_d => !users.findIndex((u: any) => u.id === all_d.user));

    await writeFile(
      PATH_LOCAL_DB_USERS,
      JSON.stringify(newUsers));

    await writeFile(
      PATH_LOCAL_DB_DEVICES,
      JSON.stringify(newDevices));

    await writeFile(
      PATH_LOCAL_DB_ACTIVATION_CODES,
      JSON.stringify(newCodes));

    ctx.body = JSON.stringify({ status: 200, result: 'users removed successfully'});
    logger.info('users removed successfully');

  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

const removeUsersFromOrganisation = async(ctx: any) => {
  if(ctx.isAuthenticated()) {
    const {users, organisationId} = ctx.request.body;
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    const newUsers = allUsers?.map(all_u =>
      users.findIndex((u: any) => u === all_u.id) !== -1  ? {...all_u, organisations: all_u.organisations?.filter(o => o !== organisationId)} : all_u);
    /**Пока только удалим организацию у пользователей */
    await writeFile(
      PATH_LOCAL_DB_USERS,
      JSON.stringify(newUsers));

    ctx.body = JSON.stringify({ status: 200, result: 'users removed successfully'});
    logger.info('users removed successfully');

  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied`});
    logger.warn(`access denied`);
  }
}

export default router;
