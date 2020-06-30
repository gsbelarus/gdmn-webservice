import { users } from './dao/db';
import { makeProfile } from '../controllers/user';
import { IUser } from '../../../common';

const findOne = async (userId: string) => users.find(userId);

const findByUserName = async (userName: string) => users.find(user => user.id === userName);

const findAll = async () => (await users.read()).map(el => makeProfile(el));

/**
 * Обновляет одного пользователя
 * @param {IUser} user - пользователь
 * @return id, идентификатор пользователя
 * */
const updateOne = async (user: IUser) => {
  const oldUser = await users.find(user.id || user.userName);

  if (!oldUser) {
    throw new Error('пользователь не найден');
  }

  await users.update({ ...oldUser, ...user });

  return user.id;
};

const addCompanyToUser = async (userId: string, companyName: string) => {
  const user = await findOne(userId);
  if (user.companies?.some(i => companyName === i)) {
    throw new Error('организация уже существует у пользователя');
  }

  return users.update({ ...user, companies: [...user.companies, companyName] });
};

export { findOne, findByUserName, updateOne, addCompanyToUser, findAll };
