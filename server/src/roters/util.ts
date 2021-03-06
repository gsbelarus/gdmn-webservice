import { IActivationCode, IUser } from '../models';
import { readFile, writeFile } from '../workWithFile';
import { PATH_LOCAL_DB_ACTIVATION_CODES, PATH_LOCAL_DB_USERS } from '../rest';

export const findById = async (id: string) => {
  const data: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  return data ? data.find(user => user.id === id) : undefined;
}

export const findByUserName = async (userName: string) => {
  const data: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  return data ? data.find(user => user.userName === userName) : undefined;
}

export const saveActivationCode = async (userId: string) => {
  const code = Math.random().toString(36).substr(3, 6);
  const allCodes: IActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODES);
  await writeFile(
    PATH_LOCAL_DB_ACTIVATION_CODES,
    JSON.stringify(allCodes
      ? [...allCodes, {code, date: (new Date()).toString(), user: userId}]
      : [{code, date: Date().toString(), user: userId}]
    )
  );
  return code;
}

export const editeCompanies = async(userId: string, companies: string[]) => {
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    const user = allUsers?.find(item => item.id === userId);
    const idx = user && allUsers && allUsers.findIndex( item => item.userName === user.userName );
    if(!allUsers || idx === undefined || idx < 0) {
      return 1;
    } else {
      await writeFile(
        PATH_LOCAL_DB_USERS,
        JSON.stringify([...allUsers.slice(0, idx), {...user, companies: user && user.companies ? [...user?.companies, ...companies] : companies}, ...allUsers.slice(idx + 1)])
      );
      return 0;
    }
}
