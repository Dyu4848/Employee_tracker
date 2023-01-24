-- Create the seeds for department
INSERT INTO department (name)
VALUES  ('Accounting'),
        ('Sales'),
        ('Marketing'),
        ('HR'),
        ('Claims');

-- Create the seeds for role
INSERT INTO roles(title, id, department_id, salary)
VALUES  ('CPA', 60000, 1, 120000),
        ('Regional Sales Associate', 50000, 2, 110000),
        ('Social Media Manager', 40000, 3, 100000),
        ('Coordinator', 30000, 4, 90000),
        ('Reviewer', 20000, 5, 80000);

-- Create the seed for employees
INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES  ('Bruce', 'Wayne', 1, NULL),
        ('Robin', 'Adams', 1, 1),
        ('Clark', 'Kent', 2, NULL),
        ('James', 'Clark', 2, 2),
        ('Barry', 'Allan', 3, NULL),
        ('Emily', 'Green', 3, 3),
        ('Wade', 'Wilson', 4, NULL),
        ('Chris', 'Archer', 4, 4),
        ('Mark', 'Williams', 5, NULL),
        ('Christine', 'Fielder', 5, 5);
