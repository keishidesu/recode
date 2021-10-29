const express = require('express');
const {v4: uuidv4 } = require('uuid');
const connection = require('../database/connection');
const explorejobsRoute = express.Router();

/////// What is Featured Company??

explorejobsRoute.get('/', (req, res) => {
    let sql = 'SELECT joblisting.id, joblisting.title, company.name, category.type FROM joblisting, company, category, joblistingcategory WHERE joblisting.company_id = company.id and joblistingcategory.job_listing_id = joblisting.id and joblistingcategory.category_id = category.id';
	let quary = connection.query(sql,(err,results) => {
		if(err) throw err;
        res.send(results);
		return
	});
});

explorejobsRoute.get('/:title', (req, res) => {
    let sql = `SELECT joblisting.id, joblisting.title, company.name, category.type FROM joblisting, company, category, joblistingcategory WHERE joblisting.company_id = company.id and joblistingcategory.job_listing_id = joblisting.id and joblistingcategory.category_id = category.id and joblisting.title = ${req.params.title}`;
	console.log(sql);
	let quary = connection.query(sql,(err,results) => {
		if (results.length>=1){
			res.send(results)
			return
		}
		else{
			res.send('Job Title Not Found!')
		}

		
	});
});

explorejobsRoute.get('/:title/:type', (req, res) => {
	var title = req.params.title;
	var type = req.params.title.split(',');
	console.log(type);
	var values = [[type]]
    let sql = "SELECT joblisting.id, joblisting.title, company.name, category.type FROM joblisting, company, category, joblistingcategory WHERE joblisting.company_id = company.id and joblistingcategory.job_listing_id = joblisting.id and joblistingcategory.category_id = category.id and joblisting.title = ? and category.name IN ?";
	console.log(sql);
	let quary = connection.query(sql,title,[values],(err,results) => {
		//console.log(results);
		if (results.length>=1){
			res.send(results);
		}
		else{
			res.send('Job Title Not Found!')
		}

		
	});
});

module.exports = function(connection) {
    return explorejobsRoute;
}
