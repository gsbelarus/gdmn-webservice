import { Database } from './json-db';
import { IUser } from '../../../common';

const db = new Database('mob-app');

const users = db.collection<IUser>('user');
const codes = db.collection<IUser>('activation-codes');
const companies = db.collection<IUser>('companies');
const messages = db.collection<IUser>('messages');
const devices = db.collection<IUser>('devices');

export { users, codes, companies, messages, devices };
