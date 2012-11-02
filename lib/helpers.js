
exports.init = function(app){
  initHelpers(app);
}

function initHelpers(app) {

		// flash messages
		app.use(function(req, res, next) {
			res.locals.messages = require('express-messages');
			next();
		});

		// request Helper
		app.use(function(req, res, next) {
			res.locals.request = function() { return req };			
			next();
		});

		// response Helper
		app.use(function(req, res, next) {
			res.locals.response = function() { return res };			
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
			res.locals.base = function() {
		  		return '/' == app.route ? '' : app.route; // return the app's mount-point so that urls can adjust.				
			};			
			next();
		});

		// appName Helper
		app.use(function(req, res, next) {
			res.locals.appName = function() {
		  		return config.appName;
			};			
			next();
		});

		// slogan Helper
		app.use(function(req, res, next) {
			res.locals.slogan = function() {
		  		return config.slogan;
			};			
			next();
		});

		// userEmail Helper
		app.use(function(req, res, next) {
			res.locals.userEmail = function() {
				return function(user) {
					if(user.email) {
						return user.email;

					} else if(user.google.email) {
						return user.google.email;

					} else if(user.facebook.email) {
						return user.facebook.email;

					} else {
						return user.username;
					}				
				}
			};			
			next();
		});

		// isRegistrationEmail Helper
		app.use(function(req, res, next) {
			res.locals.isRegistrationEmail = function() {
				return function(user) {
					if(user.google.email || user.facebook.email) {
						return false;				
					} else {
						return true;
					}
				}
			};			
			next();
		});

		// accountType Helper
		app.use(function(req, res, next) {
			res.locals.accountType = function() {
				return function(user) {
					if(user.google.id) {
						return 'google';
					} else if(user.facebook.id) {
						return 'facebook';
					} else if(user.twitter.id) {
						return 'twitter';
					} else {
						return 'local';
					}
				}			
			};			
			next();
		});

		// getSelected Helper (form combo)
		app.use(function(req, res, next) {
			res.locals.getSelected = function() {
				return function(object, value){
					var res = "";
					for(var i in object) {
						if(object[i].id == value){
							res = object[i].name;
						} 					
					}
					return res;
				}			
			};			
			next();
		});

		// isSelected Helper (form combo)
		app.use(function(req, res, next) {
			res.locals.isSelected = function() {
				return function(value1, value2){
					var selected = "";
					if(value1 == value2){
						selected = 'selected';
					} 
					return selected;
				}		
			};			
			next();
		});

		// isChecked Helper (form radio)
		app.use(function(req, res, next) {
			res.locals.isChecked = function() {
				return function(value){
					var checked = "";
					if(value){
						checked = 'checked';
					} 
					return checked;
				}
			};			
			next();
		});

		// isChecked Helper (form radio)
		app.use(function(req, res, next) {
			res.locals.isCheckedRadio = function() {
				return function(value, value1){
					var checked = "";
					if(value === value1){
						checked = 'checked';
					} 
					return checked;
				}
			};			
			next();
		});
	
}