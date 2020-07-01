import { users, devices } from './dao/db';
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

  // Удаляем поля которые нельзя перезаписывать
  delete user.password;

  // Проверяем свойство 'companies' => Проверяем что организации существуют

  if (!oldUser) {
    throw new Error('пользователь не найден');
  }

  await users.update({ ...oldUser, ...user });

  return user.id;
};

/**
 * Удаляет одного пользователя
 * @param {string} id - идентификатор пользователя
 * */
const deleteOne = async (id: string): Promise<void> => {
  if (!(await users.find(id))) {
    throw new Error('user not found');
  }

  // TODO Если пользователь являестя админом организации то прерывать
  // удаление с соответствующим сообщением
  await users.delete(id);
};

/**
 * Возвращает списолк устройст пользователя
 * @param {string} id - идентификатор пользователя
 * */
const findDevicesByUserId = async (userId: string) => {
  const user = await users.find(userId);

  if (!user) {
    throw new Error('пользователь не найден');
  }

  return (await devices.read())
    .filter(device => device.user === userId)
    .map(device => ({ uid: device.uid, state: device.blocked ? 'blocked' : 'active' }));
};

const addCompanyToUser = async (userId: string, companyName: string) => {
  const user = await findOne(userId);
  if (user.companies?.some(i => companyName === i)) {
    throw new Error('организация уже привязана к пользователю');
  }

  return users.update({ ...user, companies: [...user.companies, companyName] });
};

const removeCompanyFromUser = async (userId: string, companyName: string) => {
  const user = await findOne(userId);
  if (user.companies?.some(i => companyName === i)) {
    throw new Error('организация не привязана к пользователю');
  }

  return users.update({ ...user, companies: user.companies?.filter(i => i === companyName) });
};

export {
  findOne,
  findAll,
  findByUserName,
  updateOne,
  deleteOne,
  addCompanyToUser,
  removeCompanyFromUser,
  findDevicesByUserId,
};
