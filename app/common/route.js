var Route = function (prefix) {
	this.prefix = '/' + (prefix || '');
	this.get = {};
	this.post = {};
	this.put = {};
	this.del = {};
	this.all = {};
}

module.exports = Route;