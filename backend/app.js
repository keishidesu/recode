require('dotenv').config(); // Load env variables that are set in the .env file in project directory

// Configuration variables
const express = require('express')
const mysql = require('mysql')
const {
  DEC8_BIN
} = require('mysql/lib/protocol/constants/charsets');
const app = express()
const port = process.env.BACKEND_PORT || 9000;
const connection = require('./database/connection'); // Database connection

// Import routers
var userRouter = require('./routers/user')(connection);




// Configure middlewares
app.use(express.json()); // parse JSON data
app.use(express.urlencoded({
  extended: true
})); // parse urlencoded request body


// Use routers
app.use('/users', userRouter)


// Default route for backend
app.get('/', (req, res) => {
  res.status(200).send('Welcome to NotFiverr backend')
})

// Listen at stated port
app.listen(port, () => {
  console.log(`Backend is listening at http://localhost:${port}`);
})
// For the app, host at port 9000 if port is undefined in .env file




/* ######## SAMPLE CODES FOR REFERENCE ALL OF THEM COME HERE ######## */

/* ****** SAMPLE CODE FOR QUERYING DATABASE ****** */
// // Connect to db
// connection.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Connected to db');
// })

// // Default route for backend
// app.get('/', (req, res) => {
//   let sql = 'SELECT * FROM employees WHERE emp_no = 10001;';
//   connection.query(sql, (err, result) => {
//     if (err) throw err;
//     // console.log(result);
//     res.status(200).send(result[0]);
//   })


//   // 'select * from employees limit 10;    '
//   // res.status(200).send('Welcome to NotFiverr backend')
// })

// // Default route for backend
// app.post('/', async (req, res) => {
//   let newEmployee = req.body;
//   // console.log(newEmployee);

//   let sql = 'INSERT INTO employees SET ?';
//   let success = false;
//   await connection.query(sql, newEmployee, (err, result) => {
//     if (err) {
//       throw err;
//     } else {
//       // Successful insert
//       success = true;
//       console.log(success);
//     }
//     console.log(result);
//     // res.status(200).send(result);

//     if (success) {
//       res.status(200).send('Successfully inserted new employee')
//     } else {
//       res.status(200).send('FAIL')
//     }
//   })
//   // 'select * from employees limit 10;    '

// })

/* ****** SAMPLE CODE FOR DEALING WITH EXPRESS SESSIONS ****** */
