const express = require('express');
const {v4: uuidv4 } = require('uuid');
const connection = require('../database/connection');
const DeveloperListRouter = express.Router();


DeveloperListRouter.get('/', (req, res) => {
    let sql = 'SELECT concat(first_name, " ",last_name) as fullname, profile_photo_filepath from developer, developerprofile WHERE developer.id = developerprofile.developer_id LIMIT 8';
	let quary = connection.query(sql,(err,results) => {
		if(err) throw err;
        res.send(results);
		return
	});
});

DeveloperListRouter.get('/:name', (req, res) => {
    let name = req.params.name;
    console.log(name);
    let details=name.split(' ');
    console.log(details);
    let first_name = details[0];
    let last_name = details[1];
    console.log(last_name);
    let sql = `SELECT concat(first_name, " ",last_name) as fullname, profile_photo_filepath from developer, developerprofile WHERE developer.id = developerprofile.developer_id and developer.first_name = ${first_name} and developer.last_name = ${last_name}`;
	let quary = connection.query(sql,(err,results) => {
		if (results.length>=1){
			res.send(results);
		}
		else{
			res.json({'Error':'Developer Not Found!'});
		}

		
	});
});

module.exports = function(connection) {
    return DeveloperListRouter;
}
