import { ParameterizedContext, Next } from 'koa';
import { IUser, IResponse } from '../../../common';
import log from '../utils/logger';
import koaPassport from 'koa-passport';
import { devices } from './dao/db';
import { VerifyFunction } from 'passport-local';
import { userService } from '.';

const authenticate = async (ctx: ParameterizedContext, next: Next): Promise<IUser | undefined> => {
  // return users && users.find(user => user.id === userId);
  const { deviceId } = ctx.query;
  const { userName } = ctx.request.body;

  const device = await devices.find(
    device => (device.uid === deviceId || deviceId === 'WEB') && device.user === userName,
  );

  if (!device) {
    log.info(`device (${deviceId}) not found`);
    const res: IResponse = { result: false, error: `устройство с идентификатором ${deviceId} не найдено` };
    ctx.throw(404, JSON.stringify(res));
  }

  if (device.blocked) {
    log.info(`device (${deviceId}) is blocked`);
    const res: IResponse = { result: false, error: `устройство с идентификатором ${deviceId} заблокировано` };
    ctx.status = 404;
    ctx.throw(404, JSON.stringify(res));
  }

  const user = await koaPassport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (user) {
      ctx.login(user);
    }
  })(ctx, next);
};

const validateAuthCreds: VerifyFunction = async (userName: string, password: string, done) => {
  const user = await userService.findByUserName(userName);

  // TODO: use password hash
  if (!user || user.password !== password) {
    done(null, false);
  } else {
    done(null, user);
  }
};

export { authenticate, validateAuthCreds };
