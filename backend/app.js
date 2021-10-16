// Configuration variables
const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000

// Import routers
var userRouter = require('./routers/user')


// Configure middleware
app.use(express.json());  // parse JSON data
app.use(express.urlencoded({ extended: true }));  // parse urlencoded request body


// Use routers
app.use('/numbers', userRouter)


// Default route for backend
app.get('/', (req, res) => {
    res.status(200).send('Welcome to NotFiverr backend')
})

// Listen at stated port
app.listen(port, () => {
  console.log(`Backend is listening at http://localhost:${port}`);
})