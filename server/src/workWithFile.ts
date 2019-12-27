import { promises } from 'fs';
import log4js from 'log4js';
import path from "path";

const logger = log4js.getLogger();
logger.level = 'trace';

export const readFile = async (filename: string) => {
  try {
    const result = await promises.readFile(filename, { encoding: 'utf8', flag: 'r' });
    const data = JSON.parse(result);
    logger.info(`Successful reading: ${filename}`);
    if(Array.isArray(data) && data.length) {
      return data;
    } else {
      return data;
    }
  }
  catch (e) {
    logger.trace(`Error reading data to file ${filename} - ${e}`);
    console.log(`Error reading data to file ${filename} - ${e}`);
    return undefined;
  }
}

export const writeFile = async (filename: string, data: string) => {
  try {
    await promises.mkdir(path.dirname(filename), { recursive: true });
    await promises.writeFile(filename, data, { encoding: 'utf8', flag: 'w' });
    logger.info(`Successful writing: ${filename}`);
  }
  catch (e) {
    logger.trace(`Error writing data to file ${filename} - ${e}`);
    console.log(`Error writing data to file ${filename} - ${e}`);
  }
}

export const removeFile = async (filename: string) => {
  try {
    console.log('2');
    await promises.unlink(filename);
    console.log('3');
    logger.info('Successful remove file');
    return 'OK';
  }
  catch (e) {
    logger.trace(`Error removing to file ${filename} - ${e}`);
    console.log(`Error removing to file ${filename} - ${e}`);
    return 'ERROR';
  }
}
