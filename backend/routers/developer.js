const express = require('express');
const {v4: uuidv4 } = require('uuid');
const developerRouter = express.Router();
const {hashPassword, compareHashPassword} = require('../utilities/hashPassword.js');
const connection = require('../database/connection');  // Database connection
const bcrypt = require('bcrypt');
const moment = require('moment');


// Endpoint to get test message
developerRouter.get('/', async (req, res) => {
    // TODO: this is just a basic testing route, clean this after usage
    let passw = '1234';
    let pp = await hashPassword(passw);
    console.log(hashPassword(passw));
    return res.status(200).json({'message': 'Welcome to the developers /GET route', 'TestPasswordHash': pp});
})

// Endpoint to login for this developer
developerRouter.post('/login', async (req, res) => {
    /* 
        - Get email and password
        - Hash password
        - Check from database to check if user exists
        - Return suitable message
    */

    let password = req.body.password;
    let loginDetails = {
        'email': req.body.email,
        'password': password
    }
    console.log(loginDetails);
    if (!loginDetails.email || !loginDetails.password) {
        return res.status(404).json({'msg': 'Login details are incomplete, please retry login'})
    }

    let sql = 'SELECT D.id, D.first_name, D.last_name, D.email, D.contact_number, D.registered_at, D.password_hash FROM Developer D WHERE D.email = ?';  // AND D.password_hash = ?
    let query = connection.query(sql, [loginDetails.email], async (err,results) => {
      if(err) throw err;
      if (results.length == 0) {
          return res.status(404).json({'msg': 'Login details are invalid, email for this user does not exist'})
      }
    //   console.log(`HASH: ${JSON.stringify(results[0])}`)

      const compared = await bcrypt.compare(password,results[0].password_hash).then((result)=>{
        if (result == true) {
            return res.status(200).json({'msg': 'Login success!'});
        } else {
            return res.status(404).json({'msg': 'Login failed, login details are invalid'});
        }
      })
      .catch((err)=>console.error(err))
    });
})

// Endpoint to create a new developer account
developerRouter.post('/register', (req, res) => {
    let password = req.body.password;
    let developer = {
        'id': uuidv4(),
        'username': req.body.username,
        'first_name': req.body.first_name,
        'last_name': req.body.last_name,
        'email': req.body.email,
        'contact_number': req.body.contact_number,
        'password': '13',
        'registered_at': moment().format('YYYY-MM-DD HH:mm:ss'),
        'country_id': req.body.country_id,
        'professional_title': req.body.professional_title,
        'website': req.body.website,
    }
    // 'resume_filepath': req.body.resume_filepath
    // 'last_name': hashPassword(req.body.password)

    // console.log(JSON.stringify(developer));
    // return res.json(developer);

    if (!developer.id || !developer.username || !developer.first_name || !developer.last_name || !developer.email || !developer.contact_number || !developer.password || !developer.registered_at || !developer.country_id || !developer.professional_title || !developer.country_id) {
        return res.status(404).json({'msg': 'Developer registration details are incomplete, please retry registration again'})
    }

    let sql = 'INSERT INTO Developer(id, first_name, username, last_name, email, contact_number, password_hash, registered_at)';  // AND D.password_hash = ?
    let query = connection.query(sql, [loginDetails.email], async (err,results) => {
      if(err) throw err;
      if (results.length == 0) {
          return res.status(404).json({'msg': 'Login details are invalid, email for this user does not exist'})
      }
    //   console.log(`HASH: ${JSON.stringify(results[0])}`)

      const compared = await bcrypt.compare(password,results[0].password_hash).then((result)=>{
        if (result == true) {
            return res.status(200).json({'msg': 'Login success!'});
        } else {
            return res.status(404).json({'msg': 'Login failed, login details are invalid'});
        }
      })
      .catch((err)=>console.error(err))
    });

    return res.status(200).json({'msg': 'New user created', 'user': JSON.stringify(user)});
})

developerRouter.post('/upload', (req, res) => {
    console.log(req.files.foo); // the uploaded file object
    return res.send(req.files.foo);
})

module.exports = function(connection) {
    return developerRouter;
}