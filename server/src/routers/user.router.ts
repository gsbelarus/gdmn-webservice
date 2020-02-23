import Router from 'koa-router';
import { IUser, IDevice, IActivationCode } from '../models';
import { readFile, writeFile } from '../workWithFile';
import { PATH_LOCAL_DB_USERS, PATH_LOCAL_DB_DEVICES, PATH_LOCAL_DB_ACTIVATION_CODES } from '../rest';
import log4js from 'log4js';
import { editeCompanies } from './util';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const router = new Router({ prefix: '/user' });

router.get('/byDevice', ctx => getUsersByDevice(ctx));
router.get('/all', ctx => getUsers(ctx));
router.get('/byCompany', ctx => getUsersByCompany(ctx));
router.post('/edite', ctx => editeProfile(ctx));
router.post('/addCompany', ctx => addCompany(ctx));
router.post('/removeUsers', ctx => removeUsers(ctx));
router.post('/removeUsersFromCompany', ctx => removeUsersFromCompany(ctx));

const getUsersByDevice = async (ctx: any) => {
  if (ctx.isAuthenticated()) {
    const { idDevice } = ctx.query;
    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    ctx.body = JSON.stringify({
      status: 200,
      result:
        !allDevices || !allDevices.length
          ? []
          : allDevices
              .filter(device => device.uid === idDevice)
              .map(device => {
                const user = allUsers && allUsers.find(el => el.id === device.user);
                return user ? { user: user.userName, state: device.isBlock ? 'blocked' : 'active' } : 'not found user';
              }),
    });
    logger.info('get users by device successfully');
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied` });
    logger.warn(`access denied`);
  }
};

const getUsers = async (ctx: any) => {
  if (ctx.isAuthenticated()) {
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    ctx.body = JSON.stringify({
      status: 200,
      result:
        !allUsers || !allUsers.length
          ? []
          : allUsers.map(user => ({
              id: user.id,
              userName: user.userName,
              firstName: user.firstName,
              lastName: user.lastName,
              phoneNumber: user.phoneNumber,
              creatorId: user.creatorId,
            })),
    });
    logger.info('get users by device successfully');
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied` });
    logger.warn(`access denied`);
  }
};

const getUsersByCompany = async (ctx: any) => {
  if (ctx.isAuthenticated()) {
    const { companyId } = ctx.query;
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    ctx.body = JSON.stringify({
      status: 200,
      result:
        allUsers &&
        allUsers
          .filter(user => user.companies && user.companies.length && user.companies.find(org => org === companyId))
          .map(user => ({
            id: user.id,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            creatorId: user.creatorId,
          })),
    });
    logger.info('get users by company successfully');
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied` });
    logger.warn(`access denied`);
  }
};

const editeProfile = async (ctx: any) => {
  if (ctx.isAuthenticated()) {
    const newUser = ctx.request.body;
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    const idx = allUsers && allUsers.findIndex(user => user.userName === newUser.userName);
    if (!allUsers || idx === undefined || idx < 0) {
      ctx.body = JSON.stringify({ status: 404, result: `no such user(${newUser.userName})` });
      logger.warn(`no such user(${newUser.userName})`);
    } else {
      await writeFile(
        PATH_LOCAL_DB_USERS,
        JSON.stringify([
          ...allUsers.slice(0, idx),
          {
            ...allUsers[idx],
            lastName: newUser.lastName,
            firstName: newUser.firstName,
            phoneNumber: newUser.phoneNumber,
            password: newUser.password,
          },
          ...allUsers.slice(idx + 1),
        ]),
      );
      ctx.body = JSON.stringify({ status: 200, result: 'user edited successfully' });
      logger.info('user edited successfully');
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied` });
    logger.warn(`access denied`);
  }
};

const addCompany = async (ctx: any) => {
  if (ctx.isAuthenticated()) {
    const { companyId, userId } = ctx.request.body;
    const res = await editeCompanies(userId, [companyId]);
    if (res === 0) {
      ctx.body = JSON.stringify({ status: 200, result: `organization(${companyId}) added to user(${userId})` });
      logger.info(`organization(${companyId}) added to user(${userId})`);
    } else {
      ctx.body = JSON.stringify({ status: 404, result: `no such user(${userId})` });
      logger.warn(`no such user(${userId})`);
    }
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied` });
    logger.warn(`access denied`);
  }
};

const removeUsers = async (ctx: any) => {
  if (ctx.isAuthenticated()) {
    const { users } = ctx.request.body;
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    const newUsers = allUsers?.filter(el => !users.findIndex((u: any) => u.id === el.id));

    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    const newDevices = allDevices?.filter(el => !users.findIndex((u: any) => u.id === el.user));

    const allCodes: IActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODES);
    const newCodes = allCodes?.filter(el => !users.findIndex((u: any) => u.id === el.user));

    await writeFile(PATH_LOCAL_DB_USERS, JSON.stringify(newUsers));

    await writeFile(PATH_LOCAL_DB_DEVICES, JSON.stringify(newDevices));

    await writeFile(PATH_LOCAL_DB_ACTIVATION_CODES, JSON.stringify(newCodes));

    ctx.body = JSON.stringify({ status: 200, result: 'users removed successfully' });
    logger.info('users removed successfully');
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied` });
    logger.warn(`access denied`);
  }
};

const removeUsersFromCompany = async (ctx: any) => {
  if (ctx.isAuthenticated()) {
    const { users, companyId } = ctx.request.body;
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    const newUsers = allUsers?.map(el =>
      users.findIndex((u: any) => u === el.id) !== -1
        ? { ...el, companies: el.companies?.filter(o => o !== companyId) }
        : el,
    );
    /** Пока только удалим организацию у пользователей */
    await writeFile(PATH_LOCAL_DB_USERS, JSON.stringify(newUsers));

    ctx.body = JSON.stringify({ status: 200, result: 'users removed successfully' });
    logger.info('users removed successfully');
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: `access denied` });
    logger.warn(`access denied`);
  }
};

export default router;
