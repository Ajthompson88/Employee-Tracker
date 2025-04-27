-- db/seeds.sql

-- Clear existing data
TRUNCATE TABLE employee RESTART IDENTITY CASCADE;
TRUNCATE TABLE role RESTART IDENTITY CASCADE;
TRUNCATE TABLE department RESTART IDENTITY CASCADE;

-- 1. Insert Departments typical of a software development company
INSERT INTO department (name) VALUES
  ('Engineering'),
  ('Product Management'),
  ('Quality Assurance'),
  ('Human Resources'),
  ('DevOps'),
  ('Sales');

-- 2. Insert Roles for each department
INSERT INTO role (title, salary, department_id) VALUES
  -- Engineering
  ('Engineering Manager',         120000, 1),
  ('Senior Software Engineer',    110000, 1),
  ('Software Engineer',            90000, 1),
  ('Junior Software Engineer',     70000, 1),

  -- Product Management
  ('Product Manager',             105000, 2),
  ('Associate Product Manager',     80000, 2),

  -- Quality Assurance
  ('QA Manager',                  100000, 3),
  ('QA Engineer',                  80000, 3),

  -- Human Resources
  ('HR Manager',                   95000, 4),
  ('Recruiter',                     65000, 4),

  -- DevOps
  ('DevOps Engineer',             100000, 5),
  ('Site Reliability Engineer',   115000, 5),

  -- Sales
  ('Sales Manager',               100000, 6),
  ('Sales Representative',         60000, 6);

-- 3. Insert Employees
-- Top‑level managers (manager_id = NULL)
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('Alice',   'Johnson',  1, NULL),  -- Engineering Manager
  ('Bob',     'Smith',    5, NULL),  -- Product Manager
  ('Carol',   'Lee',      7, NULL),  -- QA Manager
  ('David',   'Nguyen',   9, NULL),  -- HR Manager
  ('Eve',     'Martinez',11, NULL),  -- DevOps Engineer (leads DevOps)
  ('Frank',   'Wilson',  13, NULL);  -- Sales Manager

-- Subordinate staff (reference managers by their IDs above)
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('George',  'Clark',    2,  1),  -- Sr. S/W Engineer under Alice
  ('Hannah',  'Davis',    3,  1),  -- S/W Engineer under Alice
  ('Ian',     'Thompson', 6,  2),  -- Associate PM under Bob
  ('Jenny',   'Brown',    8,  3),  -- QA Engineer under Carol
  ('Kevin',   'Patel',   10,  4),  -- Recruiter under David
  ('Laura',   'Kim',     12,  5),  -- SRE under Eve
  ('Mike',    'Johnson', 14,  6);  -- Sales Rep under Frank
