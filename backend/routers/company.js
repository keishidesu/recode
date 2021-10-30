const express = require('express');
const {
    v4: uuidv4
} = require('uuid');
const companyRouter = express.Router();
// const {hashPassword, compareHashPassword} = require('../utilities/hashPassword.js');
const connection = require('../database/connection'); // Database connection
const bcrypt = require('bcrypt');
const moment = require('moment');
const fs = require('fs');
const {
    hashPassword,
    compareHashPassword
} = require('../utilities/hashpassword');
const {
    profile
} = require('console');
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const {
    body: bodyVal,
    validationResult
} = require('express-validator');





module.exports = companyRouter;