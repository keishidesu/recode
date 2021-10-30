const express = require('express');
const {
    v4: uuidv4
} = require('uuid');
const developerRouter = express.Router();
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
    bodyVal,
    validationResult
} = require('express-validator'); // TODO: express validator


// Store country details in memory
let countries = [];

const setCountries = (rows) => {
    for (let c of rows) {
        countries.push({
            'id': c.id,
            'name': c.name
        });
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
    }
    setCountries(results);
});

/* START WRITING RELEVANT ENDPOINTS - DEVELOPER ACCOUNTS*/

// Endpoint to login for this developer
developerRouter.post('/login',
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

        let sql = 'SELECT D.id, D.first_name, D.last_name, D.email, D.contact_number, D.registered_at, D.password_hash FROM Developer D WHERE D.email = ?'; // AND D.password_hash = ?
        try {
            let query = connection.query(sql, [loginDetails.email], async (err, results) => {
                if (err) throw err;
                if (results.length == 0) {
                    return res.status(400).json({
                        'message': 'Login details are invalid, email for this user does not exist',
                        'errorStatus': true
                    })
                }
                const compared = await bcrypt.compare(password, results[0].password_hash).then((result) => {
                        if (result == true) {
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

// Endpoint to register a new developer account
developerRouter.post('/register',
    bodyVal('username').isLength({
        min: 6,
        max: 50
    }),
    bodyVal('first_name').isLength({
        min: 6,
        max: 50
    }),
    bodyVal('last_name').isLength({
        min: 6,
        max: 50
    }),
    bodyVal('contact_number').isNumeric({
        min: 10,
        max: 15
    }),
    bodyVal('professional_title').isLength({
        min: 10,
        max: 100
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
    bodyVal('password').isLength({
        min: 6,
        max: 30
    }),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Login failed',
                'errors': errors.array(),
                'errorStatus': true
            });
        }

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
            'password': passwordHash,
            'registered_at': moment().format('YYYY-MM-DD HH:mm:ss')
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

// Endpoint to update a developer profile account
developerRouter.put('/profile',
    bodyVal('developerID').isLength({
        min: 30,
        max: 40
    }),
    bodyVal('professional_title').isLength({
        min: 10,
        max: 100
    }),
    bodyVal('description').isLength({
        min: 10,
        max: 255
    }),
    bodyVal('website').isLength({
        min: 5,
        max: 100
    }),
    async (req, res) => {
        // Expects: developerID, all of the fields of a particular developer (except for resume or profile photo)
        // countryID, professionalTitle, description, website
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Login failed',
                'errors': errors.array(),
                'errorStatus': true
            });
        }


        let inputFields = {
            ...req.body
        }

        if (!inputFields.developerID) {
            return res.status(400).json({
                'message': 'Developer ID is not passed in',
                'errorStatus': true
            });
        }

        let developerID = inputFields.developerID;

        try {
            let sql = 'UPDATE DeveloperProfile SET country_id = ?, professional_title = ?, description = ?, website = ? WHERE developer_id = ?'; // AND D.password_hash = ?
            let query = connection.query(sql, [inputFields.countryID, inputFields.professional_title, inputFields.description, inputFields.website, developerID], (err, result) => {
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

// Endpoint to update a developer's resume PDF
developerRouter.post('/resume', async (req, res) => {
    // Expects: developerID, resume in PDF
    const resume = req.files.resume;
    if (!resume) {
        return res.status(400).json({
            'message': 'Resume file is missing, please reupload the resume file',
            'errorStatus': true
        });
    }
    if (!resume.mimetype == 'application/pdf') {
        return res.status(400).json({
            'message': 'Resume file is not in the correct file extension, please reupload the resume file',
            'errorStatus': true
        });
    }

    const resumePath = `./developerfiles/resume/${resume.name}`;
    if (fs.existsSync(resumePath)) {
        return res.status(400).json({
            'message': 'The resume file already exists, please upload another file of a different name',
            'errorStatus': true
        });
    }

    try {
        resume.mv(resumePath, function (err) {
            if (err) {
                throw err;
            }
        });
        let sql = 'UPDATE DeveloperProfile SET resume_filepath = ? WHERE developer_id = ?'; // AND D.password_hash = ?
        let query = connection.query(sql, [resumePath, req.body.developerID], (err, result) => {
            if (err) {
                throw err;
            }
            return res.status(200).json({
                'message': 'Successfully uploaded resume',
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

// Endpoint to update a developer's profilephoto
developerRouter.post('/profilephoto', async (req, res) => {
    // Expects: developerID, profile photo in jpeg/png/jpg
    const profilePhoto = req.files.profilephoto;
    if (!profilePhoto) {
        return res.status(400).json({
            'message': 'Profile photo file is missing, please reupload the profile photo file',
            'errorStatus': true
        });
    }
    if (!profilePhoto.mimetype == 'image/jpg' || !profilePhoto.mimetype == 'image/jpeg' || !profilePhoto.mimetype == 'image/png') {
        return res.status(400).json({
            'message': 'The profile photo file is not in the correct file extension, please reupload the profile photo file',
            'errorStatus': true
        });
    }

    const profilePhotoPath = `./developerfiles/resume/${profilePhoto.name}`;
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
        let sql = 'UPDATE DeveloperProfile SET profile_photo_filepath = ? WHERE developer_id = ?'; // AND D.password_hash = ?
        let query = connection.query(sql, [profilePhotoPath, req.body.developerID], (err, result) => {
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

// Developer get their own job applications
developerRouter.get('/applications/:id',
    bodyVal('developerID').isLength({
        min: 30,
        max: 40
    }),
    (req, res) => {
        // id indicates the developer id
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Login failed',
                'errors': errors.array(),
                'errorStatus': true
            });
        }


        let developerID = req.params.id;

        try {
            let sql = 'SELECT D.id AS developerID, J.id AS jobApplicationID, L.id AS jobListingID, J.description AS jobApplicationDescription, J.status AS jobApplicationStatus, J.created_at AS jobApplicationCreatedAt, L.title AS jobListingTitle, L.job_description AS jobListingDescription, L.salary_start AS jobListingSalaryStart, L.salary_end AS jobListingSalaryEnd, L.created_at AS jobListingCreatedAt, L.expiration_date AS jobListingExpirationDate, L.active AS jobListingActiveStatus, C.name AS companyName, C.email AS companyEmail, C.registered_at AS companyRegisteredAt FROM Developer D, JobApplication J, JobListing L, Company C WHERE D.id = J.developer_id AND J.job_listing_id = L.id AND L.company_id = C.id AND D.id = ?'; // AND D.password_hash = ?
            let query = connection.query(sql, [developerID], (err, result) => {
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

// Developer create their own job applications
developerRouter.post('/application',
    bodyVal('developerID').isLength({
        min: 30,
        max: 40
    }),
    bodyVal('jobListingID').isLength({
        min: 30,
        max: 40
    }),
    bodyVal('description').isLength({
        max: 255
    }),
    (req, res) => {
        // Request body expects: developer user ID, application details, job listing ID
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Login failed',
                'errors': errors.array(),
                'errorStatus': true
            });
        }

        let applicationDetails = {
            'developerID': req.params.developerID,
            'id': uuidv4(),
            'jobListingID': req.params.jobListingID,
            'description': req.params.description,
            'status': 'PENDING',
            'created_at': moment().format('YYYY-MM-DD HH:mm:ss')
        }
        try {
            let sql = 'INSERT INTO JobApplication(id, job_listing_id, developer_id, description, status, created_at) VALUES (?, ?, ?, ?, ?, ?)'; // AND D.password_hash = ?
            let query = connection.query(sql, [applicationDetails.id, applicationDetails.jobListingID, applicationDetails.developerID, applicationDetails.description, applicationDetails.status, applicationDetails.created_at], (err, result) => {
                if (err) {
                    throw err;
                }
                return res.status(200).json({
                    'message': 'Successfully created a new job application',
                    'jobApplication': applicationDetails,
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


/* Country routes here */

// Get all countries
developerRouter.get('/countries', (req, res) => {
    res.status(200).json({
        'countries': countries
    });
})

// Create new country
developerRouter.post('/country',
    bodyVal('name').isLength({
        min: 2,
        max: 50
    }),
    (req, res) => {
        // Requires admin privilege

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Login failed',
                'errors': errors.array(),
                'errorStatus': true
            });
        }


        let name = req.params.name;
        if (!name) {
            return res.status(400).json({
                'message': 'No name attached for creating a new country',
                'errorStatus': true
            });
        }

        let country = {
            'id': uuidv4(),
            'name': name
        }
        countries.push(country);
        try {
            let sql = 'INSERT INTO Country(id, name) VALUES (?, ?)';
            let query = connection.query(sql, [country.id, country.name], (err, result) => {
                if (err) {
                    throw err;
                }
                return res.status(200).json({
                    'message': 'Successfully created a new country',
                    'country': country,
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

module.exports = developerRouter;