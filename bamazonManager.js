var inquirer = require("inquirer");
var cliTable = require('cli-table');
var colors = require('colors');
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting");
        return;
    }
    console.log("connected as id " + connection.threadId);
});
var inventoryMsg;



// manager menu to update 
function managerUpdate() {
    inquirer.prompt([
        {
            type: "list",
            message: "What do you want to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Products", "Exit"],
            name: "mgrDoItem"
        }
    ]).then(function (manager_menu) {
        switch (manager_menu.mgrDoItem) {
            case "View Products for Sale":
                displayProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Products":
                addProduct();
                break;
            case "Exit":
                exitBamazonMgr();
                break;
        };
    });
};

//Display table 
function displayProducts() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var table = new cliTable({
            head: ["Item Number".cyan, "Product Name".cyan, "Department".cyan, "Price".cyan, "Quantity".cyan],
            colWidths: [13, 25, 20, 13, 13],
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        };
        console.log(table.toString());
        managerUpdate();
    });
};

//See low inventory, below 5 remaining
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        var table = new cliTable({
            head: ["Item Number".cyan, "Product Name".cyan, "Department".cyan, "Price".cyan, "Quantity".cyan],
            colWidths: [13, 25, 20, 13, 13],
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        };
        console.log(table.toString());
        managerUpdate();
    });
};

// add to inventory
function addInventory() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var table = new cliTable({
            head: ["Item Number".cyan, "Product Name".cyan, "Department".cyan, "Price".cyan, "Quantity".cyan],
            colWidths: [13, 25, 20, 13, 13],
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        };
        console.log(table.toString());

        inquirer.prompt([
            {
                type: "input",
                message: "Which item would you like to reorder? (Iten Number) ",
                name: "itemNum"
            },
            {
                type: "input",
                message: "How many would you like to add to stock?",
                name: "Qty"
            }
        ]).then(function (userOrder) {

            var i = userOrder.itemNum - 1;
            var updateQty = parseInt(res[i].stock_quantity) + parseInt(userOrder.Qty);
            connection.query("UPDATE products SET ? WHERE ?",
                [{
                    stock_quantity: updateQty
                },
                {
                    item_id: userOrder.itemNum
                }], function (error, results) {
                    if (error) throw error;
                    inventoryMsg = "     Your restock order for " + userOrder.Qty + "  " + res[i].product_name + " has been placed.  \n";

                    console.log(inventoryMsg);
                    managerUpdate();
                }
            );
        });
    });
};

// add new product 
function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the product you would like to add? ",
            name: "itemName"
        },
        {
            type: "list",
            message: "Which department will this item be under ?",
            choices: ["Real Estate", "Furniture", "Accessories", "Appliances", "Electronics", "Outdoors", "Windows_Doors"],
            name: "itemDept"
        },
        {
            type: "input",
            message: "At what price will this be offered?",
            name: "itemPrice"
        },
        {
            type: "input",
            message: "How many will initially be stocked?",
            name: "itemQty"
        },
    ]).then(function (addProd) {
        connection.query("INSERT INTO products SET ?",
            {
                product_name: addProd.itemName,
                department_name: addProd.itemDept,
                price: addProd.itemPrice,
                stock_quantity: addProd.itemQty
            }, function (err, res) {
                if (err) throw err;

                inventoryMsg = "    A quantity of " + addProd.itemQty + " " + addProd.itemName + "s have been added to inventory stock under the " +
                    addProd.itemDept + " department";
                console.log(inventoryMsg);
                managerUpdate();
            }
        );
    });
};

// Exit 
function exitBamazonMgr() {
    connection.end();
    console.log("**********              Exiting BAMAZON                  **********\n");
};
console.log("**********              WELCOME TO BAMAZON                  **********\n");
managerUpdate();