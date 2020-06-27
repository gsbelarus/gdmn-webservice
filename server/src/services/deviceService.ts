import { IActivationCode, IDevice } from '../../../common';
import { devices, codes } from './dao/db';

const addNewDevice = async ({
  userId,
  deviceId,
}: {
  userId: string;
  deviceId: string;
}): Promise<IDevice | undefined> => {
  if (!devices.find(device => device.uid === deviceId && device.user === userId)) {
    const newDevice: IDevice = { uid: deviceId, user: userId, blocked: false };
    await devices.insert(newDevice);
    // await writeFile({
    //   filename: PATH_LOCAL_DB_DEVICES,
    //   data: JSON.stringify(allDevices ? [...allDevices, newDevice] : [newDevice]),
    // });

    return newDevice;
  }
  return undefined;
};

const genActivationCode = async (userId: string) => {
  // const code = Math.random()
  //   .toString(36)
  //   .substr(3, 6);
  const code = `${Math.floor(1000 + Math.random() * 9000)}`;
  await codes.insert({ code, date: new Date().toString(), user: userId });
  return code;
};

export { genActivationCode, addNewDevice };
