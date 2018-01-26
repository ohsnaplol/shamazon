var mysql = require('mysql')
var inquirer = require('inquirer')

var connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '',
  database: 'shamazon_db'
})

printTable('products')

function promptUser(callback) {
  inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: `Type the id of the product you'd like to buy`
    },
    {
      type: 'input',
      name: 'quantity',
      message: `Quantity?`
    }
  ]).then(function(answers) {
    purchase(answers.id, answers.quantity)
  })
}

function purchase(id, quantity) {
  if (quantity > 0) {
    connection.query(`SELECT stock_quantity,price FROM products WHERE item_id = ${id}`, function(error, result) {
      if (error) throw error
      // if there is enough stock
      if (result[0].stock_quantity >= quantity) {
        console.log(`Purchase successful`)
        // subtract quantity from stock_quantity
        connection.query(`UPDATE products SET stock_quantity = stock_quantity - ${quantity} WHERE item_id = ${id}`)
        // show how much it cost
        console.log(`Thank you for your purchase of ${quantity * result[0].price}`)
      } else {
        console.log(`We don't have enough of this item to fulfill your order`)
      }
      connection.end()
    })
  } else {
    console.error(`Quantity you want is less than 0`)
  }
}

function printTable(tableName) {
  connection.query(`SELECT * FROM ${tableName}`, function(error, result) {
    if (error) throw error
    for (var i = 0; i < result.length; i++) {
      console.log(`${result[i].item_id} | ${result[i].product_name} | $${result[i].price}`)
    }
    promptUser() // Shouldn't be here but until I can figure out callbacks it stays here
  })
}
