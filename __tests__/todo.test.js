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

  it('should return a particular todo', async () => {
    const res = await request(app).get('/api/v1/todos/1');
    expect(res.body.task).toEqual('Wake up goats');
  });

  it('should create a new todo', async() => {
    const res = await request(app).post('/api/v1/todos').send({ task: 'Gather eggs', details: 'chicken headcount' });
    expect(res.body.task).toEqual('Gather eggs');
  });

});
