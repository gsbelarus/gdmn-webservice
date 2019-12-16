import { readFile } from 'fs';

export const readFileAsSync = (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    readFile(filename, "utf8", function(err, data) {
      if (err) throw err;
      resolve(data);
    });
  });
}


