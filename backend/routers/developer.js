const express = require('express');
const {v4: uuidv4 } = require('uuid');
const developerRouter = express.Router();
// const {hashPassword, compareHashPassword} = require('../utilities/hashPassword.js');
const connection = require('../database/connection');  // Database connection
const bcrypt = require('bcrypt');
const moment = require('moment');
const fs = require('fs');
const { hashPassword } = require('../utilities/hashpassword');
const saltRounds = parseInt(process.env.SALT_ROUNDS);

// Store country details in memory
let countries = [];

const setCountries = (rows) => {
    for (let c of rows) {
        countries.push({'id': c.id, 'name': c.name});
    }
}

const isValidCountry = (id) => {
    let valid = false;
    for (let c of countries) {
        if (c.id == id) {
            valid = true;
            break;
        }
    }
    return valid;
}

let getCountrySql = 'SELECT * FROM Country C;';
let getCountryQuery = connection.query(getCountrySql, (err, results) => {
  if (err) {
    throw err;
    // return res.status(404).json({'message': 'An error occured, please try again', 'error': err, 'errorStatus': true});
  }
  setCountries(results);
});

/* START WRITING RELEVANT ENDPOINTS */

// Endpoint to get test message
developerRouter.get('/', async (req, res) => {
    // TODO: this is just a basic testing route, clean this after usage
    let passw = '1234';
    let pp = await hashPassword(passw, saltRounds);
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
        return res.status(404).json({'message': 'Login details are incomplete, please retry login', 'errorStatus': true})
    }

    let sql = 'SELECT D.id, D.first_name, D.last_name, D.email, D.contact_number, D.registered_at, D.password_hash FROM Developer D WHERE D.email = ?';  // AND D.password_hash = ?
    let query = connection.query(sql, [loginDetails.email], async (err,results) => {
      if(err) throw err;
      if (results.length == 0) {
          return res.status(404).json({'message': 'Login details are invalid, email for this user does not exist', 'errorStatus': true})
      }
    //   console.log(`HASH: ${JSON.stringify(results[0])}`)

      const compared = await bcrypt.compare(password,results[0].password_hash).then((result)=>{
        if (result == true) {
            return res.status(200).json({'message': 'Login success!', 'errorStatus': false});
        } else {
            return res.status(404).json({'message': 'Login failed, login details are invalid', 'errorStatus': true});
        }
      })
      .catch((err)=>console.error(err))
    });
})

