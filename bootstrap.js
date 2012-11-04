/**
 * Module dependencies.
 */

var express = require('express')
  	, gzippo = require('gzippo')
  	, mongoStore = require('connect-mongodb')
	, everyauth = require('everyauth')
	, engine = require('ejs-locals')
	, flash = require('connect-flash')
	, expressValidator = require('express-validator')
	, fs = require('fs')
  	, url = require('url');

exports.init = function(app){
  bootApplication(app);
}

// App settings and middleware

function bootApplication(app) {	
	
	// Init helpers
	require('./lib/helpers').init(app);
	
	app.configure(function(){

		// set views path, template engine and default layout
		app.set('views', __dirname + '/apps/' + app.settings.name + '/views');	
		app.set('view engine', 'ejs');
		app.engine('ejs', engine);

		//app.register('.html', require('ejs'))
		//app.set('view engine', 'html')
	
		//app.set('view options', { layout: 'layouts/default' });

		// contentFor & content view helper - to include blocks of content only on required pages
		app.use(function(req, res, next){
			// expose the current path as a view local
			res.locals.path = url.parse(req.url).pathname;

			next();
		});

		// bodyParser should be above methodOverride
		// app.use(express.bodyParser({keepExtensions: true, uploadDir:'/public/images/uploads'}));
		app.use(express.bodyParser());
		app.use(expressValidator);
		app.use(express.methodOverride());

		// cookieParser should be above session
		app.use(express.cookieParser());
		app.use(express.session({
			secret: config.appName,
      	store: new mongoStore({
        		url: config_db.uri,
        		collection : 'sessions'
			})
		}));
		
				
		app.use(flash());	// set flash support with connect-flash
		app.use(express.logger(':method :url :status'));
    	app.use(express.favicon());

		// gzippo only for production use
		if(app.settings.env=='production'){
			app.use(gzippo.staticGzip(__dirname + '/public'));
			app.use(gzippo.compress());
			
		} else {
			app.use(express.static(__dirname + '/public'));
		}

		// everyauth setup
		app.use(everyauth.middleware(app));

		// Bootstrap controllers
		var controllers_path = __dirname + '/apps/'+app.settings.name+'/controllers';
		var controller_files = fs.readdirSync(controllers_path);
		controller_files.forEach(function(file){
		  require(controllers_path+'/'+file)(app);
		});
		
    	// routes should be at the last
    	app.use(app.router);

  });


  // Don't use express errorHandler as we are using custom error handlers
  // app.use(express.errorHandler({ dumpExceptions: false, showStack: false }))

  // show error on screen. False for all envs except development
  // settmgs for custom error handlers
  app.set('showStackError', false);

  // configure environments
  app.configure('development', function(){
    app.set('showStackError', true);
  });

  // gzip only in staging and production envs
  app.configure('staging', function(){
    app.enable('view cache');
  });

  app.configure('production', function(){
    // view cache is enabled by default in production mode
  });

	require('./lib/error-handler').boot(app);   // Bootstrap custom error handler
	
}