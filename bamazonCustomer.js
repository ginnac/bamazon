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
    // run the write products list function after the connection is made to write the list of products
    writeProductsList();
  });


//writing it to the console

function writeProductsList() {
    console.log("\nDisplaying all products:\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      //console.log(res);
        // instantiate
                //remove stock quantity!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    var table = new Table({
        head: ['item_id','product_name',"department_name","price", "stock_quantity"],
        colWidths: [10,50,50,20,20]
    });
 
    for(var i=0;i<res.length;i++){
        table.push(
            [ res[i].item_id, res[i].product_name,res[i].department_name,res[i].price,res[i].stock_quantity],
            
        );
    };
   
 
    console.log(table.toString());

    buyProduct();

      
    });
  }




//let the "user" decide which item to buy and quantity - inquirer

function buyProduct() {
    // query the database for all the products
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;

      // once you have the items, prompt the user for which they'd like to buy
      inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceList = [];
              for (var i = 0; i < res.length; i++) {
                choiceList.push(res[i].item_id
                  
                  );
              }
              return choiceList;
            },
            message: "Please choose the id of the product you would like to buy"
          },
          {
            name: "quantity",
            type: "rawlist",
            choices: function() {
              var quantityList = [];
              for (var i = 1; i < 26; i++) {
                quantityList.push(i);
                  
                
              }
              return quantityList;
            },
            message: "How many units would you like to buy?"
          },
        ])
        .then(function(answer) {
        //   connection.end();


        //do changes in my sql if the quantity customer will buy is in stock

          var chosenProduct;
          for (var i = 0; i < res.length; i++) {
            if (res[i].item_id === answer.choice) {
              chosenProduct = res[i];
            }
          }
  
          // determine if we can sell the product
          //if enough stock, let user buy and decrement stock
          if (chosenProduct.stock_quantity > parseInt(answer.quantity)) {
            // we have stock so lets reduce the stock by the number of units sold

            var num = parseInt(answer.quantity)
           var newStock =  chosenProduct.stock_quantity - num;
           
           connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: newStock
                },
                {
                  item_id: chosenProduct.item_id
                }
              ],
              function(error) {
                if (error) throw err;
                console.log("\n\nOrder placed sucessfully!");
                console.log("You ordered " + num + " unit(s) of " + chosenProduct.product_name + "\nYour Total was: " 
                + chosenProduct.price * num + " $ \nThank you for your business!");
              }

            );
          }
          //if not enough stock console log sorry not enough stock.
          else {
            console.log("Sorry, order can't be completed - Insufficient quantity!");
         
         }
        });
    });
  }


  








