import { get, post, put } from './http.service';
import Constants from "expo-constants";

export const authApi = {
  login: async (userCredentials: { name: string; password: string }): Promise<any> => {
    return post('/login', {
      username: userCredentials.name,
      password: userCredentials.password
    });
  },
  
  getDeviceStatus: async <T>(): Promise<T> => {
    return get(`/device/isExist?uid=${Constants.deviceId}`);
  },

  getUserStatus: async <T>(): Promise<T> => {
    return get(`/me`);
  },

/*   fetchData: async <T>(name: string): Promise<T> => {
    return get(`/${name}`);
  },

  addData: async <T>(name: string, body: any): Promise<T> => {
    return post(`/${name}`, body);
  },

  updateData: async <T>(name: string, body: any): Promise<T> => {
    return put(`/${name}`, body);
  } */
};
