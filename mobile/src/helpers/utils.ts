import { AsyncStorage } from 'react-native';

import config from '../config';

export const baseUrl = `${config.server.protocol}${config.server.name}:${config.server.port}/${config.apiPath}`;

export const timeout = <T>(ms: number, promise: Promise<T>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('время вышло')), ms);
    promise.then(resolve, reject);
  });
};

export const timeoutWithСancellation = <T>(signal: Promise<T>, ms: number, promise: Promise<T>) => {
  return new Promise((resolve, reject) => {
    const tmOut = setTimeout(() => reject(new Error('время вышло')), ms);

    promise.then(resolve, reject);

    signal.catch((err) => {
      clearTimeout(tmOut);
      reject(err);
    });
  });
};

interface ICancellablePromise<T> extends Promise<T> {
  signal: Promise<T>;
  cancel: () => void;
}

export function createCancellableSignal<T>() {
  const p: Partial<ICancellablePromise<T>> = {};
  p.signal = new Promise<T>((resolve, reject) => (p.cancel = () => reject(new Error('прервано пользователем'))));

  return p;
}

export const appStorage = {
  setItem: async <T>(key: string, data: T) => {
    AsyncStorage.setItem(key, JSON.stringify(data));
  },

  getItem: async (key: string) => {
    const result = await AsyncStorage.getItem(key);

    return result ? JSON.parse(result) : null;
  },

  getItems: async (keys: string[]) => {
    const result = await AsyncStorage.multiGet(keys);
    return Object.fromEntries(result.map((i) => [i[0], JSON.parse(i[1])]));
  },

  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
};
