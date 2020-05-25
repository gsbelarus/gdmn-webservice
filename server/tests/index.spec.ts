import Koa from 'koa';
import request from 'supertest';
import run from '../src/index';

let app: Koa<Koa.DefaultState, Koa.DefaultContext>;

beforeAll(async (done) => {
  app = await run();
  done();
})

describe('POST /auth/login?deviceId=123', () => {

  test('responds correct', async() => {
    const response = await request(app.callback())
      .post('/api/auth/login')
      .query('deviceId=123')
      .set('Accept', 'application/json')
      .send({
        userName: 'admin',
        password: 'admin'
      })
    expect(response.status).toEqual(200);
    expect(response.body.result).toEqual(true)
  });
});
