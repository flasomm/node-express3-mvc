var phxUtil		= require('phx-utils');

module.exports = function(app){
	
	/** 
	 * Public home page action
	 */			
	app.get('/', function (req, res) {
		res.render('public/index', { title: "Welcome Home" });
	});
	
}