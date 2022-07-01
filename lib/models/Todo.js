const pool = require('../utils/pool');

class Todo {
  id;
  user_id;
  task;
  details;
  created_at;


  constructor(row) {
    this.id = row.id;
    this.id = row.user_id;
    this.task = row.task;
    this.details = row.details;
    this.created_at = row.created_at;
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      `
  SELECT *
  FROM todos
  WHERE user_id=$1
  `, [user_id]
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

  static async insert({ user_id, task, details }) {
    const { rows } = await pool.query(
      `
      INSERT INTO todos (user_id, task, details)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [user_id, task, details]
    );
    return new Todo(rows[0]);
  }

  static async updateById(id, attrs) {
    const toUpdate = await Todo.getById(id);
    if (!toUpdate) return null;
    const { task, details, created_at } = { ...toUpdate, ...attrs };
    const { rows } = await pool.query(
      `
      UPDATE todos
      SET task=$2, details=$3, created_at=$4
      WHERE id=$1
      RETURNING *`,
      [id, task, details, created_at]
    );
    return new Todo(rows[0]);
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      `
      DELETE FROM todos
      WHERE id=$1
      RETURNING *
      `,
      [id]
    );
    return new Todo(rows[0]);
  }
}

module.exports = Todo;


