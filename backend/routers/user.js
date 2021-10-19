const express = require('express');
const {v4: uuidv4 } = require('uuid');
const userRouter = express.Router();
// const connection = require('../database/connection');  // Database connection

// Endpoint to get all users
userRouter.get('/', (req, res) => {
    res.status(200).json({'message': 'Welcome to the users /GET route'})
})

// Endpoint to create a new user
userRouter.post('/', (req, res) => {
    let user = {
        'id': uuidv4(),
        'name': req.body.name,
        'username': req.body.username,
        'email': req.body.email,
        'password': req.body.password
    };
  
    if (!user.name || !user.username || !user.email || !user.password) {
        res.status(404).json({'msg': 'user details are incomplete, please retry registration'})
        return
    }

    res.status(200).json({'msg': 'New user created', 'user': JSON.stringify(user)});
})

module.exports = function(connection) {
    return userRouter;
}