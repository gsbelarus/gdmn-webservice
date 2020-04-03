import { ParameterizedContext } from 'koa';
import { IDevice } from '../models/models';
import { readFile } from '../utils/workWithFile';
import { PATH_LOCAL_DB_DEVICES } from '../server';

import log4js from 'log4js';
import { IResponse } from '../models/requests';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const isExistDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { uid } = ctx.query;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const idx = allDevices && allDevices.findIndex(device => device.uid === uid);
  let result: IResponse<boolean>;

  if (!allDevices || idx === undefined || idx < 0) {
    result = { status: 200, result: false };
    logger.warn(`the device(${uid}) is not exist`);
  } else {
    result = { status: 200, result: true };
    logger.info(`the device(${uid}) is exist`);
  }
  ctx.body = JSON.stringify(result);
};

export { isExistDevice };
