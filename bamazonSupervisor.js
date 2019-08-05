var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

//create connection to mysql 
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
  
//and connect to mysql

  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    // function to display the menue options

    console.log("connected");
  
  });

//inquirer to display the following choices to be selected by the user:

    // View Product Sales by Department
    // Create New Department
    inquirer

    .prompt([
      {
        name: "actionsList",
        type: "list",
        choices: ["View Product Sales by Department", "Create New Department"],
        message: "Choose an Action:"
      },
    ])
    .then(function(answer) {

      //console.log(answer.optionsList);

      switch(answer.actionsList) {
          case "View Product Sales by Department":
                  departmentSales();
            break;
          case "Create New Department":

                  lowInventory();
            break;

            case "Exit":
                  exitSupervisorSite();
            break;

          default:
                  viewProducts();
        }

  });

   //with the response we will then:
  //if answer = View Product Sales by Department, the app should display a summarized table in their
  // terminal/bash window.
    //total_profit column should be calculated on the fly using the difference between over_head_costs
    // and product_sales. total_profit should not be stored in any database. You should use a custom alias.

   function departmentSales(){
//group them by department name and get the total product sales by department 
        var sales = [] 
        var query="SELECT department_name,SUM(product_sales) FROM products GROUP BY department_name"
        connection.query(query, function(err, res) {
          if (err) throw err;

          for (var i=0; i<res.length;i++){
            sales.push([res[i].department_name, res[i]["SUM(product_sales)"]]);
          }
          console.log(sales);

//getting just vales from departments table
        var quer= "SELECT * FROM departments"
        connection.query(quer, function(err, res) {
            if (err) throw err;
    
                // instantiate
       
        
        var table = new Table({
            head: ['department_id',"department_name", "over_head_costs", "product_sales", "total_profit"],
            colWidths: [5,30,15,15,15]
        });
     //working on posting product sales
        for(var i=0;i<res.length;i++){
          var salesToPost = 0;
          for(var x=0; x<sales.length;x++){
            if (sales[x][1]>0){
              if (sales[x][0]===res[i].department_name){
              salesToPost = sales[x][1];
              
              }
            }

          }
            table.push(
                [ res[i].department_id, res[i].department_name,res[i].over_head_costs, salesToPost, salesToPost]
                
            );
        }
    
        console.log(table.toString());
        


        });

      });

    }

      

  

   