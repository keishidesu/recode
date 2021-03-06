const express = require('express');
const {
    v4: uuidv4
} = require('uuid');
const developerRouter = express.Router();
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
var pool = require('../database/connectionpool');
var path = require("path");
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

// const getCountries = async () => {
//     let sql = 'SELECT * FROM Country C;';
//     let result = await pool.query(sql, function(err) {
//         if (err) throw err;
//     })
//     return result;
// }

let getCountrySql = 'SELECT * FROM Country C;';
let getCountryQuery = connection.query(getCountrySql, (err, results) => {
    if (err) {
        throw err;
    }
    setCountries(results);
});

/* START WRITING RELEVANT ENDPOINTS - DEVELOPER ACCOUNTS*/
developerRouter.get('/', async(req, res) => {
    // Endpoint to get logged in user's detail, only for logged in
    // if (!(req.session.authenticated && req.session.role == 'DEVELOPER')) {
    //     return res.status(403).json({
    //         'message': 'Unauthorized to perform this action',
    //         'errorStatus': true
    //     });
    // }
    let userid = req.session.userid;
    if (req.session.userid) {
        let sql = 'SELECT D.first_name AS developerFirstName, D.last_name AS developerLastName, D.contact_number AS developerContact, D.username AS developerUsername, D.email AS developerEmail, D.registered_at AS developerRegisteredAt, P.professional_title AS developerProfessionalTitle, P.description as developerDescription, P.resume_filepath AS developerResumeFilepath, P.profile_photo_filepath AS developerProfilePhotoFilepath, P.website AS developerWebsite, C.name AS country FROM Developer D, DeveloperProfile P, Country C WHERE D.id = P.developer_id AND P.country_id = C.id AND D.id = ?;';
        let query = connection.query(sql, [userid], (err, results) => {
          if (err) throw err;
          // console.log(results);
          if (results.length == 0) {
            return res.status(400).json({
              'message': `No developer with id '${userid}' found in re:code.`,
              'errorStatus': true
            });
          } else {
            return res.status(200).json(results);  // [0]
          }
        });
    }
})

// route for developer to get their resume file
developerRouter.get('/getresume/:filename',
    (req, res) => {
        // filename indicates the pdf resume filename
        let filename = req.params.filename;
        folder_path = path.join(__dirname, '..', 'developerfiles', 'resume');
        res.download(file_path); // Set disposition and send it.
    })

