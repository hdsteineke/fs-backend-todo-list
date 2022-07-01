const pool = require('../utils/pool');

class Todo {
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
    );
    return rows.map((row) => new Todo(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT *
      FROM todos
      WHERE id=$1
      `,
      [id]
    );
    return new Todo(rows[0]);    
  }

  static async insert({ task, details, created_at }) {
    const { rows } = await pool.query(
      `
      INSERT INTO todos (task, details, created_at)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [task, details, created_at]
    );
    return new Todo(rows[0]);
  }
}

module.exports = Todo;


