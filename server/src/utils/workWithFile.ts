import { promises } from 'fs';
import path from 'path';
import log from '../utils/logger';

export const readFile = async (filename: string) => {
  try {
    const result = await promises.readFile(filename, { encoding: 'utf8', flag: 'r' });
    const data = JSON.parse(result);
    log.info(`Successful reading: ${filename}`);
    if (Array.isArray(data) && data.length) return data;
    return;
  } catch (e) {
    log.verbose(`Error reading data to file ${filename} - ${e}`);
    console.log(`Error reading data to file ${filename} - ${e}`);
    return undefined;
  }
};

export const writeFile = async (filename: string, data: string) => {
  try {
    await promises.mkdir(path.dirname(filename), { recursive: true });
    await promises.writeFile(filename, data, { encoding: 'utf8', flag: 'w' });
    log.info(`Successful writing: ${filename}`);
  } catch (e) {
    log.verbose(`Error writing data to file ${filename} - ${e}`);
    console.log(`Error writing data to file ${filename} - ${e}`);
  }
};

export const removeFile = async (filename: string) => {
  try {
    await promises.unlink(filename);
    log.info('Successful remove file');
    return 'OK';
  } catch (e) {
    log.verbose(`Error removing to file ${filename} - ${e}`);
    console.log(`Error removing to file ${filename} - ${e}`);
    return 'ERROR';
  }
};
