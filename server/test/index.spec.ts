/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Koa from 'koa';
import request from 'supertest';
import run from '../src/index';
import { writeFile } from '../src/utils/workWithFile';
import {
  PATH_LOCAL_DB_ACTIVATION_CODES,
  PATH_LOCAL_DB_USERS,
  PATH_LOCAL_DB_COMPANIES,
  PATH_LOCAL_DB_DEVICES,
} from '../src/server';
import { IActivationCode } from '../../common';

let app: Koa<Koa.DefaultState, Koa.DefaultContext>;
const today = new Date();

const users = [
  { id: 'admin', userName: 'admin', password: 'admin', creatorId: 'admin', companies: ['com'] },
  { id: '1', userName: '1', password: '1', creatorId: 'admin', companies: ['com'] },
];
const devices = [
  { uid: '123', user: 'admin', isBlock: false },
  { uid: '123', user: '1', isBlock: false },
  { uid: 'qwe', user: 'admin', isBlock: true },
];
const companies = [{ id: 'com', title: 'com', admin: 'admin' }];
const activationCodes: IActivationCode[] = [
  { code: '123qwe', user: 'admin', date: new Date(today.setDate(today.getDate() - 1)).toLocaleDateString() },
  { code: 'asd456', user: 'admin', date: new Date(today.setDate(today.getDate() - 10)).toLocaleDateString() },
];

beforeAll(async done => {
  app = await run();
  await writeFile(PATH_LOCAL_DB_USERS, JSON.stringify(users));
  await writeFile(PATH_LOCAL_DB_DEVICES, JSON.stringify(devices));
  await writeFile(PATH_LOCAL_DB_COMPANIES, JSON.stringify(companies));
  await writeFile(PATH_LOCAL_DB_ACTIVATION_CODES, JSON.stringify(activationCodes));
  done();
});

describe('POST /api/auth/login?deviceId', () => {
  test('ERROR: not device or user', async () => {
    const response = await request(app.callback()).post('/api/auth/login').query('deviceId=1234').send({
      userName: 'admin',
      password: 'admin',
    });
    expect(response.status).toEqual(404);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('not device or user');
  });

  test('ERROR: not device or user', async () => {
    const response = await request(app.callback()).post('/api/auth/login').query('deviceId=123').send({
      userName: 'admin1',
      password: 'admin',
    });
    expect(response.status).toEqual(404);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('not device or user');
  });

  test('ERROR: does not have access', async () => {
    const response = await request(app.callback()).post('/api/auth/login').query('deviceId=456').send({
      userName: '1',
      password: '1',
    });
    expect(response.status).toEqual(401);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('does not have access');
  });

  test('ERROR: не верный пользователь и\\или пароль', async () => {
    const response = await request(app.callback()).post('/api/auth/login').query('deviceId=123').send({
      userName: 'admin',
      password: '1',
    });
    expect(response.status).toEqual(404);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('не верный пользователь и\\или пароль');
  });

  test('SUCCESS: first login', async () => {
    const response = await request(app.callback()).post('/api/auth/login').query('deviceId=123').send({
      userName: 'admin',
      password: 'admin',
    });
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body).toBeDefined();
    expect(response.body.result).toBeTruthy();
  });

  test('SUCCESS: second login', async () => {
    const reqLogin = await request(app.callback()).post('/api/auth/login').query('deviceId=123').send({
      userName: 'admin',
      password: 'admin',
    });
    const setCookies = reqLogin.header['set-cookie'];

    const response = await request(app.callback())
      .post('/api/auth/login')
      .query('deviceId=123')
      .set('Cookie', setCookies)
      .send({
        userName: '1',
        password: '1',
      });
    expect(response.status).toEqual(200);
    expect(response.body.result).toBeTruthy();
  });
});