// Endpoint to register a new developer account
developerRouter.post('/register', async (req, res) => {
    let password = req.body.password;
    let passwordHash = await hashPassword(password, saltRounds);

    let developer = {
        'id': uuidv4(),
        'profile_id': uuidv4(),
        'username': req.body.username,
        'first_name': req.body.first_name,
        'last_name': req.body.last_name,
        'email': req.body.email,
        'contact_number': req.body.contact_number,
        'professional_title': req.body.professional_title,
        'resume_filepath': '',
        'profile_photo_filepath': '',
        'country_id': req.body.country_id,
        'website': req.body.website,
        'password': password,
        'registered_at': moment().format('YYYY-MM-DD HH:mm:ss')
    };

    // Check if fields needed are passed in
    if (!developer.id || !developer.username || !developer.first_name || !developer.last_name || !developer.email || !developer.contact_number || !developer.password || !developer.registered_at || !developer.professional_title || !developer.country_id) {
        return res.status(400).json({'message': 'Developer registration details are incomplete, please retry registration again', 'errorStatus': true});
    }

    // Check if country ID passed in is valid
    const validCountry = isValidCountry(developer.country_id);
    if (!validCountry) {
        return res.status(400).json({'message': 'Invalid country ID, please try again with a valid country ID', 'errorStatus': true});
    }

    // Perform checking on resume and profile photo, and save to relevant folders
    const resume = req.files.resume;
    const profilePhoto = req.files.profilephoto;

    if (!resume || !profilePhoto) {
        return res.status(400).json({'message': 'Either the resume file or the profile photo file is missing, please reupload the resume and profile photo files', 'errorStatus': true});
    }

    const resumePath = `./developerfiles/resume/${resume.name}`;
    const profilePhotoPath = `./developerfiles/profilephoto/${profilePhoto.name}`;

    if (fs.existsSync(resumePath) || fs.existsSync(profilePhotoPath)) {
        return res.status(400).json({'message': 'Either the resume file or the profile photo file already exists, please upload another file of a different name', 'errorStatus': true});
    }

    resume.mv(resumePath, function(err) {
        if (err) {
            return res.status(400).json({'message': 'An error occured when uploading resume', 'errorStatus': true});
        }
    });

    profilePhoto.mv(profilePhotoPath, function(err) {
        if (err) {
            return res.status(400).json({'message': 'An error occured', 'errorStatus': true});
        }
    });

    // return res.status(200).json({'message': `Successfully uploaded resume with filename ${resume.name} and profile photo with filename ${profilePhoto.name}`, 'errorStatus': false});
    
    // Save filepaths to developer object
    developer['resume_filepath'] = resumePath;
    developer['profile_photo_filepath'] = profilePhotoPath;

    // Save to database
    sql = 'INSERT INTO Developer(id, username, first_name, last_name, email, contact_number, password_hash, registered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';  // AND D.password_hash = ?
    query = connection.query(sql, [developer.id, developer.username, developer.first_name, developer.last_name, developer.email, developer.contact_number, developer.password, developer.registered_at], (err,result) => {
      if (err) {
        throw err;
        // return res.status(404).json({'message': 'An error occured when creating this developer account, please try again to register', 'errorStatus': true});
      }
    });

    sql = 'INSERT INTO DeveloperProfile(id, developer_id, country_id, professional_title, description, resume_filepath, profile_photo_filepath, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';  // AND D.password_hash = ?
    query = connection.query(sql, [developer.profile_id, developer.id, developer.country_id, developer.professional_title, developer.description, developer.resume_filepath, developer.profile_photo_filepath, developer.website], (err,result) => {
      if (err) {
        throw err;
      } else {
        return res.status(200).json({'message': 'Successful registration, created new developer account', 'developer': developer, 'errorStatus': true});
      }
    });
});

