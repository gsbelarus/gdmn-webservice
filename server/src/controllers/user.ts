import { IUser, IDevice, IActivationCode } from '../models/models';
import { readFile, writeFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_USERS, PATH_LOCAL_DB_DEVICES, PATH_LOCAL_DB_ACTIVATION_CODES } from '../server';
import { ParameterizedContext } from 'koa';
import log from '../utils/logger';
import { IResponse } from '../models/requests';

export const makeUser = (user: IUser) => ({
  id: user.id,
  userName: user.userName,
  firstName: user.firstName,
  lastName: user.lastName,
  phoneNumber: user.phoneNumber,
  companies: user.companies,
  creatorId: user.creatorId,
});

const getUsers = async (ctx: ParameterizedContext): Promise<void> => {
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  ctx.body = JSON.stringify({
    status: 200,
    result: !allUsers || !allUsers.length ? [] : allUsers.map(makeUser),
  });
  log.info('get users by device successfully');
};

const getProfile = async (ctx: ParameterizedContext): Promise<void> => {
  const userId: string = ctx.params.id;
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  const user = allUsers && allUsers.find(user => user.id === userId);
  if (!allUsers || user === undefined) {
    log.info(`no such user`);
    const res: IResponse<string> = { status: 400, result: 'no such user' };
    ctx.throw(400, JSON.stringify(res));
  }
  log.info('getUser successfully returned');
  ctx.body = JSON.stringify({
    status: 200,
    result: makeUser(user),
  });
};

const editProfile = async (ctx: ParameterizedContext): Promise<void> => {
  const userId: string = ctx.params.id;
  const newUser = ctx.request.body;
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  const idx = allUsers && allUsers.findIndex(user => user.id === userId);

  if (!allUsers || idx === undefined || idx < 0) {
    log.warn(`no such user(${newUser.userName})`);
    const res: IResponse<string> = { status: 400, result: 'no such user' };
    ctx.throw(400, JSON.stringify(res));
  }

  await writeFile(
    PATH_LOCAL_DB_USERS,
    JSON.stringify([
      ...allUsers.slice(0, idx),
      {
        ...allUsers[idx],
        ...newUser,
      },
      ...allUsers.slice(idx + 1),
    ]),
  );
  ctx.body = JSON.stringify({ status: 200, result: 'user edited successfully' });
  log.info('user edited successfully');
};

const getDevicesByUser = async (ctx: ParameterizedContext): Promise<void> => {
  const userId: string = ctx.params.id;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  ctx.body = JSON.stringify({
    status: 200,
    result:
      !allDevices || !allDevices.length
        ? []
        : allDevices
            .filter(device => device.user === userId)
            .map(device => ({ uid: device.uid, state: device.isBlock ? 'blocked' : 'active' })),
  });
  log.info('get devices by user successfully');
};

const removeUser = async (ctx: ParameterizedContext): Promise<void> => {
  const userId: string = ctx.params.id;
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  const newUsers = allUsers?.filter(el => userId !== el.id);

  if (allUsers === newUsers) {
    log.warn('no such user');
    const res: IResponse<string> = { status: 400, result: 'no such user' };
    ctx.throw(400, JSON.stringify(res));
  }

  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const newDevices = allDevices?.filter(el => userId !== el.user);

  const allCodes: IActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODES);
  const newCodes = allCodes?.filter(el => userId !== el.user);

  await writeFile(PATH_LOCAL_DB_USERS, JSON.stringify(newUsers ?? []));

  if (allDevices !== newDevices) await writeFile(PATH_LOCAL_DB_DEVICES, JSON.stringify(newDevices ?? []));

  if (allCodes !== newCodes) await writeFile(PATH_LOCAL_DB_ACTIVATION_CODES, JSON.stringify(newCodes ?? []));

  ctx.body = JSON.stringify({ status: 200, result: 'users removed successfully' });
  log.info('users removed successfully');
};

// const removeUsersFromCompany = async (ctx: ParameterizedContext): Promise<void> => {
//   if (ctx.isAuthenticated()) {
//     const companyId: string = ctx.params.id;
//     const users: string[] = ctx.request.body?.users;
//     const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
//     const newUsers = allUsers?.map(el =>
//       users.findIndex((u: string) => u === el.id) !== -1
//         ? { ...el, companies: el.companies?.filter(o => o !== companyId) }
//         : el,
//     );
//     /** Пока только удалим организацию у пользователей */
//     await writeFile(PATH_LOCAL_DB_USERS, JSON.stringify(newUsers));

//     ctx.body = JSON.stringify({ status: 200, result: 'users removed successfully' });
//     log.info('users removed successfully');
//   } else {
//     ctx.status = 403;
//     ctx.body = JSON.stringify({ status: 403, result: 'access denied' });
//     log.warn('access denied');
//   }
// };

export { getDevicesByUser, getUsers, getProfile, removeUser, editProfile };
