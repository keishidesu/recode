require('dotenv').config(); // Load env variables that are set in the .env file in project directory
var mysql = require('mysql'); // Import mysql bridge
var util = require('util');

var pool = mysql.createPool({
    connectionLimit : process.env.DB_CONNECTION_LIMIT, // default:10
    host     : process.env.DB_HOST,
    port: process.env.DB_PORT,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
  })
  

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    
    if (connection) connection.release()
    
     return
     })
    
// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query);
module.exports = pool;