// Endpoint to update a developer profile account
developerRouter.put('/asdasd', async (req, res) => {
    // TODO: 
    let password = req.body.password;
    password = await hashPassword(password);
    let developer = {
        'id': uuidv4(),
        'profile_id': uuidv4(),
        'username': req.body.username,
        'first_name': req.body.first_name,
        'last_name': req.body.last_name,
        'email': req.body.email,
        'contact_number': req.body.contact_number,
        'professional_title': req.body.professional_title,
        'resume_filepath': '',
        'profile_photo_filepath': '',
        'country_id': req.body.country_id,
        'website': req.body.website,
        'password': req.body.password,
        'registered_at': moment().format('YYYY-MM-DD HH:mm:ss')
    };

    // Check if country ID is valid
    let sql = 'SELECT C.name FROM Country C';
    let query = connection.query(sql, (err,results) => {
      if (err) {
          console.log(err);
        return res.status(404).json({'message': 'An error occured, please try again', 'error': err, 'errorStatus': true});
      }

      if (results.length == 0) {
          console.log(res);
        // return res.status(404).json({'message': 'Invalid country ID, please try again with a valid country ID', 'error': err, 'errorStatus': true});
      }
    });

    const resume = req.files.resume;
    const profilePhoto = req.files.profilephoto;

    if (!resume || !profilePhoto) {
        return res.status(404).json({'message': 'Either the resume file or the profile photo file is missing, please reupload the resume and profile photo files', 'errorStatus': true});
    }

    const resumePath = `./developerfiles/resume/${resume.name}`;
    const profilePhotoPath = `./developerfiles/profilephoto/${profilePhoto.name}`;

    if (fs.existsSync(resumePath) || fs.existsSync(profilePhotoPath)) {
        return res.status(404).json({'message': 'Either the resume file or the profile photo file already exists, please upload another file of a different name', 'errorStatus': true});
    }

    if (resume.mimetype != 'application/pdf' || profilePhoto.mimetype != 'image/png' || profilePhoto.mimetype != 'image/jpeg') {
        return res.status(404).json({'message': 'Either the resume file or the profile photo file type is not suitable, please upload the resume in PDF and the profile photo in either JPEG/JPG or PNG', 'errorStatus': true});
    }

    resume.mv(resumePath, function(err) {
        if (err) {
            return res.status(404).json({'message': 'An error occured', 'error': err, 'errorStatus': true});
        }
    })

    profilePhoto.mv(profilePhotoPath, function(err) {
        if (err) {
            return res.status(404).json({'message': 'An error occured', 'error': err, 'errorStatus': true});
        }
    })

    // return res.status(200).json({'message': `Successfully uploaded resume with filename ${resume.name} and profile photo with filename ${profilePhoto.name}`, 'errorStatus': false});
    
    // Save filepaths to developer object
    developer['resume_filepath'] = resumePath;
    developer['profile_photo_filepath'] = profilePhotoPath;

    if (!developer.id || !developer.username || !developer.first_name || !developer.last_name || !developer.email || !developer.contact_number || !developer.password || !developer.registered_at || !developer.professional_title || !developer.country_id) {
        return res.status(404).json({'message': 'Developer registration details are incomplete, please retry registration again', 'errorStatus': true})
    }

    sql = 'INSERT INTO Developer(id, first_name, username, last_name, email, contact_number, password_hash, registered_at) VALUES (?, ?, ?, ?, ?, ?)';  // AND D.password_hash = ?
    query = connection.query(sql, [developer.id, developer.first_name, developer.username, developer.last_name, developer.email, developer.password_hash, developer.registered_at], (err,result) => {
      if (err) {
        return res.status(404).json({'message': 'An error occured when creating this developer account, please try again to register', 'error': err, 'errorStatus': true})
      }
    });

    sql = 'INSERT INTO DeveloperProfile(id, developer_id, country_id, professional_tile, description, resume_filepath, profile_photo_filepath, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';  // AND D.password_hash = ?
    query = connection.query(sql, [developer.profile_id, developer.id, developer.country_id, developer.professional_title, developer.description, developer.resume_filepath, developer.profile_photo_filepath, developer.website], (err,result) => {
      if (err) {
        return res.status(404).json({'message': 'An error occured when creating this developer account, please try again to register', 'error': err, 'errorStatus': true})
      }
    });

    return res.status(200).json({'message': 'Successful registration, created new developer account', 'developer': developer, 'errorStatus': true});
});

developerRouter.post('/upload', (req, res) => {
    const resume = req.files.resume;
    const profilePhoto = req.files.profilephoto;

    if (!resume || !profilePhoto) {
        return res.status(404).json({'message': 'Either the resume file or the profile photo file is missing, please reupload the resume and profile photo files', 'errorStatus': true});
    }

    const resumePath = `./developerfiles/resume/${resume.name}`;
    const profilePhotoPath = `./developerfiles/profilephoto/${profilePhoto.name}`;


    if (fs.existsSync(resumePath) || fs.existsSync(profilePhotoPath)) {
        return res.status(404).json({'message': 'Either the resume file or the profile photo file already exists, please upload another file of a different name', 'errorStatus': true});
    }

    resume.mv(resumePath, function(err) {
        if (err) {
            return res.status(404).json({'message': 'An error occured', 'error': err, 'errorStatus': true});
        }
    })

    profilePhoto.mv(profilePhotoPath, function(err) {
        if (err) {
            return res.status(404).json({'message': 'An error occured', 'error': err, 'errorStatus': true});
        }
    })

    return res.status(200).json({'message': `Successfully uploaded resume with filename ${resume.name} and profile photo with filename ${profilePhoto.name}`, 'errorStatus': false});
})

module.exports = function(connection) {
    return developerRouter;
}