const pool = require('../utils/pool');

module.exports = class Todo() {
  id;
  task;
  details;
  created_at;


  constructor(row) {
    this.id = row.id;
    this.task = row.task;
    this.details = row.details;
    this.created_at = row.created_at;
}

static async getAll() {
  const { rows } = await pool.query(
  `
  SELECT *
  FROM todos
  `
  )
  return rows.map((row) => new Todo(row));
}

}

module.exports = Todo;