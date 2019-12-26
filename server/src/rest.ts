import Koa from 'koa';
import koaCors from '@koa/cors';
import router from './roters';
import session from 'koa-session';
import passport from 'koa-passport';
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import { IUser } from './models';
import bodyParser from 'koa-bodyparser';
import log4js from 'log4js';
import { findByUserName, findById } from './roters/util';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

export const PATH_LOCAL_DB_USERS = 'C:\\DB\\DB_USERS.json'
export const PATH_LOCAL_DB_ACTIVATION_CODES = 'C:\\DB\\DB_ACTIVATION_CODES.json'
export const PATH_LOCAL_DB_ORGANISATIONS = 'C:\\DB\\DB_ORGANISATIONS.json'
export const PATH_LOCAL_DB_DEVICES = 'C:\\DB\\DB_DEVICES.json'

export async function init() {
  const app = new Koa();
  app.keys = ['super-secret-key'];

  const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
  };

  app.use(session(CONFIG, app));
  app.use(bodyParser());
  passport.serializeUser((user: IUser, done) => done(null, user.id));
	passport.deserializeUser(async (id: string, done) => done(null, await findById(id) || undefined));
	passport.use(new LocalStrategy({ usernameField: 'userName' }, validateAuthCreds));
	app.use(passport.initialize());
	app.use(passport.session());
  app.use(koaCors({
		credentials: true
	}));
  
  app.use(router.routes());
  app.use(router.allowedMethods());

  const port = 3649;

  logger.trace('Starting listener ...');
  await new Promise((resolve) => app.listen(port, () => resolve()));
  logger.trace('Started');
	console.log(`Rest started on http://localhost:${port}`);
}

const validateAuthCreds: VerifyFunction = async (userName: string, password: string, done) => {
	const user = await findByUserName(userName);
	// TODO: use password hash
  if (!user || user.password !== password) {
    done(null, false);
  }
	else {
    done(null, user);
  }
};
