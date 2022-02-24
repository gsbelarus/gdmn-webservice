import * as FileSystem from 'expo-file-system';

import { IContact, IDocument, IGood, IMessage, IRemains } from '../../../common';
import {
  IMGoodData,
  IMGoodRemain,
  IRemGood,
  IModelRem,
  IRemainsData,
} from '../../../common/base';
import { log } from './log';

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
      const s = JSON.stringify(data);
      log(`about to start writing ${s.length} chars to ${key}.json`);
      await FileSystem.writeAsStringAsync(`${dbDir}${key}.json`, s);
    } catch (e: any) {
      log('error', e);
    }
  },

  getItem: async (key: string) => {
    try {
      if (!(await ensureFileExists(`${key}.json`))) {
        return;
      }
      await ensureDirExists(getDirectory(key));
      const result = await FileSystem.readAsStringAsync(`${dbDir}${key}.json`);
      log(`read ${result.length} chars`);
      return result ? JSON.parse(result) : null;
    } catch (e: any) {
      log('error', e);
    }
  },

  /*   getItems: async (keys: string[]) => {
      const result = await AsyncStorage.multiGet(keys);
      return Object.fromEntries(result.map((i) => [i[0], JSON.parse(i[1])]));
    }, */

  removeItem: async (key: string) => {
    try {
      await ensureDirExists('');
      await FileSystem.deleteAsync(`${dbDir}${key}.json`);
    } catch (e: any) {
      log('error', e);
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

export const getNextDocLineId = (document: IDocument) => {
  return (
    document?.lines
      .map((item: { id: number }) => item.id)
      .reduce((lineId: number, currLineId: number) => (lineId > currLineId ? lineId : currLineId), -1) + 1 || 1
  );
};

export const getNextDocId = (documents: IDocument[]) => {
  return documents?.map((item) => item.id).reduce((newId, currId) => (newId > currId ? newId : currId), 0) + 1 || 1;
};

export const getNextDocNumber = (documents: IDocument[]) => {
  return (
    documents
      ?.map((item) => parseInt(item.head.docnumber, 10))
      .reduce((newId, currId) => (newId > currId ? newId : currId), 0) + 1 || 1
  ).toString();
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

// export const getRemainsModel = (contacts: IContact[], goods: IGood[], remains: IRemains[]) => {
//   log('getRemainsModel', 'Начало построения модели');
//   const remModelData: IModelData<IMDGoodRemain> = {};

//   if (contacts.length && goods.length) {
//     for (const c of contacts) {
//       log('getRemainsModel', `started ${c.name}`);

//       if (remains.length) {
//         const remainsByGoodId = remains
//           .find((r: IRemains) => r.contactId === c.id)
//           ?.data.reduce((p: any, { goodId, price, q }: IRemainsData) => {
//             const x = p[goodId];
//             if (!x) {
//               p[goodId] = [{ price, q }];
//             } else {
//               x.push({ price, q });
//             }
//             return p;
//           }, {});
//         const remGoods: IMGoodData<IMGoodRemain> = {};

//         for (const good of goods) {
//           remGoods[good.id] = {
//             good,
//             remains: remainsByGoodId[good.id],
//           };
//         }

//         remModelData[c.id] = { contactName: c.name || `${c.id}`, goods: remGoods };
//       } else {
//         const remGoods: IMGoodData<IMGoodRemain> = {};

//         for (const good of goods) {
//           remGoods[good.id] = { good };
//         }

//         remModelData[c.id] = { contactName: c.name || `${c.id}`, goods: remGoods };
//       }
//     }
//   }

//   log('getRemainsModel', 'Окончание построения модели');
//   return { name: 'Модель остатков', type: ModelTypes.REMAINS, data: remModelData };
// };

export const getRemGoodListByContact = (contacts: IContact[], goods: IGood[], remains: IRemains[], contactId: number) => {
  log('getRemGoodListByContact', `Начало построения массива товаров по подразделению ${contactId}`);

  const remGoods: IRemGood[] = [];
  const c = contacts.find((con) => con.id === contactId);
  if (c && goods.length) {
    log('getRemGoodListByContact', `подразделение: ${c.name}`);

    //Формируем объект остатков тмц
    const remainsByGoodId = remains
      ?.find((r: IRemains) => r.contactId === contactId)
      ?.data.reduce((p: IMGoodData<IModelRem[]>, { goodId, price = 0, q = 0 }: IRemainsData) => {
        const x = p[goodId];
        if (!x) {
          p[goodId] = [{ price, q }];
        } else {
          x.push({ price, q });
        }
        return p;
      }, {});

    //Формируем массив товаров, добавив свойство цены и остатка
    goods.reduce((remGoods: IRemGood[], good: IGood) => {
      if (remainsByGoodId && remainsByGoodId[good.id]) {
        for (const r of remainsByGoodId[good.id]) {
          remGoods.push({
            good,
            price: r.price,
            remains: r.q,
          });
        };
      } else {
        remGoods.push({
          good,
          price: 0,
          remains: 0,
        });
      };
      return remGoods;
    }, remGoods);
  }

  log('getRemGoodListByContact', `Окончание построения массива товаров по подразделению ${contactId}`);
  return remGoods;
};

export const getRemGoodByContact = (contacts: IContact[], goods: IGood[], remains: IRemains[], contactId: number) => {
  log('getRemGoodByContact', `Начало построения модели товаров по баркоду по подразделению ${contactId}`);

  const remGoods: IMGoodData<IMGoodRemain> = {};
  const contact = contacts.find((con) => con.id === contactId);

  if (contact && goods.length) {
    log('getRemGoodByContact', `подразделение: ${contact.name}`);

    if (remains.length) {
      //Формируем объект остатков тмц
      const remainsByGoodId = remains
        .find((r: IRemains) => r.contactId === contact.id)
        ?.data.reduce((p: any, { goodId, price, q }: IRemainsData) => {
          const x = p[goodId];
          if (!x) {
            p[goodId] = [{ price, q }];
          } else {
            x.push({ price, q });
          }
          return p;
        }, {});

      //Заполняем объект товаров по штрихкоду, если есть шк
      for (const good of goods) {
        if (good.barcode) {
          remGoods[good.barcode] = {
            good,
            remains: remainsByGoodId[good.id],
          };
        }
      }
    } else {
      //Если по товару нет остатков, добавляем объект товара без remains
      for (const good of goods) {
        if (good.barcode) {
          remGoods[good.id] = { good };
        }
      }
    }
  }

  log('getRemGoodByContact', `Окончание построения модели товаров по баркоду по подразделению ${contactId}`);
  return remGoods;
};