describe('Check working middleware: auth', () => {
  test('SUCCESS: authenticated', async () => {
    const resLogin = await request(app.callback()).post('/api/auth/login').query('deviceId=123').send({
      userName: 'admin',
      password: 'admin',
    });

    const response = await request(app.callback())
      .get('/api/users/')
      .query('deviceId=123')
      .set('Cookie', resLogin.header['set-cookie']);
    expect(response.status).toEqual(200);
  });

  test('ERROR: not authenticated', async () => {
    const response = await request(app.callback()).get('/api/users/').query('deviceId=123');
    expect(response.status).toEqual(401);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('not authenticated');
  });
});

describe('Check working middleware: device', () => {
  let resLogin: request.Response;

  test('SUCCESS: authenticated', async () => {
    resLogin = await request(app.callback()).post('/api/auth/login').query('deviceId=123').send({
      userName: '1',
      password: '1',
    });

    const response = await request(app.callback())
      .get('/api/users/')
      .query('deviceId=123')
      .set('Cookie', resLogin.header['set-cookie']);
    expect(response.status).toEqual(200);
  });

  test('ERROR: not such all parameters', async () => {
    const response = await request(app.callback()).get('/api/users/').set('Cookie', resLogin.header['set-cookie']);
    expect(response.status).toEqual(422);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('not such all parameters');
  });

  test('ERROR: not such device', async () => {
    const response = await request(app.callback())
      .get('/api/users/')
      .query('deviceId=123qwe')
      .set('Cookie', resLogin.header['set-cookie']);
    expect(response.status).toEqual(404);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('not such device');
  });

  test('ERROR: does not have access', async () => {
    //тест не доделан
    //нужно блокировать устройство после входа
    const response = await request(app.callback())
      .get('/api/users/')
      .query('deviceId=123')
      .set('Cookie', resLogin.header['set-cookie']);
    expect(response.status).toEqual(401);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('does not have access');
  });
});

describe('GET /api/auth/logout?deviceId', () => {
  test('SUCCESS: authenticated', async () => {
    const resLogin = await request(app.callback()).post('/api/auth/login').query('deviceId=123').send({
      userName: 'admin',
      password: 'admin',
    });

    const response = await request(app.callback())
      .get('/api/auth/logout')
      .query('deviceId=123')
      .set('Cookie', resLogin.header['set-cookie']);
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeTruthy();
  });
});

describe('GET /api/auth/user?deviceId', () => {
  const userName = 'admin';
  const password = 'admin';
  let response: request.Response;

  beforeAll(async () => {
    const resLogin = await request(app.callback()).post('/api/auth/login').query('deviceId=123').send({
      userName,
      password,
    });

    response = await request(app.callback())
      .get('/api/auth/user')
      .query('deviceId=123')
      .set('Cookie', resLogin.header['set-cookie']);
  });

  test('SUCCESS', () => {
    expect(response.status).toEqual(200);
  });

  test('correct format', async () => {
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeTruthy();
    expect(response.body.data).toBeDefined();
  });

  test('not fields (password)', async () => {
    expect(Object.keys(response.body.data)).not.toContain('password');
  });

  test('correct data', async () => {
    expect(Object.keys(response.body.data)).toEqual(expect.arrayContaining(['id', 'userName', 'creatorId']));
    expect(typeof response.body.data['id']).toBe('string');
    expect(typeof response.body.data['userName']).toBe('string');
    expect(typeof response.body.data['creatorId']).toBe('string');
  });

  test('correct optional fields', async () => {
    let count = 0;
    const keys = Object.keys(response.body.data);
    if (keys.some(key => key === 'companies' && response.body.data['companies'])) {
      expect(Array.isArray(response.body.data['companies'])).toBe(true);
      if (response.body.data['companies'][0]) {
        expect(typeof response.body.data['companies'][0]).toBe('string');
      }
      count++;
    }
    if (keys.some(key => key === 'firstName' && response.body.data['firstName'])) {
      expect(typeof response.body.data['firstName']).toBe('string');
      count++;
    }
    if (keys.some(key => key === 'lastName' && response.body.data['lastName'])) {
      expect(typeof response.body.data['lastName']).toBe('string');
      count++;
    }
    if (keys.some(key => key === 'phoneNumber' && response.body.data['phoneNumber'])) {
      expect(typeof response.body.data['phoneNumber']).toBe('string');
      count++;
    }
    expect(keys.length).toBeLessThanOrEqual(count + 3);
  });
});

