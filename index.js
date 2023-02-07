const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./config/connection');
const { Console } = require('console');

// Connection is in config folder, not needed twice

// Connect to database
// const db = mysql.createConnection(
//     {
//         host: '127.0.0.1',
//         // MySQL username
//         user: 'root',
//         // MySQL password
//         password: 'Password123!',
//         database: 'employee_db'
//     }
// )

// db.connect(function (err) {
//     if (err) {
//         console.log(err);
//         throw (err);
//     }
//     console.log("db connected")
//     init();
// });



// Initial inquirer prompt
function init() {
    inquirer.prompt([
        {
            name: 'menu',
            type: 'list',
            message: 'Select a choice',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee',
                'Exit'
            ],
        }
    ])

        .then(response => {
            console.log(response);
            if (response.menu === 'View all departments') {
                viewDepartments();
            } else if (response.menu === 'View all roles') {
                viewRoles();
            } else if (response.menu === 'View all employees') {
                viewEmployees();
            } else if (response.menu === 'Add a department') {
                addDepartment();
            } else if (response.menu === 'Add a role') {
                addRole();
            } else if (response.menu === 'Add an employee') {
                addEmployee();
            } else if (response.menu === 'Update an employee') {
                updateEmployee();
            } else if (response.menu === 'Exit') {
                db.end();
            }
        });
};


// Function to view employees
function viewEmployees() {
    db.promise().query('select id, first_name, last_name, role_id, manager_id from employees;')
        .then(([rows]) => {
            let employees = rows;
            console.log('\n');
            console.table(employees);
            init();
        })
}

// Function to view roles
function viewRoles() {
    db.promise().query('select id, title, salary, department_id from roles;')
        .then(([rows]) => {
            let roles = rows;
            console.log('\n');
            console.table(roles);
            init();
        })
}

// Function to view departments
function viewDepartments() {
    db.promise().query('select id, department_name from departments;')
        .then(([rows]) => {
            let departments = rows;
            console.log('\n');
            console.table(departments);
            init();
        })
}

// Function to add employees
function addEmployee() {
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'What is the first name?',
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'What is the last name?',
        },
        {
            name: 'role_id',
            type: 'input',
            message: 'What is the role id?',
        },
        {
            name: 'manager_id',
            type: 'input',
            message: 'What is the manager id?',
        }
    ])

        .then(employee => {
            const sql = `INSERT INTO employees 
                         SET ?`;
            const params = {
                manager_id: employee.manager_id,
                role_id: employee.role_id,
                first_name: employee.first_name,
                last_name: employee.last_name
            }
            db.promise().query(sql, params)
                .then(() => {
                    console.log('new employee added');
                    init();
                })
        });
}

// Function to update employees

function updateEmployee() {
    db.promise().query('select * from employees;')
        .then(([rows]) => {

            let employees = rows;
            console.log('\n');
            console.table(employees);

            db.promise().query('select * from roles;')
                .then(([roleData]) => {
                    let roles = roleData;
                    console.table(roles);
                    inquirer.prompt([
                        {
                            name: 'employee',
                            type: 'list',
                            message: 'Please select an employee to update',
                            choices: employees.map(employee => {
                                return `${employee.first_name} ${employee.last_name}`
                            })
                        },
                        {
                            name: 'roles',
                            type: 'list',
                            message: 'Please select a role',
                            choices: roles.map(role => {
                                return `${role.title}`;
                            })
                        }
                    ])
                        .then(answer => {
                            console.table(answer)
                            let employeeId = employees.filter(employee => {
                                return employee.first_name === answer.employee.split(' ')[0];
                            })
                            console.log(employeeId);
                            let roleId = roles.filter(role => {
                                return role.title === answer.roles;
                            })
                            console.log(roleId);
                            db.promise().query(`UPDATE employees SET role_id = ${roleId[0].id} WHERE id = ${employeeId[0].id};`)
                            .then(() => {
                              console.log(`Employee ${answer.employee} has been updated to the role of ${answer.roles}.`);
                              init();
                            })
                            .catch(error => {
                              console.error(error);
                            });
                        })
                })
        })
}

//  Function to add roles
function addRole() {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is the role title?',
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary?',
        },
        {
            name: 'department_id',
            type: 'input',
            message: 'What is the department id?',
        }
    ])

        .then(role => {
            const sql = `INSERT INTO roles
                     SET ?`;
            const params = {
                title: role.title,
                salary: role.salary,
                department_id: role.department_id
            }
            db.promise().query(sql, params)
                .then(() => {
                    console.log('new role added');
                    init();
                })
        });
}

// Function to add departments
function addDepartment() {
    inquirer.prompt([
        {
            name: 'department_name',
            type: 'input',
            message: 'What is the department?'
        }
    ])


        .then(department => {
            const sql = `INSERT INTO departments
        SET ?`;

            const params = {
                department_name: department.department_name
            }
            db.promise().query(sql, params)
                .then(() => {
                    console.log('new department added');
                    init();
                })
        });
}

init();