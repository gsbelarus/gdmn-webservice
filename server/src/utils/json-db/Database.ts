import fs from 'fs';
import path from 'path';
import os from 'os';
import Collection from './Collection';
import { CollectionItem } from '.';
import config from '../../../config';

class Database {
  private dbPath: string;
  /**
   *
   * @param {string} name
   */
  constructor(name: string) {
    this.dbPath = path.join(config.FILES_PATH || os.userInfo().homedir, `/.${name}/`);
    this.ensureStorage();
  }

  private ensureStorage() {
    if (!fs.existsSync(this.dbPath)) fs.mkdirSync(this.dbPath);
  }

  /**
   *
   * @param {string} name
   */
  collection<T extends CollectionItem>(name: string) {
    const collectionPath = path.join(this.dbPath, `${name}.json`);
    return new Collection<T>(collectionPath);
  }
}

export default Database;

/* import { readFile } from '../workWithFile';
import config from '../../../config';

class DB {
  private path = '';
  private db = [];

    constructor(path: string) {
    this.path = path;
    // void (async () => {
    //   this.db = ((await readFile(this.path)) || []) as T[];
    // })();
  }
  // users: IUser[] = [];
  // activationCodes: IActivationCode[] = [];
  // companies: ICompany[] = [];
  // devices: IDevice[] = [];
  // messages: IMessage[] = [];

  // readData = async () => {
  //   this.users = (await readFile(PATH_LOCAL_DB_USERS)) || [];
  //   this.activationCodes = (await readFile(PATH_LOCAL_DB_ACTIVATION_CODES)) || [];
  //   this.companies = (await readFile(PATH_LOCAL_DB_COMPANIES)) || [];
  //   this.devices = (await readFile(PATH_LOCAL_DB_DEVICES)) || [];
  //   this.messages = (await readFile(PATH_LOCAL_DB_MESSAGES)) || [];
  // };
}

const db = new DB(config.FILES_PATH);

export default db;
 */
