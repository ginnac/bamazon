var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

//connecting to mysql

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    // function to list the menue options
    optionsList()
  });


// List a set of menu options:
 //inquire to see the list of option and do the choice the manager took

 function optionsList(){

    
  
        // once you have the items, prompt the user for which they'd like to buy
        // View Products for Sale
        // View Low Inventory
        // Add to Inventory
        // Add New Product
        inquirer
          .prompt([
            {
              name: "optionsList",
              type: "rawlist",
              choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product" ],
              message: "Choose a task:"
            },
          ])
          .then(function(answer) {

            //console.log(answer.optionsList);
           
            
            // If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
            // If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

            switch(answer.optionsList) {
                case "View Products for Sale":
                        viewProducts();
                  break;
                case "View Low Inventory":

                        lowInventory();
                  break;
                case "Apple":
                        viewProducts();
                  break;
                default:
                        viewProducts();
              }

        });

  
}


 // If a manager selects View Products for Sale, the app should list every available item: 
 //the item IDs, names, prices, and quantities.
function viewProducts(){

    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

            // instantiate
               
    var table = new Table({
        head: ['item_id','product_name',"department_name","price", "stock_quantity"],
        colWidths: [5,30,25,10,20]
    });
 
    for(var i=0;i<res.length;i++){
        table.push(
            [ res[i].item_id, res[i].product_name,res[i].department_name,res[i].price, res[i].stock_quantity],
            
        );
    }

    console.log(table.toString());
    });
}

// If a manager selects View Low Inventory, then it should list 
//all items with an inventory count lower than five.
function lowInventory(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        console.log("\nLow Inventory item(s):\n")
        var table = new Table({
            head: ['item_id','product_name',"department_name","price", "stock_quantity"],
            colWidths: [5,30,25,10,20]
        });

        for(var i = 0; i<res.length;i++){
            if (res[i].stock_quantity<5){

                table.push(
                    [ res[i].item_id, res[i].product_name,res[i].department_name,res[i].price, res[i].stock_quantity],
                    
                );

            }

        }

            console.log(table.toString());

       



        


    });


}