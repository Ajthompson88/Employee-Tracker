import dotenv from 'dotenv';
import inquirer from 'inquirer';
import pkg from 'pg';
const { Pool } = pkg;
import 'console.table';

// Load environment variables from .env file
dotenv.config();

// Create a new connection pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

/* ---------------------- CRUD FUNCTION IMPLEMENTATIONS ---------------------- */

/** READ: View all departments */
async function viewDepartments() {
  try {
    const { rows } = await pool.query('SELECT * FROM department;');
    console.table(rows);
  } catch (err) {
    console.error('Error viewing departments:', err);
  }
}

/** READ: View all roles (with department names) */
async function viewRoles() {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.title, d.name AS department, r.salary
       FROM role r
       JOIN department d ON r.department_id = d.id;`
    );
    console.table(rows);
  } catch (err) {
    console.error('Error viewing roles:', err);
  }
}

/** READ: View all employees (with role, department, manager) */
async function viewEmployees() {
  try {
    const { rows } = await pool.query(
      `SELECT e.id,
              e.first_name,
              e.last_name,
              r.title,
              d.name   AS department,
              r.salary,
              CONCAT(m.first_name, ' ', m.last_name) AS manager
       FROM employee e
       LEFT JOIN role     r ON e.role_id       = r.id
       LEFT JOIN department d ON r.department_id = d.id
       LEFT JOIN employee m ON e.manager_id    = m.id;`
    );
    console.table(rows);
  } catch (err) {
    console.error('Error viewing employees:', err);
  }
}

/** CREATE: Add a new department */
async function addDepartment() {
  const { name } = await inquirer.prompt([{ type: 'input', name: 'name', message: 'Enter the new department name:' }]);
  try {
    await pool.query('INSERT INTO department (name) VALUES ($1);', [name]);
    console.log(`✅ Department "${name}" added.`);
  } catch (err) {
    console.error('Error adding department:', err);
  }
}

/** CREATE: Add a new role */
async function addRole() {
  // Fetch existing departments for selection
  const { rows: deps } = await pool.query('SELECT * FROM department;');
  const depChoices = deps.map(d => ({ name: d.name, value: d.id }));

  const answers = await inquirer.prompt([
    { type: 'input',  name: 'title',         message: 'Role title?' },
    { type: 'number', name: 'salary',        message: 'Role salary?' },
    { type: 'list',   name: 'department_id', message: 'Department?', choices: depChoices }
  ]);

  try {
    await pool.query(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);',
      [answers.title, answers.salary, answers.department_id]
    );
    console.log(`✅ Role "${answers.title}" added.`);
  } catch (err) {
    console.error('Error adding role:', err);
  }
}

/** CREATE: Add a new employee */
async function addEmployee() {
  // Fetch roles and employees for selection
  const { rows: roles }     = await pool.query('SELECT * FROM role;');
  const { rows: employees } = await pool.query('SELECT * FROM employee;');

  const roleChoices    = roles.map(r => ({ name: r.title, value: r.id }));
  const managerChoices = [
    { name: 'None', value: null },
    ...employees.map(e => ({ name: `${e.first_name} ${e.last_name}`, value: e.id }))
  ];

  const answers = await inquirer.prompt([
    { type: 'input', name: 'first_name', message: 'First name?' },
    { type: 'input', name: 'last_name',  message: 'Last name?' },
    { type: 'list',  name: 'role_id',    message: 'Role?',        choices: roleChoices },
    { type: 'list',  name: 'manager_id', message: 'Manager?',     choices: managerChoices }
  ]);

  try {
    await pool.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);',
      [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
    );
    console.log(`✅ Employee "${answers.first_name} ${answers.last_name}" added.`);
  } catch (err) {
    console.error('Error adding employee:', err);
  }
}

/** UPDATE: Change an existing employee's role */
async function updateEmployeeRole() {
  // Fetch employees and roles for selection
  const { rows: emps }  = await pool.query('SELECT * FROM employee;');
  const { rows: roles } = await pool.query('SELECT * FROM role;');

  const empChoices  = emps.map(e => ({ name: `${e.first_name} ${e.last_name}`, value: e.id }));
  const roleChoices = roles.map(r => ({ name: r.title, value: r.id }));

  const answers = await inquirer.prompt([
    { type: 'list', name: 'empId',  message: 'Which employee?', choices: empChoices },
    { type: 'list', name: 'roleId', message: 'New role?',       choices: roleChoices }
  ]);

  try {
    await pool.query(
      'UPDATE employee SET role_id = $1 WHERE id = $2;', 
      [answers.roleId, answers.empId]
    );
    console.log('✅ Employee role updated.');
  } catch (err) {
    console.error('Error updating role:', err);
  }
}

/** DELETE: Remove a department */
async function deleteDepartment() {
  const { rows } = await pool.query('SELECT * FROM department;');
  const { depId } = await inquirer.prompt([{
    type: 'list',
    name: 'depId',
    message: 'Which department to delete?',
    choices: rows.map(d => ({ name: d.name, value: d.id }))
  }]);

  try {
    await pool.query('DELETE FROM department WHERE id = $1;', [depId]);
    console.log('✅ Department deleted.');
  } catch (err) {
    console.error('Error deleting department:', err);
  }
}

/** DELETE: Remove a role */
async function deleteRole() {
  const { rows } = await pool.query('SELECT * FROM role;');
  const { roleId } = await inquirer.prompt([{
    type: 'list',
    name: 'roleId',
    message: 'Which role to delete?',
    choices: rows.map(r => ({ name: r.title, value: r.id }))
  }]);

  try {
    await pool.query('DELETE FROM role WHERE id = $1;', [roleId]);
    console.log('✅ Role deleted.');
  } catch (err) {
    console.error('Error deleting role:', err);
  }
}

/** DELETE: Remove an employee */
async function deleteEmployee() {
  const { rows } = await pool.query('SELECT * FROM employee;');
  const { empId } = await inquirer.prompt([{
    type: 'list',
    name: 'empId',
    message: 'Which employee to delete?',
    choices: rows.map(e => ({ name: `${e.first_name} ${e.last_name}`, value: e.id }))
  }]);

  try {
    await pool.query('DELETE FROM employee WHERE id = $1;', [empId]);
    console.log('✅ Employee deleted.');
  } catch (err) {
    console.error('Error deleting employee:', err);
  }
}

/* ---------------------- MAIN MENU LOOP ---------------------- */
async function mainMenu() {
  let exit = false;

  while (!exit) {
    const { action } = await inquirer.prompt([{ type: 'list', name: 'action', message: 'What would you like to do?', choices: [
      { name: 'View all departments',    value: 'view_departments'   },
      { name: 'View all roles',          value: 'view_roles'         },
      { name: 'View all employees',      value: 'view_employees'     },
      { name: 'Add a department',        value: 'add_department'     },
      { name: 'Add a role',              value: 'add_role'           },
      { name: 'Add an employee',         value: 'add_employee'       },
      { name: 'Update an employee role', value: 'update_employee_role' },
      { name: 'Delete a department',     value: 'delete_department'    },
      { name: 'Delete a role',           value: 'delete_role'         },
      { name: 'Delete an employee',      value: 'delete_employee'      },
      { name: 'Exit',                    value: 'exit'                }
    ] }]);

    switch (action) {
      case 'view_departments':      await viewDepartments();       break;
      case 'view_roles':            await viewRoles();             break;
      case 'view_employees':        await viewEmployees();         break;
      case 'add_department':        await addDepartment();         break;
      case 'add_role':              await addRole();               break;
      case 'add_employee':          await addEmployee();           break;
      case 'update_employee_role':  await updateEmployeeRole();    break;
      case 'delete_department':     await deleteDepartment();      break;
      case 'delete_role':           await deleteRole();            break;
      case 'delete_employee':       await deleteEmployee();        break;
      case 'exit':                  exit = true;                   break;
    }

    console.log(); // blank line between iterations
  }

  await pool.end();
  console.log('Goodbye!');
}

// Start the application
mainMenu();
