
exports.init = function(app){
  initHelpers(app);
}

function initHelpers(app) {

		// flash messages
		app.use(function(req, res, next) {
			res.locals.messages = require('express-messages')(req, res);
			next();
		});

		// request Helper
		app.use(function(req, res, next) {
			res.locals.request = req;
			next();
		});

		// response Helper
		app.use(function(req, res, next) {
			res.locals.response = res;
			next();
		});

		// hasMessages Helper
		app.use(function(req, res, next) {
			res.locals.hasMessages = function() {
			  if (!req.session) return false;
			  return Object.keys(req.session.flash || {}).length;				
			};			
			next();
		});

		// base Helper
		app.use(function(req, res, next) {
			res.locals.base = ('/' == app.route ? '' : app.route);
			next();
		});

		// appName Helper
		app.use(function(req, res, next) {
			res.locals.appName = config.appName;
			next();
		});

		// slogan Helper
		app.use(function(req, res, next) {
			res.locals.slogan = config.slogan;
			next();
		});
	
}