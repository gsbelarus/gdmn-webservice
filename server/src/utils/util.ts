import { readFile, writeFile } from './workWithFile';
import { PATH_LOCAL_DB_ACTIVATION_CODES, PATH_LOCAL_DB_USERS } from '../server';
import { VerifyFunction } from 'passport-local';
import { IActivationCode, IUser } from '../../../common';

const findById = async (id: string) => {
  const data: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  return data?.find(user => user.id === id);
};

const findByUserName = async (userName: string) => {
  const data: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  return data ? data.find(user => user.userName === userName) : undefined;
};

const saveActivationCode = async (userId: string) => {
  // const code = Math.random()
  //   .toString(36)
  //   .substr(3, 6);
  const code = `${Math.floor(1000 + Math.random() * 9000)}`;
  const allCodes: IActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODES);
  await writeFile(
    PATH_LOCAL_DB_ACTIVATION_CODES,
    JSON.stringify(
      allCodes
        ? [...allCodes, { code, date: new Date().toString(), user: userId }]
        : [{ code, date: Date().toString(), user: userId }],
    ),
  );
  return code;
};

// /* Непонятно что делает функция */
// const editCompanies = async (userId: string, companies: string[]) => {
//   const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
//   const user = allUsers?.filter(item => item.id === userId)[0];

//   if (!(user && allUsers)) return;

//   const idx = allUsers.findIndex(item => item.userName === user.userName);

//   if (!allUsers || idx === undefined || idx < 0) return 1;

//   await writeFile(
//     PATH_LOCAL_DB_USERS,
//     JSON.stringify([
//       ...allUsers.slice(0, idx),
//       { ...user, companies: user && user.companies ? [...user?.companies, ...companies] : companies },
//       ...allUsers.slice(idx + 1),
//     ]),
//   );
//   return 1;
// };

const validateAuthCreds: VerifyFunction = async (userName: string, password: string, done) => {
  const user = await findByUserName(userName);

  // TODO: use password hash
  if (!user || user.password !== password) {
    done(null, false);
  } else {
    done(null, user);
  }
};

export { validateAuthCreds, saveActivationCode, findById, findByUserName };
