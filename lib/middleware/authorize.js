const Todo = require('../models/Todo');

module.exports = async (req, res, next) => {
  try {
    const todo = await Todo.getById(req.params.id);
    if (!todo || todo.user_id !== req.user.id) {
      throw new Error('You do not have access to this.');
    }
    next();
  } catch (error) {
    error.status = 403;
    next (error);
  }
};
