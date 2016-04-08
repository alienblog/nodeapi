var routes = require('./routes');

module.exports = function (application) {
	
	routes(application.router);
};