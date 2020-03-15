import config from "../config";

export const baseUrl = `${config.server.protocol}${config.server.name}:${config.server.port}/${config.apiPath}`;

export const timeout = (signal: Promise<any>, ms: number, promise: Promise<any>) => {
  return new Promise((resolve, reject) => {
    const tmOut = setTimeout(() => reject(new Error("время вышло")), ms);

    promise.then(resolve, reject);

    signal.catch(err => {
      clearTimeout(tmOut);
      reject(err)
    });
  });
};

interface CancellablePromise extends Promise<any> {
  signal: Promise<any>,
  cancel: () => void
}

export function createCancellableSignal() {
  const p: Partial<CancellablePromise> = {};
  p.signal = new Promise<any>((resolve, reject) => p.cancel = () => reject(new Error('прервано пользователем')))

  return p;
}
