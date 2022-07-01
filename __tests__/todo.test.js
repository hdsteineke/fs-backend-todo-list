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

  it('should update a particular todo', async () => {
    const res = await request(app).put('/api/v1/todos/2').send({ task: 'Remember to feed chickens' });
    expect(res.status).toEqual(200);
    expect(res.body.id).toEqual('2');
  });

  it('should delete a particular to do', async () => {
    const res = await request(app).delete('/api/v1/todos/2');
    expect(res.status).toEqual(200);
    expect(res.body.id).toEqual('2');
  });

});
