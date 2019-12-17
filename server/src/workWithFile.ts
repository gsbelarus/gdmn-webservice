import { promises } from 'fs';

export const readFile = async (filename: string) => {
  const result = await promises.readFile(filename, { encoding: 'utf8', flag: 'r' });
  return JSON.parse(result);
}

export const writeFile = async (filename: string, data: string) => {
  try {
    await promises.mkdir(filename);
    await promises.writeFile(filename, data, { encoding: 'utf8', flag: 'w' });
  }
  catch (e) {
    console.log(`Error writing data to file ${filename} - ${e}`);
  }
}
