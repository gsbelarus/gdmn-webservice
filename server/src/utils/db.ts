import { IUser, IActivationCode, ICompany, IDevice, IMessage } from '../models/models';
import dev from '../../config/dev';
import { readFile } from './workWithFile';

const PATH_LOCAL_DB_USERS = `${dev.FILES_PATH}\\DB_USERS.json`;
const PATH_LOCAL_DB_ACTIVATION_CODES = `${dev.FILES_PATH}\\DB_ACTIVATION_CODES.json`;
const PATH_LOCAL_DB_COMPANIES = `${dev.FILES_PATH}\\DB_COMPANIES.json`;
const PATH_LOCAL_DB_DEVICES = `${dev.FILES_PATH}\\DB_DEVICES.json`;
const PATH_LOCAL_DB_MESSAGES = `${dev.FILES_PATH}\\DB_MESSAGES\\`;

class DB {
  users: IUser[] = [];
  activationCodes: IActivationCode[] = [];
  companies: ICompany[] = [];
  devices: IDevice[] = [];
  messages: IMessage[] = [];

  readData = async () => {
    this.users = (await readFile(PATH_LOCAL_DB_USERS)) || [];
    this.activationCodes = (await readFile(PATH_LOCAL_DB_ACTIVATION_CODES)) || [];
    this.companies = (await readFile(PATH_LOCAL_DB_COMPANIES)) || [];
    this.devices = (await readFile(PATH_LOCAL_DB_DEVICES)) || [];
    this.messages = (await readFile(PATH_LOCAL_DB_MESSAGES)) || [];
  };
}

const db = new DB();

export default db;
