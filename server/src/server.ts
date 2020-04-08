import Koa from 'koa';
import fs from 'fs';
import path from 'path';
import koaCors from '@koa/cors';
import router from './routes';
import session from 'koa-session';
import passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { IUser } from './models/models';
import bodyParser from 'koa-bodyparser';
import morganlogger from 'koa-morgan';

import log4js from 'log4js';
import { findById, validateAuthCreds } from './utils/util';
import dev from '../config/dev';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

export const PATH_LOCAL_DB_USERS = `${dev.FILES_PATH}\\DB_USERS.json`;
export const PATH_LOCAL_DB_ACTIVATION_CODES = `${dev.FILES_PATH}\\DB_ACTIVATION_CODES.json`;
export const PATH_LOCAL_DB_COMPANIES = `${dev.FILES_PATH}\\DB_COMPANIES.json`;
export const PATH_LOCAL_DB_DEVICES = `${dev.FILES_PATH}\\DB_DEVICES.json`;
export const PATH_LOCAL_DB_MESSAGES = `${dev.FILES_PATH}\\DB_MESSAGES\\`;

export async function init(): Promise<void> {
  const app = new Koa();
  app.keys = ['super-secret-key'];

  const CONFIG = {
    key: 'koa:sess' /** (string) cookie key (default is koa:sess) */,
    maxAge: 28800000 /** (number) maxAge in ms (default is 1 days) */,
    overwrite: true /** (boolean) can overwrite or not (default true) */,
    httpOnly: true /** (boolean) httpOnly or not (default true) */,
    signed: true /** (boolean) signed or not (default true) */,
  };

  passport.serializeUser((user: IUser, done) => done(null, user.id));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(new LocalStrategy({ usernameField: 'userName' }, validateAuthCreds));

  // Логи для Morgan
  const logPath = path.join(process.cwd(), '/logs/');
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
  }
  const accessLogStream: fs.WriteStream = fs.createWriteStream(path.join(logPath, 'access.log'), { flags: 'a' });

  app
    .use(morganlogger('combined', { stream: accessLogStream }))
    .use(session(CONFIG, app))
    .use(bodyParser())
    .use(passport.initialize())
    .use(passport.session())
    .use(koaCors({ credentials: true }))
    .use(router.routes())
    .use(router.allowedMethods());

  logger.trace('Starting listener ...');
  await new Promise(resolve => app.listen(dev.PORT, () => resolve()));
  logger.trace('Started');
  console.info(`🚀 Server is running on on http://localhost:${dev.PORT}`);
}
