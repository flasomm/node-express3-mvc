var phxUtil = require('phx-utils'),
	 util 	= require('util'),
	 User 	= mongoose.model('User');

module.exports = function(app){
	
	/**
	 * Module dependencies which require app (phx-pagination)
	 **/	
	require('phx-pagination').init(app);

	/** 
	 * Call before every request to check admin credentials
	 */		
  	app.all('*', checkAdminCredentials);
	
	/** 
	 * Everytime an id is an url param, it call this method
	 */		
	app.param('userId', function(req, res, next, id){
	  User
	    .findOne({ _id : id }, function(err,user) {
	      if (err) return next(err);
	      if (!user) return next(new Error('Failed to load user ' + id));
	      req.userReq = user;
	      next();
	    })
	});
	
	/** 
	 * Display home page Action
	 */	
	app.get('/users', function (req, res) {
	   var page = req.param('page') || 1;
	   User.paginate({limit: config.paginateNumber, page: page}, function (err, users) {
			if (err) {
				console.error(err);
		  	} else {
	  			res.render('users/index', { title: 'Users List', users: users });
			}
		});
	});

	/** 
	 * Display New User form action
	 */	
  	app.get('/users/new', function (req, res) {
		var user = new User();
		res.render('users/new', { title: 'New User', usr: user });
	});

	/** 
	 * Display New User form action
	 */	
  	app.get('/users/edit/:userId', function (req, res) {
		res.render('users/edit', { title: 'Edit User '+req.userReq.firstname+' '+req.userReq.lastname, usr: req.userReq });
	});
	
	/** 
	 * Create user action
	 */		
  	app.post('/users/create', function (req, res) {
		var errors = User.validateUser(req);

		if(!errors){
			var user = req.body.User;					

			User.create(user, function(err){
				if(!err){
					req.flash("info", "User saved successfully");
					res.redirect('/users');

				} else {
					console.log('err:'+err);
					req.flash("error", "User can not be saved");
					var user = new User();		
					res.render('users/new', {
						usr: user,
						title: 'New user'
					});				
				}			
			});								
			
		} else {
			var resError = phxUtil.strings.formatFlashMessage(errors);
			var user = new User();		
			req.flash("error", resError);
			res.render('users/new', {
				usr: user,
				title: 'New user'
			});				
		}

	});

	/** 
	 * Update user action
	 */		
  	app.post('/users/update', function (req, res) {	
		var errors = User.validateUser(req);
		var user = req.body.User;				
		
		if(!errors){		
			
			User.findOne({_id: user.id}, function(err, usr){
				
				if(usr){					
					usr.updateAll(user, function(err, uusr){
						if (!err) {
							req.flash("info", "User %s updated successfully", uusr.username);
							res.redirect('/users/edit/'+uusr.id);

						} else {
							console.log(err);
							req.flash("error", "User can not be updated");
							res.redirect('/users/edit/'+user.id);							
						}
					});

				} else {
					console.log(err);
					req.flash("error", "User not found");
					res.redirect('/users/edit/'+user.id);
				}
			});

		} else {
			var resError = phxUtil.strings.formatFlashMessage(errors);
			req.flash("error", resError);
			res.redirect('/users/edit/'+user.id);
		}		
	});
	
	/** 
	 * Show user action to form
	 */		
  	app.get('/users/show/:userId', function (req, res) {
		res.render('users/show', { title: 'User | '+req.userReq.firstname+' '+req.userReq.lastname, usr: req.userReq });
	});
	
	/** 
	 * Delete user action
	 */	
  	app.get('/users/delete/:userId', function (req, res) {
      if(req.userReq) {
			req.flash("info", "User %s deleted successfully", req.userReq.username);
			req.userReq.remove();
			res.redirect('/users/');	
		} else {
			req.flash("error", "Cannot delete user %s", req.userReq.username);
			res.redirect('/users/');				
		}
	});	
	
}