const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('users', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  afterAll(() => {
    pool.end();
  });

  it('should return a list of todo items', async () => {
    const res = await request(app).get('/api/v1/todos');
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(4);
  });


});
