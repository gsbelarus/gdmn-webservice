import Koa from 'koa';
import request from 'supertest';
import run from '../src/index';

let app: Koa<Koa.DefaultState, Koa.DefaultContext>;

beforeAll(async (done) => {
  app = await run();
  done();
})

/*afterAll(async() => {
  await request(app.callback())
    .get('/api/auth/logout')
    .query('deviceId=123')
    .set('Accept', 'application/json')
})*/

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
    const response = await request(app.callback())
      .post('/api/auth/login')
      .query('deviceId=123')
      .set('Accept', 'application/json')
      .send({
        userName: '1',
        password: '1'
      })
    expect(response.status).toEqual(200);
    expect(response.body.result).toBeTruthy();
  });
});
