const { Router } = require('express');
const Todo = require('../models/Todo');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');


module.exports = Router()

  .get('/', authenticate, async (req, res, next) => {
    try {
      const todos = await Todo.getAll(req.user.id);
      res.json(todos);
    } catch (error) {
      next (error);
    }
  })

  .get('/:id', authenticate, async (req, res, next) => {
    try {
      const singleTodo = await Todo.getById(req.params.id);
      res.json(singleTodo);
    } catch (error) {
      next (error);
    }
  })
  
  .post('/', authenticate, async (req, res, next) => {
    try {
      const newTodo = await Todo.insert({ ...req.body, user_id: req.user.id });
      res.json(newTodo);
    } catch (error) {
      next (error);
    }
  })
  
  .put('/:id', authenticate, authorize, async (req, res, next) => {
    try {
      const toUpdate = await Todo.updateById(req.params.id, req.body);
      res.json(toUpdate);
    } catch (error) {
      next (error);
    }
  })
  
  .delete('/:id', authenticate, async (req, res, next) => {
    try {
      const toDelete = await Todo.deleteById(req.params.id);
      res.json(toDelete);
    } catch (error) {
      next (error);
    }
  });
