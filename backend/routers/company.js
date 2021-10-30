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
const {
    body: bodyVal,
    validationResult
} = require('express-validator');


// Endpoint to login for this admin
companyRouter.post('/login',
    bodyVal('email').isEmail().normalizeEmail(),
    bodyVal('password').isLength({
        min: 6,
        max: 30
    }),
    async (req, res) => {
        /* 
            - Get email and password
            - Hash password
            - Check from database to check if user exists
            - Return suitable message
        */
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Login failed',
                'errors': errors.array(),
                'errorStatus': true
            });
        }


        let password = req.body.password;
        let loginDetails = {
            'email': req.body.email,
            'password': password
        }
        // console.log(loginDetails);
        if (!loginDetails.email || !loginDetails.password) {
            return res.status(400).json({
                'message': 'Login details are incomplete, please retry login',
                'errorStatus': true
            })
        }

        let sql = 'SELECT C.id, C.name, C.email, C.registered_at FROM Company C, CompanyRegistration R WHERE C.email = ? AND R.status = ?'; // AND D.password_hash = ?
        try {
            let query = connection.query(sql, [loginDetails.email, "APPROVED"], async (err, results) => {
                if (err) throw err;
                if (results.length == 0) {
                    return res.status(400).json({
                        'message': 'Login details are invalid, email for this admin does not exist',
                        'errorStatus': true
                    })
                }
                const compared = await bcrypt.compare(password, results[0].password_hash).then((result) => {
                        if (result == true) {
                            req.session.authenticated = true;
                            req.session.role = 'COMPANY';
                            req.session.userid = results[0].id;
                            // req.session.
                            console.log(req.session);
                            console.log(results);
                            return res.status(200).json({
                                'message': 'Login success!',
                                'errorStatus': false
                            });
                        } else {
                            return res.status(400).json({
                                'message': 'Login failed, login details are invalid',
                                'errorStatus': true
                            });
                        }
                    })
                    .catch((err) => console.error(err))
            });
        } catch (err) {
            return res.status(400).json({
                'message': 'An error occured',
                'error': err,
                'errorStatus': true
            });
        }
    })

// Endpoint to register a new company account
companyRouter.post('/register',
    bodyVal('username').isLength({
        min: 6,
        max: 50
    }),
    bodyVal('name').isLength({
        min: 6,
        max: 50
    }),
    bodyVal('password').isLength({
        min: 6,
        max: 30
    }),
    bodyVal('tagline').isLength({
        max: 50
    }),
    bodyVal('description').isLength({
        min: 10,
        max: 255
    }),
    bodyVal('website').isLength({
        min: 5,
        max: 100
    }),
    bodyVal('email').isEmail().normalizeEmail(),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Registration failed',
                'errors': errors.array(),
                'errorStatus': true
            });
        }

        let password = req.body.password;
        let passwordHash = await hashPassword(password, saltRounds);

        // HALF WAY THROUH HERE
        let company = {
            'id': uuidv4(),
            'profile_id': uuidv4(),
            'registration_id': uuidv4(),
            'username': req.body.username,
            'name': req.body.name,
            'email': req.body.email,
            'website': req.body.website,
            'password': passwordHash,
            'registered_at': moment().format('YYYY-MM-DD HH:mm:ss'),
            'reviewed_admin': '',
            'status': 'PENDING',
            'rejection_reason': '',
            'tagline': req.body.tagline,
            'description': req.body.description,
            'profile_photo_filepath': ''
        };

        // Check if fields needed are passed in
        if (!company.id || !company.profile_id || !company.username || !company.name || !company.email || company.profile_photo_filepath || !password || !company.website || !company.tagline || !company.description) {
            return res.status(400).json({
                'message': 'Company registration details are incomplete, please retry registration again',
                'errorStatus': true
            });
        }

        // Perform checking on profile photo, and save to relevant folders
        const profilePhoto = req.files.profilephoto;

        if (!profilePhoto) {
            return res.status(400).json({
                'message': 'The profile photo file is missing, please reupload the profile photo file',
                'errorStatus': true
            });
        }

        if (!profilePhoto.mimetype == 'image/jpg' || !profilePhoto.mimetype == 'image/jpeg' || !profilePhoto.mimetype == 'image/png') {
            return res.status(400).json({
                'message': 'The profile photo file is not in the correct file extension, please reupload the profile photo file',
                'errorStatus': true
            });
        }

        const profilePhotoPath = `./companyfiles/profilephoto/${profilePhoto.name}`;

        if (fs.existsSync(profilePhotoPath)) {
            return res.status(400).json({
                'message': 'The profile photo file already exists, please upload another file of a different name',
                'errorStatus': true
            });
        }

        try {
            profilePhoto.mv(profilePhotoPath, function (err) {
                if (err) {
                    throw err;
                    // return res.status(400).json({'message': 'An error occured', 'errorStatus': true});
                }
            });

            // return res.status(200).json({'message': `Successfully uploaded resume with filename ${resume.name} and profile photo with filename ${profilePhoto.name}`, 'errorStatus': false});

            // Save filepath to company object
            company.profile_photo_filepath = profilePhotoPath;

            // Save to database
            sql = 'INSERT INTO Company(id, username, name, email, password_hash, registered_at) VALUES (?, ?, ?, ?, ?, ?)'; // AND D.password_hash = ?
            query = connection.query(sql, [company.id, company.username, company.name, company.email, company.password, company.registered_at], (err, result) => {
                if (err) {
                    throw err;
                    // return res.status(404).json({'message': 'An error occured when creating this developer account, please try again to register', 'errorStatus': true});
                }
            });

            sql = 'INSERT INTO CompanyProfile(id, company_id, tagline, description, website, profile_photo_filepath) VALUES (?, ?, ?, ?, ?, ?)'; // AND D.password_hash = ?
            query = connection.query(sql, [company.profile_id, company.id, company.tagline, developer.description, company.website, developer.profile_photo_filepath], (err, result) => {
                if (err) {
                    throw err;
                }
            });

            sql = 'INSERT INTO CompanyRegistration(id, company_id, reviewed_admin, status, rejection_reason) VALUES (?, ?, ?, ?, ?)'; // AND D.password_hash = ?
            query = connection.query(sql, [company.registration_id, company.id, company.reviewed_admin, company.status, company.rejection_reason], (err, result) => {
                if (err) {
                    throw err;
                } else {
                    return res.status(200).json({
                        'message': 'Successful registration, created new company account',
                        'company': company,
                        'errorStatus': true
                    });
                }
            });
        } catch (err) {
            return res.status(400).json({
                'message': 'An error occured',
                'error': err,
                'errorStatus': true
            });
        }
    });


// Route for admin to logout
companyRouter.get('/logout', function (req, res, next) {
    delete req.session.role;
    delete req.session.authenticated;
    delete req.session.userid;
    console.log(req.session);
    return res.status(200).json({
        'message': 'Successfully logged out as company',
        'errorStatus': false
    });
});

module.exports = companyRouter;