const { prompt, default: inquirer } = require('inquirer');
const figlet = require('figlet');
const mysql = require('mysql2');
const connection = require('./config/connection');
const { existsSync } = require('fs');


// Connect to database
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        // MySQL username
        user: 'root',
        // MySQL password
        password: 'Password123!',
        database: 'employee_db'
    }
)
db.connect(function (err) {
    if (err) {
        console.log(err);
        throw (err);
    }
    init();
});

// Initial inquirer prompt
function init() {
    inquirer.prompt([
        {
            name: 'Menu',
            type: 'list',
            message: 'Select a choice',
            choice: [
                'View all Departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'Exit'
            ],
        }
    ])

        .then((response) => {
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
            } else if (response.menu === 'Delete a department') {
                deleteDepartment();
            } else if (response.menu === 'Delete a role') {
                deleteRole();
            } else if (response.menu === 'Delete an employee') {
                deleteEmployee();
            } else if (response.menu === 'Exit') {
                connection.end();
            }
        }
        )

    function getEmployees() {
        db.promise().query('select id, first_name, last_name, role_id, manager_id from employees;')
            .then(([rows]) => {
                let employees = rows;
                console.log('\n');
                console.table(employees)
            })
    }
}
