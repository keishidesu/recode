require('dotenv').config();  // Load env variables that are set in the .env file in project directory

var mysql = require('mysql');  // Import mysql bridge

// Create database connection
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port:process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// TODO: FOR THE CONNECT FEATURE, DO WE WANT TO KEEP IT IN THIS FILE??? OR PLACE THIS FEATURE IN ANOTHER FILE???
// Connect to db
connection.connect((err) => {
    if (err) {
      throw err;
    }
    console.log(`Connected to backend database with database name: ${process.env.DB_DATABASE}`);
})

module.exports = connection;