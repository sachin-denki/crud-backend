let sequelize_mysql = require("../db");
let Sequelize = require("sequelize");

let query = (query,options) => {
    return new Promise(function(resolve, reject) {

		sequelize_mysql.query(query, options)
	  		.then(result => {
	    		return resolve(result);
	  		})
	  		.catch(error => {
	    		return resolve([]);
	  		});
	});
}

module.exports = {
	query: query
}