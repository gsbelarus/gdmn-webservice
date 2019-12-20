import { IActivationCode, IUser } from '../models';
import { readFile, writeFile } from '../workWithFile';
import { PATH_LOCAL_DB_ACTIVATION_CODES, PATH_LOCAL_DB_USERS } from '../rest';

export const findById = async (id: string) => {
  const data: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  return data ? data.find(user => user.id === id) : undefined;
}

export const findByEmail = async (email: string) => {
  const data: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  return data ? data.find(user => user.userName === email) : undefined;
}

export const saveActivationCode = async (idUser: string) => {
  const code = Math.random().toString(36).substr(3, 6);
  const allCodes: IActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODES);
  await writeFile(
    PATH_LOCAL_DB_ACTIVATION_CODES,
    JSON.stringify(allCodes
      ? [...allCodes, {code, date: (new Date()).toString(), user: idUser}]
      : [{code, date: Date().toString(), user: idUser}]
    )
  );
  return code;
}
