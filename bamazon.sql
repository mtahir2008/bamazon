DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id integer auto_increment NOT NULL PRIMARY KEY,
product_name  varchar(50) NOT NULL, 
department_name varchar(30) NULL,
price numeric(10,2),
stock_quantity integer,
product_sales integer
);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ('Call of Duty 4', 'Games', 59.00, 8, 0)
, ('Age of Empires','Games', 45.99,10, 0)
, ('Madden 19','Games',60.00,12, 0)
, ('Street Fighter','Games',39.00, 12, 0)
, ('PS4 Controller','Accessories', 59.00, 4, 0)
, ('Wireless Headset','Accessories', 99.00, 3, 0)
, ('Jeans','Clothes', 39.00, 10, 0)
, ('Slacks','Clothes', 79.00, 9, 0)
, ('Dress Shirt','Clothes', 45.00, 12, 0)
, ('49ers Sweatshirt','Clothes', 35.00, 3, 0)
, ('Samsung TV 65"','Electronics', 650.00, 7, 0)
, ('Playstation 4 Bundle','Electronics', 499.00,3, 0)
, ('4x4 Slash','Hobby', 300.00,4, 0)
, ('BBQ Grill','Hobby', 250.00, 3, 0);

SELECT * FROM products;

CREATE TABLE departments(
dept_id integer auto_increment NOT NULL PRIMARY KEY,
department_name varchar(30) NULL,
overhead_costs numeric(10,2)
);


INSERT INTO departments (department_name, overhead_costs)
VALUES ('Games', 500.00)
, ('Accessories', 250)
, ('Clothes', 500)
, ('Electronics', 2000)
, ('Hobby', 500);


SELECT * FROM departments;