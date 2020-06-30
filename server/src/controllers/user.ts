import { ParameterizedContext } from 'koa';
import log from '../utils/logger';
import { IResponse, IDeviceState, IDevice, IActivationCode, IUser, IUserProfile } from '../../../common';
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

const getUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;

  if (!userId) {
    ctx.throw(400, 'не указан идентификатор пользователя');
  }

  try {
    const profile = await userService.findOne(userId);

    if (!profile) {
      ctx.throw(404, 'пользователь не найден');
    }

    const result: IResponse<IUserProfile> = { result: true, data: makeProfile(profile) };

    ctx.status = 200;
    ctx.body = result;

    log.info('getUser: OK');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const getUsers = async (ctx: ParameterizedContext): Promise<void> => {
  try {
    const user = await userService.findAll();

    const result: IResponse<IUserProfile[]> = { result: true, data: user };

    ctx.status = 200;
    ctx.body = result;

    log.info('getUsers: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

const updateUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;
  const { body: user } = ctx.request;

  if (!userId) {
    ctx.throw(400, 'не указан идентификатор пользователя');
  }

  if (!user) {
    ctx.throw(400, 'не указаны данные пользователя');
  }

  try {
    const userId = await userService.updateOne(user);

    const result: IResponse<string> = { result: true, data: userId };

    ctx.status = 200;
    ctx.body = result;

    log.warn('updateUser: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

const getDevicesByUser = async (ctx: ParameterizedContext): Promise<void> => {
  const userId: string = ctx.params.id;
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
    log.warn(`removeUser: user ${id} not found`);
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
