var inquirer = require("inquirer");
var mysql = require("mysql");

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
    console.log("displaying all products\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      connection.end();
    });
  }




//let the "user" decide which item to buy and quantity - inquirer


//if enough stock decrement stock



//if not enough stock console log sorry not enough stock.
