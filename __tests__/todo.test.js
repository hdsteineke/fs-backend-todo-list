const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Todo = require('../lib/models/Todo');


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

  it('GET should return a 401 when signed out and listing all todos', async () => {
    const res = await request(app).get('/api/v1/todos');
    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('You must be signed in to continue');
  });

  it('GET should return a list of todo items for authenticated users', async () => {
    const [agent] = await handleSignIn();
    const res = await agent.get('/api/v1/todos');
    expect(res.status).toEqual(200);
  });

  it('GET/:id should return a 401 when signed out and returning a particular todo', async () => {
    const res = await request(app).get('/api/v1/todos/1');
    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('You must be signed in to continue');
  });

  it('GET/:id should return a particular todo for authenticated users', async () => {
    const [agent, user] = await handleSignIn();
    const todo = await Todo.insert({
      user_id: user.id, 
      task: 'Fill hummingbird feeders',
      details: 'nectar is in fridge'
    });
    const res = await agent.get(`/api/v1/todos/${todo.id}`);
    expect(res.status).toEqual(200);
    expect(res.body.task).toEqual('Fill hummingbird feeders');
  });

  it('POST should return a 401 when signed out and trying to create new todo', async() => {
    const res = await request(app).post('/api/v1/todos').send({ task: 'Gather eggs', details: 'chicken headcount' });
    expect(res.body.message).toEqual('You must be signed in to continue');
  });

  it('POST should create a new todo for authenticated users', async() => {
    const [agent, user] = await handleSignIn();

    const newTask = {
      task: 'Gather eggs', 
      details: 'chicken headcount',
      user_id: user.id 
    };
    const res = await agent.post('/api/v1/todos').send(newTask);
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      task: 'Gather eggs',
      details: 'chicken headcount',
      user_id: expect.any(String),
      created_at: expect.any(String)
    });
  });

  it('PUT should return a 401 when signed out and trying to update a todo', async () => {
    const res = await request(app).put('/api/v1/todos/2').send({ task: 'Remember to feed chickens' });
    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('You must be signed in to continue');
  });

  it('PUT should return a 403 for signed in users trying to update todo but NOT authorized', async () => {
    const [agent] = await handleSignIn();
    const res = await agent.put('/api/v1/todos/2').send({ task: 'Remember to feed chickens' });
    expect(res.status).toEqual(403);
    expect(res.body.message).toEqual('You do not have access to this.');
  });

  it('PUT should update a particular todo for authenticated and authorized users', async () => {
    const [agent, user] = await handleSignIn();
    const todo = await Todo.insert({
      task: 'Fold laundry',
      details: 'Hang dry wool sweater',
      user_id: user.id
    });
    const res = await agent
      .put(`/api/v1/todos/${todo.id}`)
      .send({ task: 'Do laundry' });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ ...todo, task: 'Do laundry', created_at: expect.any(String) });
  });

  it('should return a 401 for non-authenticated users attempting to delete a todo', async () => {
    const res = await request(app).delete('/api/v1/todos/2');
    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('You must be signed in to continue');
  });

  it('should delete a particular to do for authenticated users', async () => {
    const [agent, user] = await handleSignIn();
    const todo = await Todo.insert({
      task: 'Unload dishwasher',
      details: 'organize tupperware shelf',
      user_id: user.id
    });
    const res = await agent.delete(`/api/v1/todos/${todo.id}`);
    expect(res.status).toEqual(200);
    expect(res.body.id).toEqual(todo.id);
  });

});