// Endpoint to login for this developer
developerRouter.post('/login',
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


        // let regSql = "SELECT * FROM Developer WHERE email = ?;";
        // // let registeredBefore = await pool.query(reqSql, [developer.email])
        // let registeredBefore = await pool.query(regSql, [req.body.email], function(err) {
        //     if (err) throw err;
        // })
        // console.log(registeredBefore);

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

        let sql = 'SELECT D.id AS developerID, D.username, D.first_name AS developerFirstName, D.last_name AS developerLastName, D.email AS developerEmail, D.contact_number AS developerContactNumber, D.registered_at AS developerRegisteredAt, D.password_hash FROM Developer D WHERE D.email = ?'; // AND D.password_hash = ?
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
                            req.session.authenticated = true;
                            req.session.role = 'DEVELOPER';
                            req.session.userid = results[0].developerID;
                            // req.session.
                            console.log(req.session);
                            console.log(results);
                            let cDev = results[0];
                            let retrievedDev = {
                                "developerID": cDev.developerID,
                                "developerUsername": cDev.username,
                                "developerFirstName": cDev.developerFirstName,
                                "developerLastName": cDev.developerLastName,
                                "developerEmail": cDev.developerEmail,
                                "developerContactNumber": cDev.developerContactNumber,
                                "developerRegisteredAt": cDev.developerRegisteredAt
                            }
                            console.log(retrievedDev);
                            return res.status(200).json({
                                'message': 'Login success!',
                                'errorStatus': false,
                                'developer': retrievedDev
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
        max: 50
    }),
    bodyVal('first_name').isLength({
        max: 50
    }),
    bodyVal('last_name').isLength({
        max: 50
    }),
    bodyVal('contact_number').isNumeric().isLength({
        max: 15
    }),
    bodyVal('professional_title').isLength({
        max: 100
    }),
    bodyVal('description').isLength({
        max: 255
    }),
    bodyVal('website').isLength({
        max: 100
    }),
    bodyVal('email').isEmail().normalizeEmail(),
    bodyVal('password').isLength({
        max: 30
    }),
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

        // let regSql = "SELECT * FROM Developer WHERE email = ?";
        // let registeredBefore = await pool.query(reqSql, [developer.email])

        // let registeredBefore = await pool.query(reqSql, function(err) {
        //     if (err) throw err;
        // })
        // console.log(registeredBefore);

        // Check if fields needed are passed in
        if (!developer.id || !developer.username || !developer.first_name || !developer.last_name || !developer.email || !developer.contact_number || !password || !developer.registered_at || !developer.professional_title || !developer.country_id) {
            return res.status(400).json({
                'message': 'Developer registration details are incomplete, please retry registration again',
                'errorStatus': true
            });
        }

        // Check if country ID passed in is valid
        let validCountry = isValidCountry(developer.country_id);
        // validCountry = isValCountry(developer.country_id);
        // let countriesList = await getCountries();
        // console.log(`countriesList: ${countriesList}`);
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

        if (!(resume.mimetype == 'application/pdf' || profilePhoto.mimetype == 'image/jpg' || profilePhoto.mimetype == 'image/jpeg' || profilePhoto.mimetype == 'image/png')) {
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
            developer.resume_filepath = resumePath;
            developer.profile_photo_filepath = profilePhotoPath;

            console.log(`developer: ${JSON.stringify(developer)}`);
            console.log(developer.email);
            let email = developer.email;
            email = `${developer.email}`;
            console.log(email);
            // Save to database
            sql = `INSERT INTO Developer(id, username, first_name, last_name, email, contact_number, password_hash, registered_at) VALUES (?, ?, ?, ?, "${email}", ?, ?, ?)`; // AND D.password_hash = ?
            query = connection.query(sql, [developer.id, developer.username, developer.first_name, developer.last_name, developer.contact_number, developer.password, developer.registered_at], (err, result) => {
                if (err) {
                    throw err;
                    // return res.status(404).json({'message': 'An error occured when creating this developer account, please try again to register', 'errorStatus': true});
                }
                
                let dpSQL = 'INSERT INTO DeveloperProfile(id, developer_id, country_id, professional_title, description, resume_filepath, profile_photo_filepath, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'; // AND D.password_hash = ?
                let dpQuery = connection.query(dpSQL, [developer.profile_id, developer.id, developer.country_id, developer.professional_title, developer.description, developer.resume_filepath, developer.profile_photo_filepath, developer.website], (err, result) => {
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
        max: 100
    }),
    bodyVal('description').isLength({
        max: 255
    }),
    bodyVal('countryID').isLength({
        max: 255
    }),
    bodyVal('website').isLength({
        max: 100
    }),
    async (req, res) => {
        // Expects: developerID, any of the fields of a particular developer (except for resume or profile photo)
        // countryID, professionalTitle, description, website
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Failed to update profile',
                'errors': errors.array(),
                'errorStatus': true
            });
        }
        // Expects: developerID, profile photo in jpeg/png/jpg
        let inputFields = {
            ...req.body
        }

        console.log(`inputFields: ${inputFields}`);

        if (!inputFields.developerID) {
            return res.status(400).json({
                'message': 'Developer ID is not passed in',
                'errorStatus': true
            });
        }

        let developerID = inputFields.developerID;

        if (!(req.session.role == 'DEVELOPER' && req.session.userid == developerID)) {
            return res.status(403).json({
                'message': 'Unauthorized to perform this action',
                'errorStatus': true
            });
        }

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
    let developerID = req.body.developerID;
    if (!(req.session.authenticated && req.session.role == 'DEVELOPER' && req.session.userid == developerID)) {
        return res.status(403).json({
            'message': 'Unauthorized to perform this action',
            'errorStatus': true
        });
    }

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
    let developerID = req.body.developerID;
    // Expects: developerID, profile photo in jpeg/png/jpg
    if (!(req.session.authenticated && req.session.role == 'DEVELOPER' && req.session.userid == developerID)) {
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

    const profilePhotoPath = `./developerfiles/profilephoto/${profilePhoto.name}`;
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
    //bodyVal('id').isLength({
    //    min: 30,
    //    max: 40
    //}),
    (req, res) => {
        // id indicates the developer id
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Failed to get self job application',
                'errors': errors.array(),
                'errorStatus': true
            });
        }
        let developerID = req.params.id;
        if (!(req.session.authenticated && req.session.role == 'DEVELOPER' && req.session.userid == developerID)) {
            return res.status(403).json({
                'message': 'Unauthorized to perform this action',
                'errorStatus': true
            });
        }

        try {
            let sql = 'SELECT D.id AS developerID, D.username AS developerUsername, J.id AS jobApplicationID, L.id AS jobListingID, J.description AS jobApplicationDescription, J.status AS jobApplicationStatus, J.created_at AS jobApplicationCreatedAt, L.title AS jobListingTitle, L.job_description AS jobListingDescription, L.salary_start AS jobListingSalaryStart, L.salary_end AS jobListingSalaryEnd, L.created_at AS jobListingCreatedAt, L.expiration_date AS jobListingExpirationDate, L.active AS jobListingActiveStatus, C.name AS companyName, L.title AS jobListingTitle, P.profile_photo_filepath AS companyProfilePhotoPath, C.email AS companyEmail, C.registered_at AS companyRegisteredAt FROM Developer D, JobApplication J, JobListing L, Company C, CompanyProfile P WHERE D.id = J.developer_id AND J.job_listing_id = L.id AND L.company_id = C.id AND C.id = P.company_id AND D.id = ?'; // AND D.password_hash = ?
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
        if (!(req.session.authenticated && req.session.role == 'DEVELOPER')) {
            return res.status(403).json({
                'message': 'Unauthorized to perform this action',
                'errorStatus': true
            });
        }

        // Request body expects: developer user ID, application details, job listing ID
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Unable to create job application',
                'errors': errors.array(),
                'errorStatus': true
            });
        }

        let applicationDetails = {
            'developerID': req.body.developerID,
            'id': uuidv4(),
            'jobListingID': req.body.jobListingID,
            'description': req.body.description,
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

// Route for developer to logout
developerRouter.get('/logout', function (req, res, next) {
    if (req.session.role != null || req.session.role != undefined) {
        delete req.session.role;
        delete req.session.authenticated;
        delete req.session.userid;
        console.log(req.session);
        return res.status(200).json({
            'message': 'Successfully logged out as developer',
            'errorStatus': false
        });
    } else {
        return res.status(200).json({
            'message': 'You were not logged in before as developer',
            'errorStatus': false
        });
    }
});


/* Country routes here */

// Get all countries
developerRouter.get('/countries', (req, res) => {
    console.log(req.session);
    return res.status(200).json({
        'countries': countries
    });
})

// Create new country
developerRouter.post('/country',
    bodyVal('name').isLength({
        max: 50
    }),
    (req, res) => {
        // Requires admin privilege
        if (!(req.session.authenticated && req.session.role == 'ADMIN')) {
            return res.status(403).json({
                'message': 'Unauthorized to perform this action',
                'errorStatus': true
            });
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                'message': 'Unable to create new country',
                'errors': errors.array(),
                'errorStatus': true
            });
        }


        let name = req.body.name;
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