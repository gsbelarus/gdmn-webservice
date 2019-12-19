import { ActivationCode } from '../models';
import { readFile, writeFile } from '../workWithFile';
import { PATH_LOCAL_DB_ACTIVATION_CODE } from '../rest';

export const saveActivationCode = async (idUser: string) => {
  const code = Math.random().toString(36).substr(3, 6);
  const allCodes: ActivationCode[] | undefined = await readFile(PATH_LOCAL_DB_ACTIVATION_CODE);
  await writeFile(
    PATH_LOCAL_DB_ACTIVATION_CODE,
    JSON.stringify(allCodes
      ? [...allCodes, {code, date: (new Date()).toString(), user: idUser}]
      : [{code, date: Date().toString(), user: idUser}]
    )
  );
  return code;
}
