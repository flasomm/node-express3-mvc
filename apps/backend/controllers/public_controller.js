var User 		= mongoose.model('User'),
	 phxUtil		= require('phx-utils'),
	 everyauth 	= require('everyauth');

module.exports = function(app){

	/** 
	 * Public home page action
	 */			
	app.get('/', function (req, res) {
		res.render('public/index', { title: "Admin Login" });
	});
	
}