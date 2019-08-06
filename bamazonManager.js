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
    password: "",
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
        // View Products for Sale
        // View Low Inventory
        // Add to Inventory
        // Add New Product
        inquirer
          .prompt([
            {
              name: "optionsList",
              type: "rawlist",
              choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit" ],
              message: "Choose a task:"
            },
          ])
          .then(function(answer) {

            //console.log(answer.optionsList);

            switch(answer.optionsList) {
                case "View Products for Sale":
                        viewProducts();
                  break;
                case "View Low Inventory":

                        lowInventory();
                  break;
                case "Add to Inventory":
                        addInventory();
                  break;

                  case "Add New Product":
                        addNewProduct();
                  break;

                  case "Exit":
                        exitManagerSite();
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
    optionsList();
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
            optionsList();
       
    });
}


// If a manager selects Add to Inventory, your app should display a 
//prompt that will let the manager "add more" of any item currently in the store.

function addInventory(){

    console.log("This is the list of Products:")
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
  connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
  
        // once you have the items, prompt the user for which they'd like to add inventory to
        inquirer
          .prompt([
            {
              name: "inventoryId",
              type: "list",
              choices: function() {
                var inventoryList = [];
                for (var i = 0; i < res.length; i++) {
                    inventoryList.push(res[i].item_id);
                }
                return inventoryList;
              },
              message: "Please choose the id of the product you would like to add inventory to"
            },
            {
              name: "quantityToAdd",
              type: "number",
              message: "How many units are we adding to the inventory? (Please enter integers)",
              default: 0,
            },
          ])
          .then(function(answer) {

          //  console.log(answer.inventoryId + " " + answer.quantityToAdd);
  
         //do changes in mysql , update the quantity of the specific item_id
  
        var chosenId;
         for (var i = 0; i < res.length; i++) {
             if (res[i].item_id === answer.inventoryId) {
                chosenId = res[i];
         }
        }
    
        // if the answer.quantityToAdd is more than 0 then we can add the quantity;
        
           if (parseInt(answer.quantityToAdd)>0) {
         //Let's add the stock by the number of units from answer.quantityToAdd
  
        var numToAdd = parseInt(answer.quantityToAdd)
        var newStock =  chosenId.stock_quantity + numToAdd;
        ;
        //connecting to mysql query and updating stock_quantity

            connection.query(
               "UPDATE products SET ? WHERE ?",
               [
                {
                   stock_quantity: newStock
                },
                {
                  item_id: chosenId.item_id
                }
               ],
                 function(error) {
                    if (error) throw err;
                 console.log("\n\nStock updated sucessfully!");
                 console.log("You updated " + chosenId.product_name + " stock. Stock added was: " + numToAdd +

                 ". Total stock now is: " + newStock + ".");


                   optionsList();
                 }
  
            );
            }
        //     if not valid quantity was entered or default value was entered
         else {
               console.log("No valid quantity was entered");
               optionsList();
           
            }
          });
      });
}

   // If a manager selects Add New Product, it should allow the manager to
   // add a completely new product to the store.
function addNewProduct(){

    //inquirer to get the product information from the user
inquirer
/* Pass your questions in here */
  .prompt([
      { name: "productName",
        type: "input",
        message: "What is the name of the product you would like to add?",
      },

      { name: "departmentName",
        type: "list",
        choices: ["Mobile Accessories", "Purses and Backpacks", "Beauty", "Woman Clothing", "Men Clothing", "Others"],
        message: "Which department this item belongs to?",
      },

      { name: "pricePerUnit",
        type: "input",
        message: "What is this item's price per unit?",
        validate: function(value) {
            if (value < 100000) {
              return true;
            }
            return false;
            }
      },
    

      { name: "stock",
        type: "number",
        message: "How many units for item?",
    
      },
    
  ])
  .then (function(answers){
    // Use user feedback for... whatever!!
    //connect to mysql query and inset into the products table the new product
    connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answers.productName,
          department_name: answers.departmentName,
          price: answers.pricePerUnit || 0,
          stock_quantity: answers.stock || 0
        },
        function(err) {
          if (err) throw err;
          console.log("Your product was added successfully!");
          // re-prompt the user for if they want to bid or post
          optionsList();
        }
      );

});
}

// function to end connection
function exitManagerSite(){
    console.log("Session ended");
    connection.end();
}