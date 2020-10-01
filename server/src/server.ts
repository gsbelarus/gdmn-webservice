import Koa from 'koa';
import fs from 'fs';
import path from 'path';
import koaCors from '@koa/cors';
import router from './routes';
import session from 'koa-session';
import passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bodyParser from 'koa-bodyparser';
import morganlogger from 'koa-morgan';
import log from './utils/logger';

import { validateAuthCreds } from './services/authService';
import config from '../config';
import { IUser } from '../../common';
import { errorHandler } from './middleware/errorHandler';
import { userService } from './services';

/* export const PATH_LOCAL_DB_USERS = `${config.FILES_PATH}\\DB_USERS.json`;
export const PATH_LOCAL_DB_ACTIVATION_CODES = `${config.FILES_PATH}\\DB_ACTIVATION_CODES.json`;
export const PATH_LOCAL_DB_COMPANIES = `${config.FILES_PATH}\\DB_COMPANIES.json`;
export const PATH_LOCAL_DB_DEVICES = `${config.FILES_PATH}\\DB_DEVICES.json`;
export const PATH_LOCAL_DB_MESSAGES = `${config.FILES_PATH}\\DB_MESSAGES\\`; */

export async function init(): Promise<Koa<Koa.DefaultState, Koa.DefaultContext>> {
  const app = new Koa();
  app.keys = ['super-secret-key'];

  const CONFIG = {
    key: 'koa:sess' /** (string) cookie key (default is koa:sess) */,
    maxAge: 28800000 /** (number) maxAge in ms (default is 1 days) */,
    overwrite: true /** (boolean) can overwrite or not (default true) */,
    httpOnly: true /** (boolean) httpOnly or not (default true) */,
    signed: true /** (boolean) signed or not (default true) */,
    sameSite: true /** (string) lets require that a cookie shouldn't
      be sent with cross-origin requests (default undefined) */,
  };

  passport.serializeUser((user: IUser, done) => done(null, user.id));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await userService.findOne(id);
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
    .use(
      bodyParser({
        formLimit: '10mb',
        jsonLimit: '10mb',
        textLimit: '10mb',
        enableTypes: ['json', 'form', 'text'],
      }),
    )
    .use(errorHandler)
    .use(passport.initialize())
    .use(passport.session())
    .use(koaCors({ credentials: true }))
    .use(router.routes())
    .use(router.allowedMethods());

  app.on('error', err => {
    log.error(err);
  });

  app.on('user-error', err => {
    log.warn(err);
  });

  log.info('Starting listener ...');
  await new Promise(resolve => app.listen(config.PORT, () => resolve()));
  log.info(`Server is running on http://localhost:${config.PORT}`);
  return app;
}
