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
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const {
    profile
} = require('console');
const {
    body: bodyVal,
    validationResult
} = require('express-validator');
var pool = require('../database/connectionpool');

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

        let sql = 'SELECT C.id, C.name, C.email, C.registered_at, C.password_hash FROM Company C, CompanyRegistration R WHERE C.email = ? AND R.status = ?'; // AND D.password_hash = ?
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
                            let cComp = results[0];
                            let retrievedComp = {
                                "companyID": cComp.id,
                                "companyName": cComp.name,
                                "companyEmail": cComp.developerEmail,
                                "companyRegisteredAt": cComp.developerRegisteredAt
                            }
                            console.log(retrievedComp);
                            return res.status(200).json({
                                'message': 'Login success!',
                                'errorStatus': false,
                                "company": retrievedComp
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
        max: 50
    }),
    bodyVal('name').isLength({
        max: 50
    }),
    bodyVal('password').isLength({
        max: 30
    }),
    bodyVal('tagline').isLength({
        max: 50
    }),
    bodyVal('description').isLength({
        max: 255
    }),
    bodyVal('website').isLength({
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
        console.log(`COMPANY: ${JSON.stringify(company)}`);

        // Check if fields needed are passed in
        console.log(!company.tagline);
        if (!company.username || !company.name || !company.email || !password || !company.website || !company.tagline || !company.description) {  //     
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

        if (!(profilePhoto.mimetype == 'image/jpg' || profilePhoto.mimetype == 'image/jpeg' || profilePhoto.mimetype == 'image/png')) {
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
            sql = 'INSERT INTO Company(id, username, name, email, password_hash, registered_at) VALUES (?, ?, ?, ?, ?, ?);'; // AND D.password_hash = ?
            query = connection.query(sql, [company.id, company.username, company.name, company.email, company.password, company.registered_at], (err, result) => {
                if (err) {
                    console.log('error in company table');
                    throw err;
                    // return res.status(404).json({'message': 'An error occured when creating this developer account, please try again to register', 'errorStatus': true});
                }

                let cpSQL = 'INSERT INTO CompanyProfile(id, company_id, tagline, description, website, profile_photo_filepath) VALUES (?, ?, ?, ?, ?, ?);'; // AND D.password_hash = ?
                let cpQuery = connection.query(cpSQL, [company.profile_id, company.id, company.tagline, company.description, company.website, company.profile_photo_filepath], (err, result) => {
                    
                    console.log('after in company profile');
                    if (err) {
                        console.log('error in company profile');
                        console.log(err, result);
                        throw err;
                    }
                    let crSQL = 'INSERT INTO CompanyRegistration(id, company_id, reviewed_admin, status, rejection_reason) VALUES (?, ?, NULL, ?, ?);'; // AND D.password_hash = ?
                    let crQuery = connection.query(crSQL, [company.registration_id, company.id,  company.status, company.rejection_reason], (err, result) => {
                        console.log('after in company registration');
                        // company.reviewed_admin,
                        if (err) {
                            console.log('error in company registration');
                            throw err;
                        }
                    });
                });

            });

            console.log('after company registration');
            return res.status(200).json({
                'message': 'Successful registration, created new company account',
                'company': company,
                'errorStatus': true
            });

            // // Save to database
            // sql = 'INSERT INTO Company(id, username, name, email, password_hash, registered_at) VALUES (?, ?, ?, ?, ?, ?)'; // AND D.password_hash = ?
            // query = await pool.query(sql, [company.id, company.username, company.name, company.email, company.password, company.registered_at], (err, result) => {
            //     if (err) {
            //         console.log('error in company table');
            //         throw err;
            //         // return res.status(404).json({'message': 'An error occured when creating this developer account, please try again to register', 'errorStatus': true});
            //     }
            // });

            // let cpSQL = 'INSERT INTO CompanyProfile(id, company_id, tagline, description, website, profile_photo_filepath) VALUES (?, ?, ?, ?, ?, ?)'; // AND D.password_hash = ?
            // let cpQuery = await pool.query(cpSQL, [company.profile_id, company.id, company.tagline, developer.description, company.website, company.profile_photo_filepath], (err, result) => {
            //     if (err) {
            //         console.log('error in company profile');
            //         console.log(err, result);
            //         throw err;
            //     }
            // });

            // console.log('after in company profile');

            // let crSQL = 'INSERT INTO CompanyRegistration(id, company_id, reviewed_admin, status, rejection_reason) VALUES (?, ?, ?, ?, ?)'; // AND D.password_hash = ?
            // let crQuery = await pool.query(crSQL, [company.registration_id, company.id, company.reviewed_admin, company.status, company.rejection_reason], (err, result) => {
            //     if (err) {
            //         console.log('error in company registration');
            //         throw err;
            //     }
            // });
            // console.log('after in company registration');
            // return res.status(200).json({
            //     'message': 'Successful registration, created new company account',
            //     'company': company,
            //     'errorStatus': true
            // });
        } catch (err) {
            return res.status(400).json({
                'message': 'An error occured',
                'error': err,
                'errorStatus': true
            });
        }
    });


// Endpoint to update a company's profilephoto
companyRouter.post('/profilephoto', async (req, res) => {
    let companyID = req.body.companyID;
    // Expects: companyID, profile photo in jpeg/png/jpg
    if (!(req.session.authenticated && req.session.role == 'COMPANY' && req.session.userid == companyID)) {
        return res.status(403).json({
            'message': 'Unauthorized to perform this action',
            'errorStatus': true
        });
    }

    const profilePhoto = req.files.profilephoto;
    if (!profilePhoto) {
        return res.status(400).json({
            'message': 'Profile photo file is missing, please reupload the profile photo file',
            'errorStatus': true
        });
    }
    if (!(profilePhoto.mimetype == 'image/jpg' || profilePhoto.mimetype == 'image/jpeg' || profilePhoto.mimetype == 'image/png')) {
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
            }
        });
        let sql = 'UPDATE CompanyProfile SET profile_photo_filepath = ? WHERE company_id = ?'; // AND D.password_hash = ?
        let query = connection.query(sql, [profilePhotoPath, req.body.companyID], (err, result) => {
            if (err) {
                throw err;
            }
            return res.status(200).json({
                'message': 'Successfully uploaded profile photo',
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

// route for company to get its profile photo
// companyRouter.get('/getprofilephoto/:filename',

//     (req, res) => {
//         // id indicates the company id
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({
//                 'message': 'Failed to get self profile photo',
//                 'errors': errors.array(),
//                 'errorStatus': true
//             });
//         }
        
//         // get profile photo file path company want
//         res.attachment(path.resolve())
//     })




// Endpoint to update a company profile account
companyRouter.put('/profile',
    bodyVal('companyID').isLength({
        min: 30,
        max: 40
    }),
    bodyVal('tagline').isLength({
        max: 50
    }),
    bodyVal('description').isLength({
        max: 255
    }),
    bodyVal('website').isLength({
        max: 100
    }),
    async (req, res) => {
        // Expects: companyID, all of the fields of a particular company (except for resume or profile photo)
        // countryID, tagline, description, website
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Failed to update profile',
                'errors': errors.array(),
                'errorStatus': true
            });
        }

        let inputFields = {
            ...req.body
        }

        console.log(`inputFields: ${inputFields}`);

        if (!inputFields.companyID) {
            return res.status(400).json({
                'message': 'Company ID is not passed in',
                'errorStatus': true
            });
        }

        let companyID = inputFields.companyID;

        if (!(req.session.role == 'COMPANY' && req.session.userid == companyID)) {
            return res.status(403).json({
                'message': 'Unauthorized to perform this action',
                'errorStatus': true
            });
        }

        try {
            let sql = 'UPDATE CompanyProfile SET tagline = ?, description = ?, website = ? WHERE company_id = ?'; // AND D.password_hash = ?
            let query = connection.query(sql, [inputFields.tagline, inputFields.description, inputFields.website, companyID], (err, result) => {
                if (err) {
                    throw err;
                }
                return res.status(200).json({
                    'message': 'Successfully updated profile',
                    'profile': inputFields,
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


// Company create their own job listings
companyRouter.post('/joblisting',
    bodyVal('companyID').isLength({
        min: 30,
        max: 40
    }),
    bodyVal('title').isLength({
        max: 50
    }),
    bodyVal('jobDescription').isLength({
        max: 2000
    }),
    bodyVal('salaryStart').isNumeric(),
    bodyVal('salaryEnd').isNumeric(),
    bodyVal('expirationDate').isLength({
        min: 5,
        max: 50
    }),
    (req, res) => {
        if (!(req.session.authenticated && req.session.role == 'COMPANY')) {
            return res.status(403).json({
                'message': 'Unauthorized to perform this action',
                'errorStatus': true
            });
        }

        // ACTIVE INTEGER WE CAN DO IT OURSELF YEET

        // Request body expects: developer user ID, application details, job listing ID
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Unable to create job application',
                'errors': errors.array(),
                'errorStatus': true
            });
        }

        let listingDetails = {
            'companyID': req.body.companyID, //originally is developerID
            'id': uuidv4(),
            'title': req.body.title,
            'salaryStart': req.body.salaryStart,
            'salaryEnd': req.body.salaryEnd,
            'jobDescription': req.body.jobDescription,
            'createdAt': moment().format('YYYY-MM-DD HH:mm:ss'),
            'expirationDate': req.body.expirationDate,
            'active': 1
        }

        try {
            let sql = 'INSERT INTO JobListing(id, company_id, title, job_description, salary_start, salary_end, created_at, expiration_date, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'; // AND D.password_hash = ?
            let query = connection.query(sql, [listingDetails.id, listingDetails.companyID, listingDetails.title, listingDetails.jobDescription, listingDetails.salaryStart, listingDetails.salaryEnd, listingDetails.createdAt, listingDetails.expirationDate, listingDetails.active], (err, result) => {
                if (err) {
                    throw err;
                }
                return res.status(200).json({
                    'message': 'Successfully created a new job listing',
                    'jobListing': listingDetails,
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
    })

// Endpoint to update a company job listing
companyRouter.put('/joblisting',
    bodyVal('companyID').isLength({
        min: 30,
        max: 40
    }),
    bodyVal('joblistingID').isLength({
        min: 30,
        max: 40
    }),
    bodyVal('title').isLength({
        max: 50
    }),
    bodyVal('jobDescription').isLength({
        max: 2000
    }),
    bodyVal('salaryStart').isNumeric(),
    bodyVal('salaryEnd').isNumeric(),
    bodyVal('expirationDate').isLength({
        max: 50
    }),
    bodyVal('active').isNumeric({
        min: 0,
        max: 1
    }),
    async (req, res) => {
        // Expects: companyID, all of the fields of a particular developer (except for resume or profile photo)
        // title, jobDescription, salaryStart, salaryEnd, expirationDate, active
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Failed to update profile',
                'errors': errors.array(),
                'errorStatus': true
            });
        }

        let inputFields = {
            ...req.body
        }

        console.log(`inputFields: ${inputFields}`);

        if (!inputFields.companyID) {
            return res.status(400).json({
                'message': 'Company ID is not passed in',
                'errorStatus': true
            });
        }

        let companyID = inputFields.companyID;

        if (!(req.session.role == 'COMPANY' && req.session.userid == companyID)) {
            return res.status(403).json({
                'message': 'Unauthorized to perform this action',
                'errorStatus': true
            });
        }

        try {
            let sql = 'UPDATE JobListing SET title = ?, job_description = ?, salary_start = ?, salary_end = ?, expiration_date = ?, active = ? WHERE id = ?'; // AND D.password_hash = ?
            let query = connection.query(sql, [inputFields.title, inputFields.jobDescription, inputFields.salaryStart, inputFields.salaryEnd, inputFields.expirationDate, inputFields.active ,inputFields.jobListingID], (err, result) => { // not found active 
                if (err) {
                    throw err;
                }
                return res.status(200).json({
                    'message': 'Successfully updated job listing',
                    'profile': inputFields,
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

// Company get their own job listing
companyRouter.get('/joblisting/:id',
    (req, res) => {
        // id indicates the company id
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Failed to get self job application',
                'errors': errors.array(),
                'errorStatus': true
            });
        }
        let companyID = req.params.id;
        if (!(req.session.authenticated && req.session.role == 'COMPANY' && req.session.userid == companyID)) {
            return res.status(403).json({
                'message': 'Unauthorized to perform this action',
                'errorStatus': true
            });
        }

        try {
            // let sql = 'SELECT L.title AS jobListingTitle, D.first_name AS developerFirstName, D.last_name AS developerLastName, D.email AS developerEmail, D.contact_number AS developerContactNumber, P.professional_title AS developerProfessionaTitle, P.description AS developerDescription, P.resume_filepath AS developerResumeFilepath, P.profile_photo_filepath AS developerProfilePhotoFilepath, P.website AS developerWebsite, Ct.name AS developerCountry, C.id AS companyId, L.id AS jobListingId, L.job_description AS jobListingDescription, L.salary_start AS jobListingSalaryStart, L.salary_end AS jobListingSalaryEnd, L.created_at AS jobListingCreateAt, L.expiration_date AS jobListingExpirationDate FROM Company C, JobListing L, JobApplication A, Developer D, DeveloperProfile P, Country Ct WHERE C.id = L.company_id AND A.job_listing_id = L.id AND A.developer_id = D.id AND P.developer_id = D.id AND P.country_id = Ct.id AND C.id = ?'; // AND D.password_hash = ?
            let sql = 'SELECT C.id AS companyID, C.name AS companyName, P.profile_photo_filepath AS companyProfilePhotoPath, J.id AS jobListingID, J.title AS companyJobListing, J.job_description AS companyJobDescription, J.salary_start AS jobListingSalaryStart, J.salary_end AS jobListingSalaryEnd, J.expiration_date AS jobListingExpirationDate FROM Company C, CompanyProfile P, JobListing J WHERE C.id = J.company_id AND P.company_id = C.id AND C.id = ?'; // AND D.password_hash = ?
            let query = connection.query(sql, [companyID], (err, result) => {
                if (err) {
                    throw err;
                }
                return res.status(200).json({
                    'jobListings': result,
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
    })

// Company get the job applications related to a job listing
companyRouter.get('/jobapplications/:joblistingid',
(req, res) => {
    // id indicates the company id
    let companyID = req.session.userid;
    let jobListingID = req.params.joblistingid;
    if (!(req.session.authenticated && req.session.role == 'COMPANY')) {
        return res.status(403).json({
            'message': 'Unauthorized to perform this action',
            'errorStatus': true
        });
    }

    try {
        // let sql = 'SELECT L.title AS jobListingTitle, D.first_name AS developerFirstName, D.last_name AS developerLastName, D.email AS developerEmail, D.contact_number AS developerContactNumber, P.professional_title AS developerProfessionaTitle, P.description AS developerDescription, P.resume_filepath AS developerResumeFilepath, P.profile_photo_filepath AS developerProfilePhotoFilepath, P.website AS developerWebsite, Ct.name AS developerCountry, C.id AS companyId, L.id AS jobListingId, L.job_description AS jobListingDescription, L.salary_start AS jobListingSalaryStart, L.salary_end AS jobListingSalaryEnd, L.created_at AS jobListingCreateAt, L.expiration_date AS jobListingExpirationDate FROM Company C, JobListing L, JobApplication A, Developer D, DeveloperProfile P, Country Ct WHERE C.id = L.company_id AND A.job_listing_id = L.id AND A.developer_id = D.id AND P.developer_id = D.id AND P.country_id = Ct.id AND C.id = ?'; // AND D.password_hash = ?
        let sql = 'SELECT C.id AS companyID, L.id AS jobListingID, A.id AS applicationID, D.first_name AS developerFirstName, D.last_name AS developerLastName, D.username AS developerUsername, D.email AS developerEmail, D.contact_number AS developerContactNumber, P.professional_title AS developerProfessionaTitle, P.description AS developerDescription, P.resume_filepath AS developerResumeFilepath, P.profile_photo_filepath AS developerProfilePhotoFilepath, P.website AS developerWebsite, Ct.name AS developerCountry, A.description AS jobApplicationDescription, A.status AS jobApplicationStatus, A.created_at AS jobApplicationCreatedAt FROM Company C, JobListing L, JobApplication A, Developer D, DeveloperProfile P, Country Ct WHERE C.id = L.company_id AND A.job_listing_id = L.id AND A.developer_id = D.id AND P.developer_id = D.id AND P.country_id = Ct.id AND C.id = ? AND L.id = ?'; // AND D.password_hash = ?
        let query = connection.query(sql, [companyID, jobListingID], (err, result) => {
            if (err) {
                throw err;
            }
            return res.status(200).json({
                'jobApplications': result,
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
})

//Approve/reject job application
companyRouter.put('/jobapplication',
    bodyVal('applicationID').isLength({
        min: 30,
        max: 40
    }),
    bodyVal('companyID').isLength({
        min: 30,
        max: 40
    }),
    bodyVal('status').isLength({
        max: 40
    }),
    function (req, res) {
        // Expects the applicationID, companyID, status
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Failed to update details for a specific job application',
                'errors': errors.array(),
                'errorStatus': true
            });
        }

        if (!req.body.applicationID || !req.body.status) {
            return res.status(400).json({
                'message': 'Update details for job application are incomplete, please try again with the fields [applicationID, companyID, status]',
                'errorStatus': true
            });
        }

        console.log(req.session);
        if (!(req.session.role == 'COMPANY' && req.session.authenticated && req.session.userid == req.body.companyID)) {
            return res.status(403).json({
                'message': 'Unauthorized to perform this action',
                'errorStatus': true
            });
        }

        try {
            let sql = 'UPDATE JobApplication SET status = ? WHERE id = ?'; // AND D.password_hash = ?
            let query = connection.query(sql, [req.body.status, req.body.applicationID], (err, result) => {
                if (err) {
                    throw err;
                }
                return res.status(200).json({
                    'message': `Successfully updated job application for application ID ${req.body.applicationID}`,
                    'updated': result,
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



// Endpoint to delete a company job listing
companyRouter.delete('/joblisting',
    bodyVal('joblistingID').isLength({
        min: 30,
        max: 40
    }),
    bodyVal('companyID').isLength({
        min: 30,
        max: 40
    }),
    async (req, res) => {
        // Expects: jobListingID, can only be deleted by the company themself
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Failed to delete job listing',
                'errors': errors.array(),
                'errorStatus': true
            });
        }

        let jobListingID = req.body.joblistingID;
        let companyID = req.body.companyID;

        console.log(`jobListingID to be deleted: ${jobListingID}`);
        console.log(`companyID: ${companyID}`);

        if (!jobListingID || !companyID) {
            return res.status(400).json({
                'message': 'Job Listing ID or Company ID is not passed in',
                'errorStatus': true
            });
        }

        if (!(req.session.authenticated && req.session.role == 'COMPANY' && req.session.userid == companyID)) {
            return res.status(403).json({
                'message': 'Unauthorized to perform this action',
                'errorStatus': true
            });
        }

        try {
            let sql = 'DELETE FROM JobListing WHERE id = ?'; // AND D.password_hash = ?
            let query = connection.query(sql, [jobListingID], (err, result) => {
                if (err) {
                    throw err;
                }
                return res.status(200).json({
                    'message': 'Successfully deleted job listing',
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


// Route for company to logout
companyRouter.get('/logout', function (req, res, next) {
    if (req.session.role != null || req.session.role != undefined) {
        delete req.session.role;
        delete req.session.authenticated;
        delete req.session.userid;
        console.log(req.session);
        return res.status(200).json({
            'message': 'Successfully logged out as company',
            'errorStatus': false
        });
    } else {
        return res.status(200).json({
            'message': 'You were not logged in before as company',
            'errorStatus': false
        });
    }
});

module.exports = companyRouter;