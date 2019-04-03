var inquirer = require("inquirer");
var cliTable = require("cli-table");
var colors = require("colors");
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

var orderMsg;

//Display table of items for sale
function displayProducts() {
    console.log("**********              WELCOME TO BAMAZON                  **********\n");
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
        orderMenu();
    });
};

//Get user order input and update table
function orderMenu() {
    inquirer.prompt([
        {
            type: "input",
            message: "Which item would you like to purchase? (Iten Number) ",
            name: "itemNum"
        },
        {
            type: "input",
            message: "How many would you like to purchase?",
            name: "Qty"
        }
    ]).then(function (userOrder) {
        connection.query("SELECT * FROM products JOIN departments ON products.department_name =        departments.department_name", function (err, res) {
            if (err) throw err;
            var i = userOrder.itemNum - 1;
            if (res[i].stock_quantity >= userOrder.Qty) {
                var updateQty = parseInt(res[i].stock_quantity) - parseInt(userOrder.Qty);
                var OrderTotal = parseFloat(res[i].price) * parseFloat(userOrder.Qty);
                OrderTotal = OrderTotal.toFixed(2);

                // Update the product table stock quantity 
                connection.query("UPDATE products SET ? WHERE ?",
                    [{
                        stock_quantity: updateQty
                    },
                    {
                        item_id: userOrder.itemNum
                    }], function (error, results) {
                        if (error) throw error;
                        orderMsg = "     Your order for " + userOrder.Qty + "  " + res[i].product_name + " has been placed.  \n" + "     Your total is $ " + OrderTotal + "  \n";
                        console.log(orderMsg);
                    }
                );

                // Update the departments table total sales 
                var deptSales = parseFloat(res[i].total_sales) + parseFloat(OrderTotal);
                deptSales = deptSales.toFixed(2);
                connection.query("UPDATE departments SET ? WHERE ?", [
                    { total_sales: deptSales },
                    { department_name: res[userOrder.itemNum - 1].department_name }
                ], function (error, results) {
                    continueShopping();
                });
            } else {
                orderMsg = "     Insufficient quantity -- We only have " + res[i].stock_quantity + " " + res[i].product_name + " \n" + "     We are sorry that we cannot fullfill your order request for  " + userOrder.Qty + " " + res[i].product_name + " \n";

                console.log(orderMsg);
                continueShopping();
            }
        });
    });
};

// ask user if they want to continue shopping 
function continueShopping() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to continue shopping? ",
            name: "cont"
        }
    ]).then(function (shopping) {
        if (shopping.cont) {
            displayProducts();
        }
        else {
            exitBamazon();
        }
    });
};

// Exit 
function exitBamazon() {
    connection.end();
    console.log("**********              Exiting BAMAZON                  **********\n");
};
displayProducts();