import Koa from 'koa';
import request from 'supertest';
import run from '../src/index';

let app: Koa<Koa.DefaultState, Koa.DefaultContext>;

beforeAll(async (done) => {
  app = await run();
  done();
})

describe('POST /api/auth/login?deviceId', () => {

  test('ERROR: not device or user', async() => {
    const response = await request(app.callback())
      .post('/api/auth/login')
      .query('deviceId=1234')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        userName: 'admin',
        password: 'admin'
      })
    expect(response.status).toEqual(404);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('not device or user');
  });

  test('ERROR: not device or user', async() => {
    const response = await request(app.callback())
      .post('/api/auth/login')
      .query('deviceId=123')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        userName: 'admin1',
        password: 'admin'
      })
    expect(response.status).toEqual(404);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('not device or user');
  });

  test('ERROR: does not have access', async() => {
    const response = await request(app.callback())
      .post('/api/auth/login')
      .query('deviceId=456')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        userName: '1',
        password: '1'
      })
    expect(response.status).toEqual(401);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('does not have access');
  });

  test('ERROR: не верный пользователь и\\или пароль', async() => {
    const response = await request(app.callback())
      .post('/api/auth/login')
      .query('deviceId=123')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        userName: 'admin',
        password: '1'
      })
    expect(response.status).toEqual(404);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('не верный пользователь и\\или пароль');
  });

  test('SUCCESS: first login', async() => {
    const response = await request(app.callback())
      .post('/api/auth/login')
      .query('deviceId=123')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        userName: 'admin',
        password: 'admin'
      })
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body).toBeDefined();
    expect(response.body.result).toBeTruthy();
  });

  test('SUCCESS: second login', async() => {
    let setCookies: string[];
    const reqLogin = await request(app.callback())
    .post('/api/auth/login')
    .query('deviceId=123')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      userName: 'admin',
      password: 'admin'
    })
    setCookies = reqLogin.header['set-cookie'];

    const response = await request(app.callback())
      .post('/api/auth/login')
      .query('deviceId=123')
      .set('Accept', 'application/json')
      .set('Cookie', setCookies)
      .send({
        userName: '1',
        password: '1'
      })
    expect(response.status).toEqual(200);
    expect(response.body.result).toBeTruthy();
  });
});

describe('GET /api/auth/logout?deviceId', () => {

  test('SUCCESS: authenticated', async() => {
    const resLogin = await request(app.callback())
    .post('/api/auth/login')
    .query('deviceId=123')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      userName: 'admin',
      password: 'admin'
    })

    const response = await request(app.callback())
      .get('/api/auth/logout')
      .query('deviceId=123')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Cookie', resLogin.header['set-cookie'])
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeTruthy();
  });

  test('ERROR: not authenticated', async() => {
    const response = await request(app.callback())
      .get('/api/auth/logout')
      .query('deviceId=123')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(response.status).toEqual(401);
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeFalsy();
    expect(response.body.error).toBe('not authenticated');
  });

});

describe('GET /api/auth/user?deviceId', () => {
  const userName = 'admin';
  const password = 'admin';
  let response: request.Response;

  beforeAll(async() => {
    const resLogin = await request(app.callback())
      .post('/api/auth/login')
      .query('deviceId=123')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        userName,
        password
      })

    response = await request(app.callback())
      .get('/api/auth/user')
      .query('deviceId=123')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Cookie', resLogin.header['set-cookie'])
  })

  test('SUCCESS', async() => {
    expect(response.status).toEqual(200);
  });

  test('correct format', async() => {
    expect(response.type).toEqual('application/json');
    expect(response.body.result).toBeTruthy();
    expect(response.body.data).toBeDefined();
  });

  test('not fields (password)', async() => {
    expect(Object.keys(response.body.data)).not.toContain('password');
  });

  test('correct data', async() => {
    expect(Object.keys(response.body.data)).toEqual(
      expect.arrayContaining(['id', 'userName', 'creatorId']));
    expect(typeof response.body.data['id']).toBe('string');
    expect(typeof response.body.data['userName']).toBe('string');
    expect(typeof response.body.data['creatorId']).toBe('string');
  });

  test('correct optional fields', async() => {
    let count = 0;
    const keys = Object.keys(response.body.data);
    if(keys.some(key => key === 'companies' && response.body.data['companies'])) {
      expect(Array.isArray(response.body.data['companies'])).toBe(true);
      expect(typeof response.body.data['companies'][0]).toBe('string');
      count++;
    }
    if(keys.some(key => key === 'firstName' && response.body.data['firstName'])) {
      expect(typeof response.body.data['firstName']).toBe('string');
      count++;
    }
    if(keys.some(key => key === 'lastName' && response.body.data['lastName'])) {
      expect(typeof response.body.data['lastName']).toBe('string');
      count++;
    }
    if(keys.some(key => key === 'phoneNumber' && response.body.data['phoneNumber'])) {
      expect(typeof response.body.data['phoneNumber']).toBe('string');
      count++;
    }
    expect(keys.length).toBeLessThanOrEqual(count + 3);
  });

});
