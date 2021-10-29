const express = require('express');
const {v4: uuidv4 } = require('uuid');
const connection = require('../database/connection');
const companyListRoute = express.Router();




//companyListRoute.get('/:name', (req, res) => {
//    let sql = `SELECT company.name, companyprofile.profile_photo_filepath FROM company, companyprofile WHERE company.id = companyprofile.company_id and company.name = ${req.params.name}`;
//	let quary = connection.query(sql,(err,results) => {
//		if (results.length>=1){
//			res.send(results);
//		}
//		else{
//			res.json({'Error':'Company Name Not Found!'});
//		}
//
//		
//	});
//});

module.exports = function(connection) {
    return companyListRoute;
}
