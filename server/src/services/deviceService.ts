import { IDevice } from '../../../common';
import { devices, codes } from './dao/db';

const findOne = async ({ deviceId, userId }: { deviceId: string; userId?: string }) => {
  if (userId) {
    return devices.find(device => device.uid === deviceId && device.user === userId);
  }
  return devices.find(device => device.uid === deviceId);
};

const findAll = async () => {
  return devices.read();
};

/**
 * Возвращает список пользователей по устройству
 * @param {string} id - идентификатор устройства
 * */
const findUsers = async (deviceId: string) => {
  if (!(await devices.find(device => device.uid === deviceId))) {
    throw new Error('устройство не найдено');
  }

  return (await devices.read())
    .filter(device => device.uid === deviceId)
    .map(device => {
      return { uid: device.uid, user: device.user, state: device.blocked ? 'blocked' : 'active' };
    });
};

/**
 * Добавляет одно устройство
 * @param {string} deviceId - id устройства
 * @param {string} userId - id пользователя
 * @return uid, идентификатор устройства
 * */

const addOne = async ({ deviceId, userId }: { deviceId: string; userId: string }) => {
  if (await devices.find(device => device.uid === deviceId && device.user === userId)) {
    throw new Error('устройство уже добавлено');
  }
  const newDevice: IDevice = { uid: deviceId, user: userId, blocked: false };
  return await devices.insert(newDevice);
};

/**
 * Обновляет устройство
 * @param {IDevice} device - устройство
 * @return uid, идентификатор устройства
 * */
const updateOne = async (device: IDevice) => {
  const oldDevice = await devices.find(i => i.uid === device.uid);

  if (!oldDevice) {
    throw new Error('устройство не найдено');
  }

  // Удаляем поля которые нельзя перезаписывать
  delete device.user;

  await devices.update({ ...oldDevice, ...device });

  return device.uid;
};

/**
 * Удаляет одно устройство
 * @param {string} id - идентификатор устройства
 * */
const deleteOne = async ({ deviceId, userId }: { deviceId: string; userId: string }): Promise<void> => {
  if (!(await devices.find(device => device.uid === deviceId && device.user === userId))) {
    throw new Error('устройство не найдено');
  }

  await devices.delete(device => device.uid === deviceId && device.user === userId);
};

const genActivationCode = async (userId: string) => {
  // const code = Math.random()
  //   .toString(36)
  //   .substr(3, 6);
  const code = `${Math.floor(1000 + Math.random() * 9000)}`;
  await codes.insert({ code, date: new Date().toString(), user: userId });

  return code;
};

export { findOne, findAll, findUsers, addOne, deleteOne, updateOne, genActivationCode };
