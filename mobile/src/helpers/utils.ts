import * as FileSystem from 'expo-file-system';
import { AsyncStorage } from 'react-native';

import { IDocument, ILine, IMessage } from '../../../common';
//import config from '../config';
import { ISellDocument, ISellLine } from '../model';

// export const baseUrl = `${config.server.protocol}${config.server.name}:${config.server.port}/${config.apiPath}`;

export const timeout = <T>(ms: number, promise: Promise<T>) => {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => reject(new Error('время вышло')), ms);
    promise.then(resolve, reject);
  });
};

export const timeoutWithСancellation = <T>(signal: Promise<void>, ms: number, promise: Promise<T>) => {
  return new Promise<T>((resolve, reject) => {
    const tmOut = setTimeout(() => reject(new Error('время вышло')), ms);

    promise.then(resolve, reject);

    signal.catch((err) => {
      clearTimeout(tmOut);
      reject(err);
    });
  });
};

interface ICancellablePromise extends Promise<never> {
  signal: Promise<never>;
  cancel: () => void;
}

export function createCancellableSignal() {
  const p: Partial<ICancellablePromise> = {};
  p.signal = new Promise((resolve, reject) => (p.cancel = () => reject(new Error('прервано пользователем'))));

  return p;
}

const dbDir = `${FileSystem.documentDirectory}db/`;

const ensureFileExists = async (dir: string) => {
  const dirInfo = await FileSystem.getInfoAsync(`${dbDir}${dir}`);
  return dirInfo.exists;
};

const getDirectory = (path: string): string => {
  const regex = /^(.+)\/([^/]+)$/;
  const res = regex.exec(path);

  return res ? res[1] : path;
};

const ensureDirExists = async (dir: string) => {
  const dirInfo = await FileSystem.getInfoAsync(`${dbDir}${dir}`);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(`${dbDir}${dir}`, { intermediates: true });
  }
};

export const appStorage = {
  setItem: async <T>(key: string, data: T) => {
    try {
      await ensureDirExists(getDirectory(key));
      await FileSystem.writeAsStringAsync(`${dbDir}${key}.json`, JSON.stringify(data));
    } catch (e) {
      console.log('error', e);
    }
  },

  getItem: async (key: string) => {
    try {
      if (!(await ensureFileExists(`${key}.json`))) {
        return;
      }
      await ensureDirExists(getDirectory(key));
      const result = await FileSystem.readAsStringAsync(`${dbDir}${key}.json`);
      return result ? JSON.parse(result) : null;
    } catch (e) {
      console.log('error', e);
    }
  },

  getItems: async (keys: string[]) => {
    const result = await AsyncStorage.multiGet(keys);
    return Object.fromEntries(result.map((i) => [i[0], JSON.parse(i[1])]));
  },

  removeItem: async (key: string) => {
    try {
      await ensureDirExists('');
      await FileSystem.deleteAsync(key);
    } catch (e) {
      console.log('error', e);
    }
  },
};
// export const appStorage = {
//   setItem: async <T>(key: string, data: T) => {
//     AsyncStorage.setItem(key, JSON.stringify(data));
//   },

//   getItem: async (key: string) => {
//     const result = await AsyncStorage.getItem(key);

//     return result ? JSON.parse(result) : null;
//   },

//   getItems: async (keys: string[]) => {
//     const result = await AsyncStorage.multiGet(keys);
//     return Object.fromEntries(result.map((i) => [i[0], JSON.parse(i[1])]));
//   },

//   removeItem: async (key: string) => {
//     await AsyncStorage.removeItem(key);
//   },
// };
export const isMessage = (obj: unknown): obj is IMessage =>
  obj instanceof Object &&
  'id' in obj &&
  'head' in obj &&
  'body' in obj &&
  (obj as IMessage).id !== undefined &&
  (obj as IMessage).head !== undefined &&
  (obj as IMessage).body !== undefined;

export const isMessagesArray = (obj: unknown): obj is IMessage[] => Array.isArray(obj) && obj.every(isMessage);

export const getDateString = (_date: string) => {
  if (!_date) {
    return '-';
  }
  const date = new Date(_date);
  return `${('0' + date.getDate()).toString().slice(-2, 3)}.${('0' + (date.getMonth() + 1).toString()).slice(
    -2,
    3,
  )}.${date.getFullYear()}`;
};

// format numbers
export type NumberFormat = 'currency' | 'number' | 'percentage';

interface INumberFormat {
  type: NumberFormat;
  decimals: number;
}

export const formatValue = (format: NumberFormat | INumberFormat, value: number | string) => {
  const type = typeof format === 'string' ? format : format.type;
  const decimals = typeof format === 'string' ? 2 : format.decimals;

  const transform = function (org: number, n: number, x: number, s: string, c: string) {
    const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : 'р') + ')',
      num = org.toFixed(Math.max(0, Math.floor(n)));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
  };

  value = typeof value === 'string' ? parseFloat(value) : value;

  switch (type) {
    case 'currency':
      return `${transform(value, decimals, 3, ' ', ',')} р.`;
    case 'number':
      return `${transform(value, decimals, 3, ' ', ',')}`;
    case 'percentage':
      return `${transform(value, decimals, 3, ' ', ',')} %`;
    default:
      return value;
  }
};

export const getNextDocLineId = (document: ISellDocument | IDocument) => {
  return (
    (document.lines as (ILine | ISellLine)[])
      .map((item: { id: string }) => Number(item.id))
      .reduce((lineId: number, currLineId: number) => (lineId > currLineId ? lineId : currLineId), -1) + 1 || 1
  );
};

export const getNextDocId = (documents: ISellDocument[]) => {
  return (
    documents?.map((item) => Number(item.id)).reduce((newId, currId) => (newId > currId ? newId : currId), 0) + 1 || 1
  );
};
