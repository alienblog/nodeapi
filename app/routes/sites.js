var Route = require('../common/route');

var sites = new Route('sites');

sites.get['getAll'] = function*(next) {
	this.body = 'getSites';
}

module.exports = sites;