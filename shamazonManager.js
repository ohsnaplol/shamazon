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
      choices: ['View Products on Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Quit']
    }
  ]).then(function(answers) {
    if (answers.choice === 'View Products on Sale') {
      viewProducts()
    }
    if (answers.choice === 'View Low Inventory') {
      viewLowInventory()
    }
    if (answers.choice === 'Add to Inventory') {
      console.log('add to inventory chosen')
      addToInventory()
    }
    if (answers.choice === 'Add New Product') {
      addNewProduct()
    }
    if (answers.choice === 'Quit') {
      connection.end()
    }
  })
}

function viewProducts() {
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
      console.log('No products in inventory have a quantity less than 5')
    } else {
      for (var i = 0; i < result.length; i++) {
        console.log(`${result[i].item_id} | ${result[i].product_name} | $${result[i].price} | ${result[i].stock_quantity} available`)
      }
    }
    showMenu()
  })
}

function addToInventory() {
  // get list of products
  connection.query(`SELECT * FROM products`, function(error, result) {
    var choicesArr = []
    if (error) throw error
    for (var i = 0; i < result.length; i++) {
      choicesArr.push(result[i].product_name)
    }
    inquirer.prompt([
      {
        name: 'new_product',
        type: 'list',
        message: 'Which item would you like to add inventory to?',
        choices: choicesArr
      },
      {
        name: 'quantity',
        type: 'input',
        message: 'How many would you like to add?'
      }
    ]).then(function(answers) {
      console.log(`You chose ${answers.new_product} with quantity ${answers.quantity}`)
      connection.query(`UPDATE products SET stock_quantity = stock_quantity + ${answers.quantity} WHERE product_name = '${answers.new_product}'`) // updates product by name instead of by id. This should be changed
      showMenu()
    })
  })
}

function addNewProduct() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'product_name',
      message: 'Enter the name of the new product'
    },
    {
      type: 'input',
      name: 'department_name',
      message: 'Enter the department name'
    },
    {
      type: 'input',
      name: 'price',
      message: 'Enter the price of the item'
    },
    {
      type: 'input',
      name: 'quantity',
      message: 'How many do you have of this item?'
    },
  ]).then(function(answers) {
    connection.query(`INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES('${answers.product_name}', '${answers.department_name}', ${answers.price}, ${answers.quantity})`)
  })
  showMenu()
}
