import { ParameterizedContext } from 'koa';
import log from '../utils/logger';
import { IResponse, IDevice, IActivationCode, IUser, IUserProfile } from '../../../common';
import { userService } from '../services';
import { users, devices, codes } from '../services/dao/db';

export const makeProfile = (user: IUser) => ({
  id: user.id,
  userName: user.userName,
  firstName: user.firstName,
  lastName: user.lastName,
  phoneNumber: user.phoneNumber,
  companies: user.companies,
  creatorId: user.creatorId,
});

const getUsers = async (ctx: ParameterizedContext): Promise<void> => {
  const result: IResponse<IUserProfile[]> = {
    result: true,
    data: (await users.read()).map(makeProfile),
  };
  log.info('USERS: getUsers: <- OK');
  ctx.type = 'application/json';
  ctx.status = 200;
  ctx.body = JSON.stringify(result);
};

const getUser = async (ctx: ParameterizedContext): Promise<void> => {
  ctx.type = 'application/json';
  const { id: userId } = ctx.params as { id: string };
  try {
    if (!userId) {
      log.info('id is required');
      const res: IResponse<string> = { result: false, error: 'id is required' };
      ctx.throw(400, JSON.stringify(res));
    }

    const profile = await userService.findByUserId(userId);

    if (!profile) {
      log.info(`no such user`);
      const res: IResponse<string> = { result: false, error: 'no such user' };
      ctx.throw(404, JSON.stringify(res));
    }
    log.info('getUser successfully returned');
    const result: IResponse<IUserProfile> = { result: true, data: makeProfile(profile) };
    ctx.status = 200;
    ctx.body = JSON.stringify(result);
  } catch (err) {
    log.info('something wrong');
    const res: IResponse<string> = { result: false, error: 'something wrong' };
    ctx.throw(400, JSON.stringify(res));
  }

  // const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  // const user = allUsers && allUsers.find(user => user.id === userId);
  // if (!allUsers || user === undefined) {
  //   log.info(`no such user`);
  //   const res: IResponse<string> = { result: false, error: 'no such user' };
  //   ctx.status = 404;
  //   ctx.body = JSON.stringify(res);
  //   return;
  // }
  // log.info('getUser successfully returned');
  // const result: IResponse<IMakeUser> = { result: true, data: makeUser(user) };
  // ctx.status = 200;
  // ctx.body = JSON.stringify(result);
};

const updateUser = async (ctx: ParameterizedContext): Promise<void> => {
  const userId: string = ctx.params.id;
  const newUser = ctx.request.body;
  const idx = (await users.read()).findIndex(user => user.id === userId);
  ctx.type = 'application/json';

  if (!users || idx === undefined || idx < 0) {
    log.warn(`USERS: updateUser <- user (${newUser.userName}) not found`);
    const res: IResponse<string> = { result: false, error: 'пользователь не найден' };
    ctx.throw(422, JSON.stringify(res));
  }

  delete newUser.id;
  delete newUser.creatorId;
  delete newUser.password;

  await users.insert(newUser);

  delete newUser.password;
  const result: IResponse<IUserProfile> = { result: true, data: newUser };
  log.warn('USERS: updateUser <-> OK');
  ctx.status = 200;
  ctx.body = JSON.stringify(result);
};

interface IDeviceState {
  uid: string;
  state: string;
}

const getDevicesByUser = async (ctx: ParameterizedContext): Promise<void> => {
  const userId: string = ctx.params.id;
  // const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const result: IResponse<IDeviceState[]> = {
    result: true,
    data: (await devices.read())
      .filter(device => device.user === userId)
      .map(device => ({ uid: device.uid, state: device.blocked ? 'blocked' : 'active' })),
  };
  log.info('get devices by user successfully');
  ctx.type = 'application/json';
  ctx.status = 200;
  ctx.body = JSON.stringify(result);
};

const removeUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.params;
  const user = await users.find(el => id !== el.id);

  if (!user) {
    log.warn(`USERS [removeUser]: <- user (${id}) not found`);
    const res: IResponse<string> = { result: false, error: 'пользователь не найден' };
    ctx.throw(422, JSON.stringify(res));
  }

  await users.delete(id);

  // (await codes.read()).filter(el => el.user === id).forEach(async i => await codes.delete(i.id));
  // (await devices.read()).filter(el => el.user === id).forEach(i => devices.delete(i.uid));

  ctx.type = 'application/json';
  ctx.status = 204;
  log.info('users removed successfully');
};

const addCompanyToUser = async (userId: string, companies: string[]) => {
  // const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  // const user = allUsers?.filter(item => item.id === userId)[0];
  // if (!(user && allUsers)) return;
  // const idx = allUsers.findIndex(item => item.userName === user.userName);
  // if (!allUsers || idx === undefined || idx < 0) return 1;
  // await writeFile({
  //   filename: PATH_LOCAL_DB_USERS,
  //   data: JSON.stringify([
  //     ...allUsers.slice(0, idx),
  //     { ...user, companies: user && user.companies ? [...user?.companies, ...companies] : companies },
  //     ...allUsers.slice(idx + 1),
  //   ]),
  // });
  // return 1;
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

export { getDevicesByUser, getUsers, getUser, removeUser, updateUser, addCompanyToUser };
