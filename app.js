/**
 * Module dependencies.
 */
var express = require('express');
var fs = require('fs');
var mailer = require('phx-mailer');
var path = require('path'); 

// Load configurations
var config_file = require('yaml-config');
exports = module.exports = config = config_file.readConfig('config/apps.yml');
exports = module.exports = config_db = config_file.readConfig('config/database.yml');
exports = module.exports = config_auth = config_file.readConfig('config/security.yml');
exports = module.exports = appPath = __dirname;

require('./lib/db-connect');   // Bootstrap db connection

// Load mailer settings
mailer.init();


// Bootstrap models
var models_path = __dirname + '/apps/models'
var model_files = fs.readdirSync(models_path);
model_files.forEach(function(file){
	require(models_path+'/'+file)
});

// Bootstrap authentication strategies
require('./lib/auth-handler');

// Create servers for applications
var front = module.exports = express();
var back = module.exports = express();
front.set('name', 'frontend');
back.set('name', 'backend');

require('./bootstrap').init(front); // Bootstrap application settings for frontend
require('./bootstrap').init(back); // Bootstrap application settings for backend


// Redirect app
var redirect = express();

redirect.all('*', function(req, res){
  res.redirect(config.baseURL + '/' + req.subdomains[0]);
});

// Main app
var app = express();

app.use(express.vhost('*.localhost', redirect))
app.use(express.vhost(config.frontDomain, front));
app.use(express.vhost(config.backDomain, back));

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", 3000 /*app.address().port*/, app.settings.env);
});
