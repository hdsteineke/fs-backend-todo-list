const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');


const mockUser = {
  email: 'test@example.com',
  password: '1234567890'
};

const handleSignIn = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, userProps });
  const { email } = user;

  await agent.post('/api/v1/users/sessions').send({ email, password });
  return[agent, user];
};


describe('users', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  afterAll(() => {
    pool.end();
  });

  it('should return a 401 for non-authenticated users', async () => {
    const res = await request(app).get('/api/v1/todos');
    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('You must be signed in to continue');
  });

  it('should return a list of todo items for authenticated users', async () => {
    const [agent] = await handleSignIn();
    const res = await agent.get('/api/v1/todos');
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(4);
  });

  it('should return a 401 for non-authenticated users', async () => {
    const res = await request(app).get('/api/v1/todos/1');
    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('You must be signed in to continue');
  });

  it('should return a particular todo for authenticated users', async () => {
    const [agent] = await handleSignIn();
    const res = await agent.get('/api/v1/todos/1');
    expect(res.status).toEqual(200);
    expect(res.body.task).toEqual('Wake up goats');
  });

  it('should create a new todo for authenticated users', async() => {
    const res = await request(app).post('/api/v1/todos').send({ task: 'Gather eggs', details: 'chicken headcount' });
    expect(res.body.task).toEqual('Gather eggs');
  });

  it('should update a particular todo for authenticated users', async () => {
    const res = await request(app).put('/api/v1/todos/2').send({ task: 'Remember to feed chickens' });
    expect(res.status).toEqual(200);
    expect(res.body.id).toEqual('2');
  });

  it('should delete a particular to do for authenticated users', async () => {
    const res = await request(app).delete('/api/v1/todos/2');
    expect(res.status).toEqual(200);
    expect(res.body.id).toEqual('2');
  });

});
