import { readFile, writeFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_USERS, PATH_LOCAL_DB_DEVICES, PATH_LOCAL_DB_ACTIVATION_CODES } from '../server';
import { ParameterizedContext } from 'koa';
import log from '../utils/logger';
import { IResponse, IDevice, IActivationCode, IUser, IMakeUser } from '../../../common';

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
  const result: IResponse<IMakeUser[]> = {
    result: true,
    data: !allUsers || !allUsers.length ? [] : allUsers.map(makeUser),
  };
  log.info('get users by device successfully');
  ctx.status = 200;
  ctx.body = JSON.stringify(result);
};

const getProfile = async (ctx: ParameterizedContext): Promise<void> => {
  const userId: string = ctx.params.id;
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  const user = allUsers && allUsers.find(user => user.id === userId);
  if (!allUsers || user === undefined) {
    log.info(`no such user`);
    const res: IResponse<string> = { result: false, error: 'no such user' };
    ctx.throw(404, JSON.stringify(res));
  }
  log.info('getUser successfully returned');
  const result: IResponse<IMakeUser> = { result: true, data: makeUser(user) };
  ctx.status = 200;
  ctx.body = JSON.stringify(result);
};

const editProfile = async (ctx: ParameterizedContext): Promise<void> => {
  const userId: string = ctx.params.id;
  const newUser = ctx.request.body;
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  const idx = allUsers && allUsers.findIndex(user => user.id === userId);

  if (!allUsers || idx === undefined || idx < 0) {
    log.warn(`no such user(${newUser.userName})`);
    const res: IResponse<string> = { result: false, error: 'no such user' };
    ctx.throw(422, JSON.stringify(res));
  }

  delete newUser.id;
  delete newUser.creatorId;
  delete newUser.password;
  const user = { ...allUsers[idx], ...newUser };

  await writeFile(PATH_LOCAL_DB_USERS, JSON.stringify([...allUsers.slice(0, idx), user, ...allUsers.slice(idx + 1)]));
  const result: IResponse<IMakeUser> = { result: true, data: user };
  log.info('user edited successfully');
  ctx.status = 200;
  ctx.body = JSON.stringify(result);
};

interface IDeviceState {
  uid: string;
  state: string;
}

const getDevicesByUser = async (ctx: ParameterizedContext): Promise<void> => {
  const userId: string = ctx.params.id;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const result: IResponse<IDeviceState[]> = {
    result: true,
    data:
      !allDevices || !allDevices.length
        ? []
        : allDevices
            .filter(device => device.user === userId)
            .map(device => ({ uid: device.uid, state: device.isBlock ? 'blocked' : 'active' })),
  };
  log.info('get devices by user successfully');
  ctx.status = 200;
  ctx.body = JSON.stringify(result);
};

const removeUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  const newUsers = allUsers?.filter(el => userId !== el.id);

  if (allUsers === newUsers) {
    log.warn('no such user');
    const res: IResponse<string> = { result: false, error: 'no such user' };
    ctx.throw(422, JSON.stringify(res));
  }

  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const newDevices = allDevices?.filter(el => userId !== el.user);

  const allCodes: IActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODES);
  const newCodes = allCodes?.filter(el => userId !== el.user);

  await writeFile(PATH_LOCAL_DB_USERS, JSON.stringify(newUsers ?? []));

  if (allDevices !== newDevices) await writeFile(PATH_LOCAL_DB_DEVICES, JSON.stringify(newDevices ?? []));

  if (allCodes !== newCodes) await writeFile(PATH_LOCAL_DB_ACTIVATION_CODES, JSON.stringify(newCodes ?? []));

  ctx.status = 204;
  log.info('users removed successfully');
};

const addCompanyToUser = async (userId: string, companies: string[]) => {
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  const user = allUsers?.filter(item => item.id === userId)[0];

  if (!(user && allUsers)) return;

  const idx = allUsers.findIndex(item => item.userName === user.userName);

  if (!allUsers || idx === undefined || idx < 0) return 1;

  await writeFile(
    PATH_LOCAL_DB_USERS,
    JSON.stringify([
      ...allUsers.slice(0, idx),
      { ...user, companies: user && user.companies ? [...user?.companies, ...companies] : companies },
      ...allUsers.slice(idx + 1),
    ]),
  );
  return 1;
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

export { getDevicesByUser, getUsers, getProfile, removeUser, editProfile, addCompanyToUser };
