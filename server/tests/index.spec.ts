//import * as supertest from 'supertest';
import Koa from 'koa';
import request from 'supertest';
import run from '../src/index';
import { strictEqual } from 'assert';

let app: Koa<Koa.DefaultState, Koa.DefaultContext>;

beforeAll(async (done) => {
  app = await run();
  done();
})

describe('POST /auth/login?deviceId=123', () => {

  test('responds correct', () => {
    request(app.callback())
      .post('/auth/login')
      .query('deviceId=123')
      .set('Accept', 'application/json')
      .send({
        userName: 'admin',
        password: 'admin'
      })
      .expect(200)
      .then(response => {
        strictEqual(response.body.result, true, 'incorrect request')
      })
  });
});
