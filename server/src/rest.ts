import Koa from 'koa';
import koaCors from '@koa/cors';
import router from './roters';
import session from 'koa-session';
import passport from 'koa-passport';
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import { User } from './models';
import { readFileAsSync } from './workWithFile';
import bodyParser from 'koa-bodyparser';

const PATH_LOCAL_DB = 'C:\\Users\\elena.buraya\\Desktop\\DB_USERS.json'

export async function init() {
  const app = new Koa();
  app.keys = ['super-secret-key'];
  app.use(session({}, app));
  app.use(bodyParser());
  passport.serializeUser((user: User, done) => done(null, user.id));
	passport.deserializeUser(async (id: number, done) => done(null, await findById(id) || undefined));
	passport.use(new LocalStrategy({ usernameField: 'email' }, validateAuthCreds));
	app.use(passport.initialize());
	app.use(passport.session());
  app.use(koaCors({
		credentials: true
	}));
  
  app.use(router.routes());

  const port = 3649;

  await new Promise((resolve) => app.listen(port, () => resolve()));
	console.log(`Rest started on http://localhost:${port}`);
}

const validateAuthCreds: VerifyFunction = async (email: string, password: string, done) => {
	const user = await findByEmail(email);
	// TODO: use password hash
  if (!user || user.password !== password) {
    done(null, false);
  }
	else {
    done(null, user);
  }
};

export const findById = async (id: number) => {
  const data: User[] = JSON.parse(await readFileAsSync(PATH_LOCAL_DB));
  return data.find(user => user.id === id);
}

export const findByEmail = async (email: string) => {
  const data: User[] = JSON.parse(await readFileAsSync(PATH_LOCAL_DB));
  return data.find(user => user.userName === email);
}
