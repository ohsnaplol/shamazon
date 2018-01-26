var mysql = require('mysql')
var inquirer = require('inquirer')

var connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '',
  database: 'shamazon_db'
})

showMenu()

function showMenu() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: `Manager View`,
      choices: ['View Products on Sale', 'View Low Inventory', 'Add to Intentory', 'Add to Product', 'Quit']
    }
  ]).then(function(answers) {
    if (answers.choice === 'View Products on Sale') {
      viewProducts()
    }
    if (answers.choice === 'View Low Inventory') {
      viewLowInventory()
    }
    if (answers.choice === 'Add to Inventory') {

    }
    if (answers.choice === 'Add to Product') {

    }
    if (answers.choice === 'Quit') {
      connection.end()
    }
  })
}

function viewProducts(tableName) {
  connection.query(`SELECT * FROM products`, function(error, result) {
    if (error) throw error
    for (var i = 0; i < result.length; i++) {
      console.log(`${result[i].item_id} | ${result[i].product_name} | $${result[i].price} | ${result[i].stock_quantity} available`)
    }
    showMenu()
  })
}

function viewLowInventory() {
  connection.query(`SELECT * FROM products WHERE stock_quantity < 5`, function(error, result) {
    if (error) throw error
    // If there is no low inventory,
    if (!result.length) {
      console.log('empty!')
    } else {
      for (var i = 0; i < result.length; i++) {
        console.log(`${result[i].item_id} | ${result[i].product_name} | $${result[i].price} | ${result[i].stock_quantity} available`)
      }
    }
  })
}
