const { Router } = require('express');
const Todo = require('../models/Todo');


module.exports = Router()

  .get('/', async (req, res, next) => {
    try {
      const todos = await Todo.getAll();
      res.json(todos);
    } catch (error) {
      next (error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const singleTodo = await Todo.getById(req.params.id);
      res.json(singleTodo);
    } catch (error) {
      next (error);
    }
  });
