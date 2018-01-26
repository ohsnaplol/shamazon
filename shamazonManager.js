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

    }
    if (answers.choice === 'View Low Inventory') {

    }
    if (answers.choice === 'Add to Inventory') {

    }
    if (answers.choice === 'Add to Product') {

    }
    if (answers.choice === 'Quit') {
      return
    }
  })
}
