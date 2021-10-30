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

        let sql = 'SELECT C.id, C.name, C.email, C.registered_at, FROM Company C WHERE C.email = ?'; // AND D.password_hash = ?
        try {
            let query = connection.query(sql, [loginDetails.email], async (err, results) => {
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
            'username': req.body.username,
            'name': req.body.name,
            'email': req.body.email,
            'profile_photo_filepath': '',
            'website': req.body.website,
            'password': passwordHash,
            'registered_at': moment().format('YYYY-MM-DD HH:mm:ss'),
            'reviewed_admin': '',
            'status': 'PENDING',
            'rejection_reason': '',

        };

        // Check if fields needed are passed in
        if (!developer.id || !developer.username || !developer.first_name || !developer.last_name || !developer.email || !developer.contact_number || !password || !developer.registered_at || !developer.professional_title || !developer.country_id) {
            return res.status(400).json({
                'message': 'Developer registration details are incomplete, please retry registration again',
                'errorStatus': true
            });
        }

        // Check if country ID passed in is valid
        const validCountry = isValidCountry(developer.country_id);
        if (!validCountry) {
            return res.status(400).json({
                'message': 'Invalid country ID, please try again with a valid country ID',
                'errorStatus': true
            });
        }

        // Perform checking on resume and profile photo, and save to relevant folders
        const resume = req.files.resume;
        const profilePhoto = req.files.profilephoto;

        if (!resume || !profilePhoto) {
            return res.status(400).json({
                'message': 'Either the resume file or the profile photo file is missing, please reupload the resume and profile photo files',
                'errorStatus': true
            });
        }

        if (!resume.mimetype == 'application/pdf' || !profilePhoto.mimetype == 'image/jpg' || !profilePhoto.mimetype == 'image/jpeg' || !profilePhoto.mimetype == 'image/png') {
            return res.status(400).json({
                'message': 'Either the resume file or the profile photo file is not in the correct file extension, please reupload the resume and profile photo files',
                'errorStatus': true
            });
        }

        const resumePath = `./developerfiles/resume/${resume.name}`;
        const profilePhotoPath = `./developerfiles/profilephoto/${profilePhoto.name}`;

        if (fs.existsSync(resumePath) || fs.existsSync(profilePhotoPath)) {
            return res.status(400).json({
                'message': 'Either the resume file or the profile photo file already exists, please upload another file of a different name',
                'errorStatus': true
            });
        }

        try {
            resume.mv(resumePath, function (err) {
                if (err) {
                    throw err;
                    // return res.status(400).json({'message': 'An error occured when uploading resume', 'errorStatus': true});
                }
            });

            profilePhoto.mv(profilePhotoPath, function (err) {
                if (err) {
                    throw err;
                    // return res.status(400).json({'message': 'An error occured', 'errorStatus': true});
                }
            });

            // return res.status(200).json({'message': `Successfully uploaded resume with filename ${resume.name} and profile photo with filename ${profilePhoto.name}`, 'errorStatus': false});

            // Save filepaths to developer object
            developer['resume_filepath'] = resumePath;
            developer['profile_photo_filepath'] = profilePhotoPath;

            // Save to database
            sql = 'INSERT INTO Developer(id, username, first_name, last_name, email, contact_number, password_hash, registered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'; // AND D.password_hash = ?
            query = connection.query(sql, [developer.id, developer.username, developer.first_name, developer.last_name, developer.email, developer.contact_number, developer.password, developer.registered_at], (err, result) => {
                if (err) {
                    throw err;
                    // return res.status(404).json({'message': 'An error occured when creating this developer account, please try again to register', 'errorStatus': true});
                }
            });

            sql = 'INSERT INTO DeveloperProfile(id, developer_id, country_id, professional_title, description, resume_filepath, profile_photo_filepath, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'; // AND D.password_hash = ?
            query = connection.query(sql, [developer.profile_id, developer.id, developer.country_id, developer.professional_title, developer.description, developer.resume_filepath, developer.profile_photo_filepath, developer.website], (err, result) => {
                if (err) {
                    throw err;
                } else {
                    req.session.authenticated = true;
                    req.session.role = 'DEVELOPER';
                    req.session.userid = developer.id;
                    return res.status(200).json({
                        'message': 'Successful registration, created new developer account',
                        'developer': developer,
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