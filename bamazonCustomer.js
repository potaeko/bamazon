var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

console.log("Welcome to Bamazon!");
//connect to sql and start the products
connection.connect(function(err){
  if (err) throw err;
  start();
})

// start promopting
var start = function (){
  inquirer.prompt(
  {
    name: "welcome",
    type: "list",
    message: "Welcome, would you like to shop our products?",
    choices: ["YES", "NO"]
  }).then(function(answer) {
    if (answer.welcome.toUpperCase() == "YES"){
      ourProducts();
    }
    else {
      console.log("Goodbye");
      return;
    }
  })
};


var ourProducts = function (){
connection.query('SELECT * FROM products', function(err, res) {
    for (var i = 0; i < res.length; i++) {
      //diplay products offered
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price+" | "+res[i].stock_quantity);
    }
    console.log("-----------------------------------");
   
    // asks the next question ater 1 seconds
   nextAsk();
})
};

// prompt next questions to find out what customer wants
var nextAsk = function (){
  inquirer.prompt([
  {
    name: "productid",
    type: "list",
    message: "Choose the ID of the product you wish to purchase:",
    choices: ["1", "2", "3", "4", "5", "6", "7","8","9","10"]
  },  
  {
    name: "productunits",
    type: "input",
    message: "How many units of this product would you like to puchase?",
    validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
  }]).then(function(answer) {
    console.log("-----------CHECK OUT------------------------");
      
    var quantityInput = answer.productunits;
    var idInput = answer.productid;
    purchase(idInput, quantityInput);
  })
};

function purchase(id, quantityInput) {
   
    connection.query('SELECT * FROM products WHERE item_id = ' + id, function(error, response) {
        if (error) { console.log(error) };

        //need to use reponse[0] to get into index info, if use just response; will show an array
        if (quantityInput <= response[0].stock_quantity) {


            var totalCost = response[0].price * quantityInput;

            
            console.log("We have what you need!");
            console.log("Your total cost for " + quantityInput + " " + response[0].product_name + " is $" + totalCost +".");
         
            stock(id,quantityInput)
        } else {
            console.log("Don't Have Enough " + response[0].product_name + " Sorry~");
            
            
        };
        
    });

};

function stock(id,quantityInput){
   connection.query('UPDATE products SET stock_quantity = stock_quantity - ' + quantityInput + ' WHERE item_id = ' + id
      ,function(err,res){
        if (err)throw err; 
        else console.log("Thank you,Please Come again!");
        process.exit()})
        
}

  
