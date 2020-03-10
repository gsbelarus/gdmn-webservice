import config from "../config";

export const baseUrl = `${config.server.protocol}${config.server.name}:${config.server.port}/${config.apiPath}`;

export const timeout = (ms: number, promise: Promise<any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(resolve, reject);
  });
};
