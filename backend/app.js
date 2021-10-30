require('dotenv').config(); // Load env variables that are set in the .env file in project directory

// Configuration variables
const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const {
  DEC8_BIN
} = require('mysql/lib/protocol/constants/charsets');
const app = express();
const port = process.env.BACKEND_PORT || 9000;
const connection = require('./database/connection'); // Database connection
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const upload = require('express-fileupload');

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

const swaggerDocs = swaggerJsDoc(swaggerOptions);  // Initialize swagger docs with configurations above
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Import routers
// var userRouter = require('./routers/user')(connection);
// var companyListRoute = require('./routers/companyListRoute')(connection);
// var explorejobsRoute = require('./routers/exploreJobs.js')(connection);
// var developerListRouter = require('./routers/developerListRouter.js')(connection);
var developerRouter = require('./routers/developer')(connection);





// Configure middlewares
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {maxAge: oneDay},
  resave: false,
  saveUninitialized: true
}))
app.use(express.json()); // parse JSON data
app.use(express.urlencoded({
  extended: true
})); // parse urlencoded request body
app.use(cookieParser());  // Enable server to parse cookies
app.use(upload());  // Support file uploads


// Use routers
app.use('/developer', developerRouter)

// app.use('/companylist', companyListRoute)

// app.use('/exploreJobs', explorejobsRoute)

// app.use('/developerList', developerListRouter)

// Default route for backend
app.get('/', (req, res) => {
  res.status(200).send('Welcome to re:code backend')
})

/**
 * @swagger
 * /testing:
 *  get:
 *    description: Used to show welcome messages
 *    response:
 *      '200':
 *        description: Done asdasdasdsad
 * 
 */
app.get('/testing', (req, res) => {
  res.status(200).send('Welcome to testing')
})

// Get list of companies
app.get('/companylist', (req, res) => {
  let sql = 'SELECT C.name, C.email, P.id AS profile_id, P.tagline, P.description, P.website, P.profile_photo_filepath FROM company C, companyprofile P';
  let query = connection.query(sql,(err,results) => {
    if(err) throw err;
    console.log(results);
        res.send(results);
    return
  });
});

// Get list of developers
app.get('/developerlist', (req, res) => {
  let sql = 'SELECT D.first_name, D.last_name, D.email, P.id AS profile_id, P.professional_title, P.description, P.website, P.profile_photo_filepath FROM developer D, developerprofile P';
  let query = connection.query(sql,(err,results) => {
    if(err) throw err;
    console.log(results);
        res.send(results);
    return
  });
});


// Get list of developers
app.get('/developerlist', (req, res) => {
  let sql = 'SELECT D.first_name, D.last_name, D.email, P.id AS profile_id, P.professional_title, P.description, P.website, P.profile_photo_filepath FROM developer D, developerprofile P';
  let query = connection.query(sql,(err,results) => {
    if(err) throw err;
    console.log(results);
        res.send(results);
    return
  });
});

// Get list of developers
app.get('/developerlist', (req, res) => {
  let sql = 'SELECT D.first_name, D.last_name, D.email, P.id AS profile_id, P.professional_title, P.description, P.website, P.profile_photo_filepath FROM developer D, developerprofile P';
  let query = connection.query(sql,(err,results) => {
    if(err) throw err;
    console.log(results);
        res.send(results);
    return
  });
});

app.get('/joblistings',(req,res)=>{
//TODO: include job listing status after we almost done
let sql = 'SELECT J.id AS joblisting_id, J.title AS joblisting_title, J.job_description, J.salary_start, J.salary_end, J.created_at, J.expiration_date, P.id AS companyprofile_id, P.tagline AS company_tagline, P.description AS companydescription, P.website AS companywebsite, P.profile_photo_filepath AS company_profile_photo_filepath, C.name AS company_name, C.username AS company_username, C.email AS company_email FROM joblisting J, company C, companyprofile P WHERE J.company_id = C.id AND C.id = P.company_id';
let query = connection.query(sql,(err,results) => {
  if(err) throw err;
  console.log(results);
      res.send(results);
  return
  });
});

app.get('/developer/:username',(req,res)=>{
  let username = req.params.username;
  let sql = 'SELECT D.first_name, D.last_name, D.username, D.email, D.registered_at, P.professional_title, P.description, P.resume_filepath, P.profile_photo_filepath, P.website, C.name AS country FROM Developer D, DeveloperProfile P, Country C WHERE D.id = P.developer_id AND P.country_id = C.id AND D.username = ?;';
  let query = connection.query(sql,[username], (err,results) => {
    if(err) throw err;
    // console.log(results);
    if (results.length == 0) {
      return res.status(404).json({'msg': `No developer with username '${username}' found in re:code.`, 'status': 'ERROR'});
    } else {
      return res.status(200).json(results[0])
    }
    });
});


// Get specific company profile by username
app.get('/company/:username',(req,res)=>{
  let username = req.params.username;
  let sql = 'SELECT C.name AS company_name, C.username, C.email, C.registered_at, P.id AS companyprofile_id, P.tagline AS company_tagline, P.description AS company_description, P.website AS company_website, P.profile_photo_filepath AS company_profile_photo_filepath, P.description, P.profile_photo_filepath, P.website FROM Company C, CompanyProfile P WHERE C.id = P.company_id  AND C.username = ?;';
  let query = connection.query(sql,[username], (err,results) => {
    if(err) throw err;
    // console.log(results);
    if (results.length == 0) {
      return res.status(404).json({'msg': `No company with username '${username}' found in re:code.`, 'status': 'ERROR'});
    } else {
      return res.status(200).json(results[0])
    }
    });
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
