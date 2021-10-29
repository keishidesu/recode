const express = require('express');
const {v4: uuidv4 } = require('uuid');
const connection = require('../database/connection');
const companyRegisterRouter = express.Router();


userRouter.post('/', (req, res) => {
    let company = {
        'id': uuidv4(),
        'companyName': req.body.name,
        'email': req.body.email,
        'password': req.body.password
    };
  
    if (!company.name || !company.username || !company.email || !company.password) {
        res.status(404).json({'msg': 'Company details are incomplete, please retry registration'})
        return
    }

    res.status(200).json({'msg': 'New company created', 'company': JSON.stringify(company)});
})