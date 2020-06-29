import { Next, Context } from 'koa';
import { IUser, IResponse } from '../../../common';
import log from '../utils/logger';
import koaPassport from 'koa-passport';
import { devices } from './dao/db';
import { VerifyFunction } from 'passport-local';
import { userService } from '.';

const authenticate = async (ctx: Context, next: Next): Promise<IUser | undefined> => {
  const { deviceId } = ctx.query;
  const { userName } = ctx.request.body;

  const device = await devices.find(
    device => (device.uid === deviceId || deviceId === 'WEB') && device.user === userName,
  );

  if (!device) {
    throw new Error(`устройство с идентификатором '${deviceId}' не найдено`);
  }

  if (device.blocked) {
    throw new Error(`устройство с идентификатором '${deviceId}' заблокировано`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return koaPassport.authenticate('local', async (err: Error, user: IUser) => {
    if (err) {
      throw new Error(err.message);
    }

    if (!user) {
      throw new Error('неверный пользователь или пароль');
    }
    await ctx.login(user);
    return user;
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
