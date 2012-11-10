var User = mongoose.model('User');

module.exports = function(app){

	/** 
	 * Dashboard action
	 */	
	app.get('/dashboard', checkAdminCredentials, function (req, res) {
		req.flash("info", "Welcome %s", (req.user.firstname + ' ' + req.user.lastname) );
		res.render('dashboard/index', { title: 'Dashboard Index' });
	});
	
}