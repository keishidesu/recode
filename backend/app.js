require('dotenv').config(); // Load env variables that are set in the .env file in project directory

// Configuration variables
const express = require('express');
const app = express();
const port = process.env.BACKEND_PORT || 9000;
const cors = require('cors');

const mysql = require('mysql');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const {
  DEC8_BIN
} = require('mysql/lib/protocol/constants/charsets');
const connection = require('./database/connection'); // Database connection
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const upload = require('express-fileupload');
const {
  body: bodyVal,
  validationResult
} = require('express-validator'); // TODO: express validator
const path = require('path');

// Set Swagger configurations
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 're:code API',
      description: 'Information about the backend API for the re:code web application',
      contact: {
        name: ""
      },
      servers: [`http://localhost:${port}`]
    }
  },
  apis: ['app.js', 'routers/*.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions); // Initialize swagger docs with configurations above
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(cors({ origin:'http://localhost:3000', credentials:true }));

// Import routers
// var userRouter = require('./routers/user')(connection);
// var companyListRoute = require('./routers/companyListRoute')(connection);
// var explorejobsRoute = require('./routers/exploreJobs.js')(connection);
// var developerListRouter = require('./routers/developerListRouter.js')(connection);
var developerRouter = require('./routers/developer');
var companyRouter = require('./routers/company');
var adminRouter = require('./routers/admin');


// Configure middlewares
const oneDay = 1000 * 60 * 60 * 24; // 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: oneDay,
    secure: false
  },
  resave: false,
  saveUninitialized: true
});
app.use(sessionMiddleware)
app.use(express.json()); // parse JSON data
app.use(express.urlencoded({
  extended: true
})); // parse urlencoded request body
app.use(cookieParser()); // Enable server to parse cookies
app.use(upload()); // Support file uploads

// Use routers
app.use('/developer', sessionMiddleware, developerRouter);
app.use('/company', sessionMiddleware, companyRouter);
app.use('/admin', sessionMiddleware, adminRouter);
app.use('/developerprofilephoto', express.static(path.join(__dirname, 'developerfiles', 'profilephoto')));
app.use('/companyprofilephoto', express.static(path.join(__dirname, 'companyfiles', 'profilephoto')));
app.use('/developerresume', express.static(path.join(__dirname, 'developerfiles', 'resume')));

// Default route for backend
app.get('/', (req, res) => {
  res.status(200).send('Welcome to re:code backend');
})

/* GENERAL ENDPOINTS, APPLICABLE FOR ALL USERS */

// Get list of companies
app.get('/companylist', (req, res) => {
  let sql = 'SELECT C.username AS companyUsername, C.name AS companyName, C.email AS companyEmail, P.id AS companyProfileID, P.tagline AS companyTagline, P.description AS companyDescription, P.website AS companyWebsite, P.profile_photo_filepath AS companyProfilePhotoFilepath FROM Company C, CompanyProfile P, CompanyRegistration R WHERE C.id = P.company_id AND C.id = R.company_id AND R.status = ?';
  let query = connection.query(sql, ['APPROVED'], (err, results) => {
    if (err) throw err;
    console.log(results);
    return res.status(200).json(results);
  });
});

// Get list of developers
app.get('/developerlist', (req, res) => {
  let sql = 'SELECT D.username AS developerUsername, D.first_name AS developerFirstName, D.last_name AS developerLastName, D.email AS developerEmail, P.id AS developerProfileId, P.professional_title AS developerProfessionalTitle, P.description AS developerDescription, P.website AS developerWebsite, P.profile_photo_filepath AS developerProfilePhotoFilepath FROM Developer D, DeveloperProfile P WHERE P.developer_id = D.id';
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    return res.status(200).json(results);
  });
});


app.get('/joblistings', (req, res) => {
  let sql = 'SELECT J.id AS jobListingId, J.title AS jobListingTitle, J.job_description AS jobListingJobDescription, J.salary_start AS jobListingSalaryStart, J.salary_end AS jobListingSalaryEnd, J.created_at AS jobListingCreatedAt , J.expiration_date AS jobListingExpirationDate, J.active AS jobListingActive, P.id AS companyProfileID, P.tagline AS companyTagline, P.description AS companyDescription, P.website AS companyWebsite, P.profile_photo_filepath AS companyProfilePhotoFilepath, C.name AS companyName, C.username AS companyUsername, C.email AS companyEmail FROM JobListing J, Company C, CompanyProfile P WHERE J.company_id = C.id AND C.id = P.company_id';
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    return res.status(200).json(results);
  });
});

