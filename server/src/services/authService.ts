import { Next, Context } from 'koa';
import { IUser } from '../../../common';
import koaPassport from 'koa-passport';
import { v1 as uuidv1 } from 'uuid';
import { devices, users, codes } from './dao/db';
import { VerifyFunction } from 'passport-local';
import { userService } from '.';
import log from '../utils/logger';

const authenticate = async (ctx: Context, next: Next): Promise<IUser | undefined> => {
  const { deviceId } = ctx.query;
  const { userName } = ctx.request.body;

  const device = await devices.find(
    device => (device.uid === deviceId || deviceId === 'WEB') && device.user === userName,
  );

  if (!device) {
    throw new Error(`устройство с идентификатором '${deviceId}' у пользователя ${userName} не найдено`);
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

const signUp = async ({ user, deviceId }: { user: IUser; deviceId?: string }) => {
  // Если в базе нет пользователей
  // добавляем пользователя gdmn
  if (!(await users.read()).length) {
    await users.insert({
      userName: 'gdmn',
      creatorId: user.userName,
      password: 'gdmn',
      companies: [],
    });
  }

  if (deviceId === 'WEB') {
    await devices.insert({ name: 'WEB', uid: 'WEB' });
    await devices.insert({ name: 'WEB', uid: 'WEB' });
  }

  return await userService.addOne(user);
};

const validateAuthCreds: VerifyFunction = async (userName: string, password: string, done) => {
  const user = await userService.findByName(userName);

  // TODO: use password hash
  if (!user || user.password !== password) {
    done(null, false);
  } else {
    done(null, user);
  }
};

const verifyCode = async (code: string) => {
  const rec = await codes.find(i => i.code === code);

  if (!rec) {
    throw new Error('код не найден');
  }

  const date = new Date(rec.date);

  date.setDate(date.getDate() + 7);

  if (date >= new Date()) {
    await codes.delete(i => i.code === code);
    throw new Error('срок действия кода истёк');
  }

  // Создаём новое устройство
  const deviceId = uuidv1();
  const newDeviceId = await devices.insert({ user: rec.user, uid: deviceId, blocked: false });

  await codes.delete(i => i.code === code);

  return newDeviceId;
};

export { authenticate, validateAuthCreds, signUp, verifyCode };