describe('POST /api/auth/signup', () => {
  test('SUCCESS: authenticated user create new user', async () => {
    const loginUserName = 'admin';
    const resLogin = await request(app.callback()).post('/api/auth/login').query('deviceId=123').send({
      userName: loginUserName,
      password: 'admin',
    });

    const userName = '2';

    const response = await request(app.callback())
      .post('/api/auth/signup')
      .query('deviceId=123')
      .set('Cookie', resLogin.header['set-cookie'])
      .send({
        userName,
        password: '2',
      });
    const keys = Object.keys(response.body.data);
    expect(response.status).toEqual(201);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeTruthy();
    expect(keys).toEqual(expect.arrayContaining(['id', 'userName', 'creatorId']));
    expect(typeof response.body.data['id']).toBe('string');
    expect(typeof response.body.data['userName']).toBe('string');
    expect(Array.isArray(response.body.data['companies'])).toBe(true);
    if (response.body.data['companies'][0]) {
      expect(typeof response.body.data['companies'][0]).toBe('string');
    }
    expect(typeof response.body.data['creatorId']).toBe('string');
    expect(keys).not.toContain('password');
    expect(response.body.data.userName).toEqual(userName);
    expect(response.body.data.creatorId).toEqual(loginUserName);
  });

  test('SUCCESS: signup', async () => {
    const userName = '3';
    const response = await request(app.callback()).post('/api/auth/signup').send({
      userName,
      password: '3',
    });
    const keys = Object.keys(response.body.data);
    expect(response.status).toEqual(201);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeTruthy();
    expect(keys).toEqual(expect.arrayContaining(['id', 'userName', 'creatorId']));
    expect(typeof response.body.data['id']).toBe('string');
    expect(typeof response.body.data['userName']).toBe('string');
    expect(Array.isArray(response.body.data['companies'])).toBe(true);
    if (response.body.data['companies'][0]) {
      expect(typeof response.body.data['companies'][0]).toBe('string');
    }
    expect(typeof response.body.data['creatorId']).toBe('string');
    expect(keys).not.toContain('password');
    expect(response.body.data.userName).toEqual(userName);
    expect(response.body.data.creatorId).toEqual(userName);
  });

  test('ERROR: a user already exists', async () => {
    const response = await request(app.callback()).post('/api/auth/signup').send({
      userName: 'admin',
      password: 'admin',
    });
    expect(response.status).toEqual(400);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('a user already exists');
  });
});

describe('GET /api/auth/user/:userId/device/code', () => {
  test('SUCCESS: create actiovation code', async () => {
    const response = await request(app.callback()).get('/api/auth/user/admin/device/code');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeTruthy();
    expect(typeof response.body.data).toBe('string');
    expect(response.body.data.length).toBe(4);
  });
});

describe('POST /api/auth/device/code', () => {
  test('SUCCESS: device has been successfully activated', async () => {
    const response = await request(app.callback()).post('/api/auth/device/code').send({ code: '123qwe' });
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeTruthy();
    expect(response.body.data).toBe('admin');
  });

  test('ERROR: not found activation code', async () => {
    const response = await request(app.callback()).post('/api/auth/device/code').send({ code: '124qwa' });
    expect(response.status).toEqual(404);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('invalid activation code');
  });

  test('ERROR: activation code expired', async () => {
    const response = await request(app.callback()).post('/api/auth/device/code').send({ code: 'asd456' });
    expect(response.status).toEqual(404);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('invalid activation code');
  });
});