app.get('/developerprofile/:username', (req, res) => {
  let username = req.params.username;
  let sql = 'SELECT D.first_name AS developerFirstName, D.last_name AS developerLastName, D.username AS developerUsername, D.email AS developerEmail, D.registered_at AS developerRegisteredAt, P.professional_title AS developerProfessionalTitle, P.description as developerDescription, P.resume_filepath AS developerResumeFilepath, P.profile_photo_filepath AS developerProfilePhotoFilepath, P.website AS developerWebsite, C.name AS country FROM Developer D, DeveloperProfile P, Country C WHERE D.id = P.developer_id AND P.country_id = C.id AND D.username = ?;';
  let query = connection.query(sql, [username], (err, results) => {
    if (err) throw err;
    // console.log(results);
    if (results.length == 0) {
      return res.status(400).json({
        'message': `No developer with username '${username}' found in re:code.`,
        'errorStatus': true
      });
    } else {
      return res.status(200).json(results[0])
    }
  });
});


// Get specific company profile by username
app.get('/companyprofile/:username', (req, res) => {
  let username = req.params.username;
  let sql = 'SELECT C.name AS companyName, C.username AS companyUserName, C.email AS companyEmail, C.registered_at AS companyRegisteredAt, P.id AS companyProfileId, P.tagline AS companyTagline, P.description AS companyDescription, P.website AS companyWebsite, P.profile_photo_filepath AS companyPhotoFilepath, P.description AS companyDescription, P.profile_photo_filepath AS companyProfilePhotoFilepath, P.website AS companyWebsite FROM Company C, CompanyProfile P WHERE C.id = P.company_id  AND C.username = ?;';
  let query = connection.query(sql, [username], (err, results) => {
    if (err) throw err;
    // console.log(results);
    if (results.length == 0) {
      return res.status(400).json({
        'message': `No company with username '${username}' found in re:code.`,
        'errorStatus': true
      });
    } else {
      return res.status(200).json(results[0])
    }
  });
});

// General logout route
app.get('/logout', function (req, res, next) {
  if (req.session.role != null || req.session.role != undefined) {
      delete req.session.role;
      delete req.session.authenticated;
      delete req.session.userid;
      console.log(req.session);
      return res.status(200).json({
          'message': 'Successfully logged out',
          'errorStatus': false
      });
  } else {
      return res.status(200).json({
          'message': 'You were not logged in before',
          'errorStatus': false
      });
  }
});

// Listen at stated port
app.listen(port, () => {
  console.log(`Backend is listening at http://localhost:${port}`);
})
// For the app, host at port 9000 if port is undefined in .env file




/* ######## SAMPLE CODES FOR REFERENCE ALL OF THEM COME HERE ######## */

/* ****** SAMPLE CODE FOR QUERYING DATABASE ****** */
// // Connect to db
// connection.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Connected to db');
// })

// // Default route for backend
// app.get('/', (req, res) => {
//   let sql = 'SELECT * FROM employees WHERE emp_no = 10001;';
//   connection.query(sql, (err, result) => {
//     if (err) throw err;
//     // console.log(result);
//     res.status(200).send(result[0]);
//   })


//   // 'select * from employees limit 10;    '
//   // res.status(200).send('Welcome to NotFiverr backend')
// })

// // Default route for backend
// app.post('/', async (req, res) => {
//   let newEmployee = req.body;
//   // console.log(newEmployee);

//   let sql = 'INSERT INTO employees SET ?';
//   let success = false;
//   await connection.query(sql, newEmployee, (err, result) => {
//     if (err) {
//       throw err;
//     } else {
//       // Successful insert
//       success = true;
//       console.log(success);
//     }
//     console.log(result);
//     // res.status(200).send(result);

//     if (success) {
//       res.status(200).send('Successfully inserted new employee')
//     } else {
//       res.status(200).send('FAIL')
//     }
//   })
//   // 'select * from employees limit 10;    '

// })

/* ****** SAMPLE CODE FOR DEALING WITH EXPRESS SESSIONS ****** */