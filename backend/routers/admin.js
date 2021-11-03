const express = require('express');
const {
    v4: uuidv4
} = require('uuid');
const adminRouter = express.Router();
// const {hashPassword, compareHashPassword} = require('../utilities/hashPassword.js');
const connection = require('../database/connection'); // Database connection
const bcrypt = require('bcrypt');
const moment = require('moment');
const saltRounds = parseInt(process.env.SALT_ROUNDS);
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
adminRouter.post('/login',
    bodyVal('email').isEmail().normalizeEmail(),
    bodyVal('password').isLength({
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

        let sql = 'SELECT A.id, A.first_name, A.last_name, A.email, A.registered_at, A.password_hash FROM Admin A WHERE A.email = ?'; // AND D.password_hash = ?
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
                            req.session.role = 'ADMIN';
                            req.session.userid = results[0].id;
                            // req.session.
                            console.log(req.session);
                            console.log(results);
                            let cAd = results[0];
                            let retrievedAdmin = {
                                "adminID": cAd.id,
                                "adminFirstName": cAd.first_name,
                                "adminLastName": cAd.last_name,
                                "adminEmail": cAd.email,
                                "adminRegisteredAt": cAd.registered_at
                            }
                            console.log(retrievedAdmin);
                            return res.status(200).json({
                                'message': 'Login success!',
                                'errorStatus': false,
                                'admin': retrievedAdmin
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

// Route for admin to get company registrations
adminRouter.get('/companyregistrations', function (req, res) {
    console.log(req.session);
    if (!(req.session.role == 'ADMIN' && req.session.authenticated)) {
        return res.status(403).json({
            'message': 'Unauthorized to perform this action',
            'errorStatus': true
        });
    }

    try {
        let sql = 'SELECT C.id AS companyID, C.name AS companyName, P.profile_photo_filepath AS companyProfilePhotoPath, C.email AS companyEmail, C.registered_at AS companyRegisteredAt, R.id AS companyRegistrationID, R.reviewed_admin AS companyRegistrationReviewerAdminID, A.username AS companyRegistrationReviewerAdminUsername, R.status AS companyRegistrationStatus, R.rejection_reason AS companyRegistrationRejectionReason FROM Company C, CompanyProfile P, CompanyRegistration R, Admin A WHERE C.id = R.company_id AND A.id = R.reviewed_admin AND C.id = P.company_id;'; // AND D.password_hash = ?
        let query = connection.query(sql, (err, result) => {
            if (err) {
                throw err;
            }
            return res.status(200).json({
                'message': 'Succesfully retrieved company registrations',
                'companyRegistrations': result,
                'errorStatus': false
            });
        });
    } catch (err) {
        return res.status(400).json({
            'message': 'An error occured',
            'error': err,
            'errorStatus': true
        });
    }
});

// Route for admin to update a specific company registrations
adminRouter.put('/companyregistration',
    bodyVal('companyRegistrationID').isLength({
        min: 30,
        max: 40
    }),
    bodyVal('status').isLength({
        max: 100
    }),
    bodyVal('rejectionReason').isLength({
        max: 100
    }),
    function (req, res) {
        // Expects the companyRegistrationID, status, rejectionReason
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Failed to update details for a specific company registration',
                'errors': errors.array(),
                'errorStatus': true
            });
        }

        if (!req.body.companyRegistrationID || !req.body.status || !req.body.rejectionReason) {
            return res.status(400).json({
                'message': 'Update details for company registration are incomplete, please try again with the fields [companyRegistrationID, status, companyID]',
                'errorStatus': true
            });
        }

        console.log(req.session);
        if (!(req.session.role == 'ADMIN' && req.session.authenticated)) {
            return res.status(403).json({
                'message': 'Unauthorized to perform this action',
                'errorStatus': true
            });
        }

        let userid = req.session.userid;

        try {
            let sql = 'UPDATE CompanyRegistration SET reviewed_admin = ?, status = ?, rejection_reason = ? WHERE id = ?'; // AND D.password_hash = ?
            let query = connection.query(sql, [userid, req.body.status, req.body.rejectionReason, req.body.companyRegistrationID], (err, result) => {
                if (err) {
                    throw err;
                }
                return res.status(200).json({
                    'message': `Successfully updated company registration for registration ID ${req.body.companyRegistrationID}`,
                    'inserted': result,
                    'errorStatus': false
                });
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
adminRouter.get('/logout', function (req, res, next) {
    if (req.session.role != null || req.session.role != undefined) {
        delete req.session.role;
        delete req.session.authenticated;
        delete req.session.userid;
        console.log(req.session);
        return res.status(200).json({
            'message': 'Successfully logged out as admin',
            'errorStatus': false
        });
    } else {
        return res.status(200).json({
            'message': 'You were not logged in before as admin',
            'errorStatus': false
        });
    }
});

module.exports = adminRouter;