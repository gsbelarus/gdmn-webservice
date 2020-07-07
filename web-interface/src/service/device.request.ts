import { DEVICE_ID, patch, remove, post } from './http.service';
import { IResponse, IDevice } from '../../../common';
import { INetworkError, IRemoveDevicesResponse, IBlockDevicesResponse, ICreateDeviceNameResponse } from '../queryTypes';

const createDevice = async (title: string, userId: string) => {
  const body = JSON.stringify({
    userId,
    title
  });
  const res = await post<IResponse<undefined>>('/devices/newName', body);

  if (res.result) {
    return {
      type: 'CREATE_DEVICENAME'
    } as ICreateDeviceNameResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

const deleteDevice = async (userId: string, uId: string) => {
  const body = JSON.stringify({
    userId: userId
  });
  const res = await remove<IResponse<undefined>>(`/devices/${uId}?deviceId=${DEVICE_ID}`, body);

  if (res.result) {
    return {
      type: 'REMOVE_DEVICES'
    } as IRemoveDevicesResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

const blockDevice = async (uId: string, userId: string, isBlock: boolean) => {
  const body = JSON.stringify({
    isBlock
  });
  const res = await patch<IResponse<IDevice>>(`/devices/${uId}/user/${userId}?deviceId=${DEVICE_ID}`, body);

  if (res.result) {
    return {
      type: 'BLOCK_DEVICES',
      device: res.data
    } as IBlockDevicesResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

export { deleteDevice, blockDevice, createDevice };
