# bamazon

# Welcome to Bamazon, think of this as the new Amazon. 
To get started, clone repo, run npm install to add all of the dependencies.

Now type into NODE CLI,

1. node bamazonCustomer.js

Prints the products in the store.
Prompts customer which product they would like to purchase by ID number.
Asks for the quantity.
If there is a sufficient amount of the product in stock, it will return the total for that purchase.
However, if there is not enough of the product in stock, it will tell the user that there isn't enough of the product.
If the purchase goes through, it updates the stock quantity to reflect the purchase.

2. node bamazonManager.js

Starts with a update menu:

View Products for Sale
View Low Inventory
Add to Inventory
Add New Product
Exit 
If the manager selects View Products for Sale, it lists all of the products in the store including all of their details.
If the manager selects View Low Inventory, it'll list all the products with less than five items in its StockQuantity column.
If the manager selects Add to Inventory, it allows the manager to select a product and add inventory.
If the manager selects Add New Product, it allows the manager to add a new product to the store.


