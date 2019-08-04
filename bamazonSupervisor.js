var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

//create connection to mysql 
//and connect to mysql

//inquirer to display the following choices to be selected by the user:

  // View Product Sales by Department
  // Create New Department

  //with the response we will then:
  //if answer = View Product Sales by Department, the app should display a summarized table in their
  // terminal/bash window.
    //total_profit column should be calculated on the fly using the difference between over_head_costs
    // and product_sales. total_profit should not be stored in any database. You should use a custom alias.

