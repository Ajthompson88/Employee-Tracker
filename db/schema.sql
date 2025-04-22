-- db/schema.sql

-- 1. Recreate the database
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
\c employees_db

-- 2. department table
CREATE TABLE department (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

-- 3. role table
CREATE TABLE role (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(30) UNIQUE NOT NULL,
  salary        DECIMAL     NOT NULL,
  department_id INTEGER     NOT NULL
    REFERENCES department (id)
);

-- 4. employee table
CREATE TABLE employee (
  id         SERIAL PRIMARY KEY,
  first_name VARCHAR(30)      NOT NULL,
  last_name  VARCHAR(30)      NOT NULL,
  role_id    INTEGER          NOT NULL
    REFERENCES role (id),
  manager_id INTEGER
    REFERENCES employee (id)
);
