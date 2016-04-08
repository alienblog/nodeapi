var koa = require('koa')(),
	router = require('koa-router')(),
	app = require('./app');

var rootPath = __dirname;

var application = {
	rootPath : rootPath,
	router : router
};

app(application);

koa.use(router.routes());
koa.use(router.allowedMethods());

koa.listen(process.env.PORT,process.env.IP);
console.log('listen on port '+process.env.PORT);