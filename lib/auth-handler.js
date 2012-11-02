var everyauth 	= require('everyauth'),
		Promise 	= everyauth.Promise,
		phxUtil 	= require('phx-utils'),
		url 	  	= require('url'),
		http		= require('http'),
		User 	  	= mongoose.model('User');

everyauth.debug = config_auth.debug;


// Password
everyauth.password
  .loginWith('email')
  .getLoginPath('/login') // Uri path to the login page
  .postLoginPath('/login') // Uri path that your login form POSTs to
  .loginLayout('layouts/login.ejs')
  .loginView('public/index.ejs')
  .loginLocals(function (req, res) {
     var sess = req.session;
     return {
       authenticity_token: phxUtil.strings.slugSession(sess.id)
		,title: 'SignIn'
     } })
  .authenticate( function (email, password, req, res) {
    // Either, we return a user or an array of errors if doing sync auth.
    // Or, we return a Promise that can fulfill to promise.fulfill(user) or promise.fulfill(errors)
    // `errors` is an array of error message strings
    var promise = this.Promise();
    User.login(email, password, function (err, user) {
       if (err) return promise.fulfill([err]);
			
	    if (user) {
			var urlPart = url.parse(req.headers.referer);
			var hostname = urlPart.hostname;
			
			if(hostname === config.backDomain && user.group !== 'default') {
     			promise.fulfill(user);

			} else if(hostname === config.frontDomain 
					&& (user.group === 'default' 
							|| user.group === 'admin' 
							|| user.group === 'editor') ) {
      		promise.fulfill(user);
			
			} else {
				promise.fulfill(['']);
			}					

	    } else {
			promise.fulfill(['']);
	    }
    });
	 return promise;
  })
  .loginSuccessRedirect('/home') // Where to redirect to after a login
  .getRegisterPath('/register') // Uri path to the registration page
  .postRegisterPath('/register') // The Uri path that your registration form POSTs to
  .registerLayout('layouts/register.ejs')
  .registerLocals(function (req, res) {
     var sess = req.session;
     return {
       authenticity_token: phxUtil.strings.slugSession(sess.id)
		,title: 'SignUp'
     } })
  .registerView('public/index.ejs')
  .extractExtraRegistrationParams( function (req) {
	  return {
	      username: req.body.username
			, gender: req.body.gender
			, birthdate: req.body.birthdate
			, authenticity_token: req.body.authenticity_token
			, session_id: phxUtil.strings.slugSession(req.session.id)
	  };
	})
  .validateRegistration( function (newUserAttributes) {
		var errors = User.validate(newUserAttributes);
		return errors;
  })
  .registerUser( function (newUserAttributes) {
	    var promise = this.Promise();
	    User.register(newUserAttributes, function (err, user) {
	      if (err) return promise.fulfill([err]);
	      promise.fulfill(user);
	    });
	    return promise;
  })
  .registerSuccessRedirect('/'); // Where to redirect to after a successful registration

// Google
everyauth.google
	.appId(config_auth.google.appId)
	.appSecret(config_auth.google.appSecret)
	.scope('https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email') // What you want access to
	.handleAuthCallbackError( function (req, res) {
	    // If a user denies your app, Google will redirect the user to
	    // /auth/google/callback?error=access_denied
	    // This configurable route handler defines how you want to respond to
	    // that.
	    // If you do not configure this, everyauth renders a default fallback
	    // view notifying the user that their authentication failed and why.
			console.log('handleAuthCallbackError');
	})
	.findOrCreateUser( function (session, accessToken, accessTokenExtra, googleUserMetadata) {
	    var promise = this.Promise();
	    User.findOrCreateByGoogleData(googleUserMetadata, accessToken, accessTokenExtra, promise);
	    return promise;
	})
	.redirectPath(config_auth.redirURL);


// Facebook
everyauth.facebook
  .scope('email,user_birthday,user_activities,user_hometown,user_location,user_about_me,user_checkins,user_photos,user_relationships,user_status,user_videos,user_work_history,user_likes')
  .appId(config_auth.facebook.appId)
  .appSecret(config_auth.facebook.appSecret)
  .handleAuthCallbackError( function (req, res) {
	    // If a user denies your app, Facebook will redirect the user to
	    // /auth/facebook/callback?error_reason=user_denied&error=access_denied&error_description=The+user+denied+your+request.
	    // This configurable route handler defines how you want to respond to
	    // that.
	    // If you do not configure this, everyauth renders a default fallback
	    // view notifying the user that their authentication failed and why.
			console.log('handleAuthCallbackError');
  })
  .findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {
    var promise = this.Promise();
    User.findOrCreateByFacebookData(fbUserMetadata, accessToken, accessTokenExtra, promise);
    return promise;
  })
  .redirectPath(config_auth.redirURL);


// Twitter
everyauth.twitter
	.consumerKey(config_auth.twitter.consumerKey)
  .consumerSecret(config_auth.twitter.consumerSecret)
	.findOrCreateUser( function (session, accessToken, accessTokenExtra, twitterUserMetadata) {
		var promise = this.Promise();
		User.findOrCreateByTwitterData(twitterUserMetadata, accessToken, accessTokenExtra, promise);
		return promise;
	})
	.redirectPath(config_auth.redirURL);

	
// Setup user for everyauth helper	
everyauth.everymodule.findUserById( function (id, callback) {
	User.findById(id, function (err, user) {
		callback(err, user);
	});
});


/**
 * Check cedentials on all non public action
 */
module.exports = checkCredentials = function (req, res, next) {
	if (!req.session.auth) {
		// Store the custom redirect path in the session for later use -- see above
		req.session.redirectPath = '/home';

		// Redirect the user to the home page
		return res.redirect('/');
	}

	// Otherwise, pass control to the route handler -- see above
	return next();
};

/**
 * Check cedentials on all non admin public action
 */
module.exports = checkAdminCredentials = function (req, res, next) {
	if (!req.session.auth) {
		// Store the custom redirect path in the session for later use -- see above
		req.session.redirectPath = '/dashboard';

		// Redirect the user to the login page
		return res.redirect('/');
	}

	// Otherwise, pass control to the route handler -- see above
	return next();
};
