-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS todos CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR NOT NULL,
  password_hash VARCHAR NOT NULL
);


CREATE TABLE todos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT,
  task VARCHAR NOT NULL,
  details VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO todos (
  task,
  details,
  created_at
)

VALUES
('Wake up goats', 'check food, water, open doors to pasture', CURRENT_TIMESTAMP),
('Feed chickens', 'lower food bucket, refill if necessry', CURRENT_TIMESTAMP),
('Refill hummingbird food', 'nectar is kept in fridge', CURRENT_TIMESTAMP),
('Water plants', 'fruit trees get 5 gallons', CURRENT_TIMESTAMP)
;
