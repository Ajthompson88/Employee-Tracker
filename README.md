# Employee Tracker

## Description
A command-line interface (CLI) application for managing a company's employee database, built with Node.js, Inquirer, and PostgreSQL. This app allows you to view, add, and update departments, roles, and employees, meeting all the specified acceptance criteria for an employee tracking system.

---

## Table of Contents

- [Description](#description)
- [Acceptance Criteria](#acceptance-criteria)  
- [Demo Video](#demo-video)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Technologies](#technologies)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Acceptance Criteria

- **WHEN** I start the application **THEN** I am presented with the following options:
  - View all departments
  - View all roles
  - View all employees
  - Add a department
  - Add a role
  - Add an employee
  - Update an employee role

- **WHEN** I choose **View all departments** **THEN** I see a formatted table showing department names and ids.  
- **WHEN** I choose **View all roles** **THEN** I see job title, role id, department, and salary.  
- **WHEN** I choose **View all employees** **THEN** I see employee id, first name, last name, title, department, salary, and manager.  
- **WHEN** I choose **Add a department** **THEN** I am prompted for the department name and it is added to the database.  
- **WHEN** I choose **Add a role** **THEN** I am prompted for the role name, salary, and department, and it is added.  
- **WHEN** I choose **Add an employee** **THEN** I am prompted for first name, last name, role, and manager, and the employee is added.  
- **WHEN** I choose **Update an employee role** **THEN** I am prompted to select an employee and a new role, and the database updates accordingly.

---

## Demo Video

Watch the walkthrough video demonstrating all functionality: [Insert Walkthrough Video Link](#)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/employee-tracker.git
   cd employee-tracker

---

## License

This project is licensed under the terms of the [MIT License](./LICENSE).