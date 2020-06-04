import Koa from 'koa';

import { IActivationCode } from '../../common';

import run from '../src';
import { writeFile } from '../src/utils/workWithFile';

import {
  PATH_LOCAL_DB_USERS,
  PATH_LOCAL_DB_DEVICES,
  PATH_LOCAL_DB_COMPANIES,
  PATH_LOCAL_DB_ACTIVATION_CODES,
} from '../src/server';

let app: Koa<Koa.DefaultState, Koa.DefaultContext> | null = null;

export async function initEnvironment(): Promise<void> {
  app = await run();
  const today = new Date();

  const users = [
    { id: 'admin', userName: 'admin', password: 'admin', firstName: 'admin', creatorId: 'admin', companies: ['com'] },
    {
      id: '1',
      userName: '1',
      password: '1',
      firstName: '1',
      lastName: '1',
      phoneNumber: '1',
      creatorId: 'admin',
      companies: ['com'],
    },
    { id: '2', userName: '2', password: '2', creatorId: 'admin', companies: ['com'] },
  ];
  const devices = [
    { uid: '123', user: 'admin', isBlock: false },
    { uid: '123', user: '1', isBlock: false },
    { uid: 'asd', user: '1', isBlock: false },
    { uid: 'qwe', user: 'admin', isBlock: true },
  ];
  const companies = [{ id: 'com', title: 'com', admin: 'admin' }];
  const activationCodes: IActivationCode[] = [
    { code: '123qwe', user: 'admin', date: new Date(today.setDate(today.getDate() - 1)).toLocaleDateString() },
    { code: 'asd456', user: 'admin', date: new Date(today.setDate(today.getDate() - 10)).toLocaleDateString() },
  ];

  await writeFile(PATH_LOCAL_DB_USERS, JSON.stringify(users));
  await writeFile(PATH_LOCAL_DB_DEVICES, JSON.stringify(devices));
  await writeFile(PATH_LOCAL_DB_COMPANIES, JSON.stringify(companies));
  await writeFile(PATH_LOCAL_DB_ACTIVATION_CODES, JSON.stringify(activationCodes));
}

export function getApp(): Koa<Koa.DefaultState, Koa.DefaultContext> {
  if (!app) {
    throw new Error('Environment is not initialized');
  }
  return app;
}
