import { IDevice, IDeviceState } from '../../../common';
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

const addOne = async ({ deviceId, userId }: { deviceId: string; userId: string }): Promise<IDevice | undefined> => {
  if (await devices.find(device => device.uid === deviceId && device.user === userId)) {
    throw new Error('устройство уже добавлено');
  }
  const newDevice: IDevice = { uid: deviceId, user: userId, blocked: false };
  await devices.insert(newDevice);

  return newDevice;
};

const genActivationCode = async (userId: string) => {
  // const code = Math.random()
  //   .toString(36)
  //   .substr(3, 6);
  const code = `${Math.floor(1000 + Math.random() * 9000)}`;
  await codes.insert({ code, date: new Date().toString(), user: userId });

  return code;
};

export { findOne, findAll, findUsers, addOne, genActivationCode };
