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
  });
