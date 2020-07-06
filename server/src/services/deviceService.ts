import { IDevice, IDeviceBinding } from '../../../common';
import { devices, codes, deviceBinding, users } from './dao/db';

const findOne = async (deviceId: string) => {
  return deviceBinding.find(i => i.deviceId === deviceId);
};

const findAll = async () => {
  return devices.read();
};

const findOneByUser = async ({ deviceId, userId }: { deviceId: string; userId: string }) => {
  return deviceBinding.find(i => i.deviceId === deviceId && i.userId === userId);
};
/**
 * Возвращает список пользователей по устройству
 * @param {string} id - идентификатор устройства
 * */
const findUsers = async (deviceId: string) => {
  if (!(await deviceBinding.find(i => i.deviceId === deviceId))) {
    throw new Error('устройство не найдено');
  }

  return (await deviceBinding.read())
    .filter(i => i.deviceId === deviceId)
    .map(async i => {
      const device = await devices.find(i.deviceId);

      if (!device) {
        throw new Error('устройство не найдено');
      }

      const user = await users.find(i.userId);

      if (!user) {
        throw new Error('пользователь не найден');
      }

      return {
        userId: i.userId,
        userName: user.userName,
        deviceId: i.deviceId,
        deviceName: device.name,
        state: i.state,
      };
    });
};

/**
 * Добавляет одно устройство
 * @param {string} name - название устройства
 * @return id, идентификатор устройства
 * */

const addOne = async (deviceName: string) => {
  if (await devices.find(device => device.name === deviceName)) {
    throw new Error('устройство с таким названием уже добавлено');
  }
  const newDevice: IDevice = { name: deviceName, uid: '' };
  return await devices.insert(newDevice);
};

const bindOne = async ({ deviceId, userId }: { deviceId: string; userId: string }) => {
  if (await deviceBinding.find(i => i.id === deviceId && i.userId === userId)) {
    throw new Error('устройство уже уже связано с пользователем');
  }
  const newDeviceBinding: IDeviceBinding = { deviceId, userId, state: 'NON_ACTIVATED' };
  return await deviceBinding.insert(newDeviceBinding);
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

export { findOne, findAll, findUsers, addOne, deleteOne, updateOne, bindOne, findOneByUser, genActivationCode };
