import Koa from 'koa';
import request from 'supertest';
import run from '../src/index';

let app: Koa<Koa.DefaultState, Koa.DefaultContext>;

beforeAll(async (done) => {
  app = await run();
  done();
})

describe('POST /api/auth/login?deviceId', () => {

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

});
