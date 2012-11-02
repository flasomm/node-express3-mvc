var phxUtil 	= require('phx-utils');

var exports = module.exports = UserSchema = new Schema({});

UserSchema.add({
	email:      			{type: String, index: true, unique: true }, 
	password: 				{type: String }, 
  	activated:  			{type: Boolean, default: true },
  	google: 	{
		id: 					{type: String, default : '', index: true },
		accessToken: 		{type: String, default : '', index: false },
		expires: 			{type: String, default : '', index: false },
		name: 				{type: String, default : '', index: true },
		firstname: 			{type: String, default : '', index: true },
		lastname: 			{type: String, default : '', index: true },
		link: 				{type: String, default : '', index: false },
		picture: 			{type: String, default : '', index: true },
		gender: 				{type: String, default : '', index: false },
		locale: 				{type: String, default : '', index: false },
		alias: 				{type: String, default : '', index: false },
		email: 				{type: String, default : '', index: true },
		birthdate: 			{type: Date}
	},
  	facebook: 	{	
		id: 					{type: String, default : '', index: true },
		accessToken: 		{type: String, default : '', index: false },
		expires: 			{type: String, default : '', index: false },
		name: 				{type: String, default : '', index: true },
		firstname: 			{type: String, default : '', index: true },
		lastname: 			{type: String, default : '', index: true },
		link: 				{type: String, default : '', index: false },
		picture: 			{type: String, default : '', index: true },
		gender: 				{type: String, default : '', index: false },
		locale: 				{type: String, default : '', index: false },
		alias: 				{type: String, default : '', index: false },
		email: 				{type: String, default : '', index: true },
  		verified:  			{type: Boolean, default: false },
		birthdate: 			{type: Date},
		location: {
			name: 			{type: String, default : '', index: true }
		},
		hometown: {
			name: 			{type: String, default : '', index: true }
		}
	},		
	twitter: {
		id: 					{type: String, default : '', index: true },
		accessToken: 		{type: String, default : '', index: false },
		expires: 			{type: String, default : '', index: false },
	  	statuses_count:  	{type: Number, required : false, index: false },
		name: 				{type: String, default : '', index: true },
		screen_name: 		{type: String, default : '', index: true },			
		picture: 			{type: String, default : '', index: true },
		locale: 				{type: String, default : '', index: false },
	  	followers_count:  {type: Number, required : false, index: false },
		description: 		{type: String, default : '', index: false },
		link: 				{type: String, default : '', index: false },
		created_at: 		{type: Date},
	  	friends_count: 	{type: Number, required : false, index: false },
		location: 			{type: String, default : '', index: false },
		time_zone: 			{type: String, default : '', index: false },
		lang: 				{type: String, default : '', index: false }
	},
  	username: 				{type: String, default : '', required : true, index: true },
  	firstname: 				{type: String, default : '', required : false, index: true },
  	lastname: 				{type: String, default : '', required : false, index: true },
  	gender: 					{type: String, default : 'm', required : true },
	created_at: 			{type: Date, default: Date.now }
});


/** 
 * Find user by id
 * @static
 */
UserSchema.statics.findUserById = function (id, callback) {
	this.findOne({_id: id}, callback);
};


/** 
 * Update Authentication Google Data with google openid + oauth2
 * @static
 */
UserSchema.statics.findOrCreateByGoogleData = function(gData, accessToken, accessTokenExtra, promise) {
	
	//phxUtil.strings.var_dump(gData);
	var User = mongoose.model('User');

	this.findOne({'google.id': gData.id}, function (err, user) {
		
		if (err) {
			console.log("Error in finding user for auth. Check Db.");
			promise.fail(err);
			return;
			
		} else if (user) {
			console.log("User " + gData.email + " found and logged in.");
			promise.fulfill(user);
			
		} else {

			var expiresDate = getExpiresDate();
		  	var user = new User();
		  	var datas = {};
			var birthdate = new Date(gData.birthday);

			user.google.id 			= gData.id;
			user.google.accessToken = accessToken;
			user.google.expires 		= expiresDate;
			user.google.name 			= gData.name;
			user.google.firstname 	= phxUtil.strings.capitaliseFirstLetter(gData.given_name);
			user.google.lastname 	= phxUtil.strings.capitaliseFirstLetter(gData.family_name);
			user.google.link 			= gData.link;
			user.google.picture 		= gData.picture;
			user.google.gender 		= gData.gender;
			user.google.locale 		= gData.locale;
			user.google.alias 		= gData.link.match(/^https:\/\/plus.google\.com\/(.+)/)[1];
			user.google.email 		= gData.email;
			user.google.birthdate 	= birthdate;
			user.username 				= gData.name;
			user.firstname 			= phxUtil.strings.capitaliseFirstLetter(gData.given_name);
			user.lastname 				= phxUtil.strings.capitaliseFirstLetter(gData.family_name);
			user.gender 				= (gData.gender == 'male' ? 'm' : 'f');
			user.photo 					= gData.picture;
			user.activated 			= true;

			user.save(function (err, savedUser) {
				if (err) {
					console.log("Couldnt save new user: " + err);
					promise.fail(err);
					return;
				} else {
					console.log("User '" + gData.email + "' created: ");
					promise.fulfill(savedUser);
				}
			});

		}
	});
  
};


/** 
 * Update Authentication Facebook Data with oauth
 * @static
 */
UserSchema.statics.findOrCreateByFacebookData = function (fbUserMetadata, accessToken, accessTokenExtra, promise) {
	
	//phxUtil.strings.var_dump(fbUserMetadata);
	var User = mongoose.model('User');
		
	this.findOne({'facebook.id': fbUserMetadata.id}, function (err, user) {
		
		if (err) {
			console.log("Error in finding user for auth. Check Db.");
			promise.fail(err);
			return;
			
		} else if (user) {
			console.log("User " + fbUserMetadata.email + " found and logged in.");
			promise.fulfill(user);
			
		} else {
			
			var expiresDate = getExpiresDate();	
		  	var user = new User();
			var birthdate = new Date(gData.birthday);
         
			user.facebook.id 				= fbUserMetadata.id;
			user.facebook.accessToken	= accessToken;
			user.facebook.expires		= expiresDate;
			user.facebook.name 			= fbUserMetadata.name;
			user.facebook.firstname		= phxUtil.strings.capitaliseFirstLetter(fbUserMetadata.first_name);
			user.facebook.lastname		= phxUtil.strings.capitaliseFirstLetter(fbUserMetadata.last_name);
			user.facebook.link			= fbUserMetadata.link;
			user.facebook.picture		= fbUserMetadata.picture;
			user.facebook.birthdate		= birthdate;
			user.facebook.gender			= fbUserMetadata.gender;
			user.facebook.locale			= fbUserMetadata.locale;
			user.facebook.alias			= fbUserMetadata.link.match(/^http:\/\/www.facebook\.com\/(.+)/)[1];
			user.facebook.verified		= fbUserMetadata.verified;
			user.facebook.email			= fbUserMetadata.email;
			user.facebook.relationship_status = fbUserMetadata.relationship_status;
			user.facebook.location.name = fbUserMetadata.location.name;
			user.facebook.hometown.name = fbUserMetadata.hometown.name;
			user.username					= fbUserMetadata.name;
			user.firstname					= phxUtil.strings.capitaliseFirstLetter(fbUserMetadata.first_name);
			user.lastname					= phxUtil.strings.capitaliseFirstLetter(fbUserMetadata.last_name);
			user.gender						= (fbUserMetadata.gender == 'male' ? 'm' : 'f');
			user.photo						= fbUserMetadata.picture;
			user.activated 				= true;
			
			user.save(function (err, savedUser) {
				if (err) {
					console.log("Couldnt save new user: " + err);
					promise.fail(err);
					return;
				} else {
					console.log("User '" + fbUserMetadata.email + "' created: ");
					promise.fulfill(savedUser);
				}
			});
		}
	
	});	
};

/** 
 * Update Authentication Twitter Data with oauth2
 * @static
 */
UserSchema.statics.findOrCreateByTwitterData = function (twitterUserMetadata, accessToken, accessTokenExtra, promise) {

	//phxUtil.strings.var_dump(twitterUserMetadata);
	var User = mongoose.model('User');	

	this.findOne({'twitter.id': twitterUserMetadata.id}, function (err, user) {
	
		if (err) {
			console.log("Error in finding user for auth. Check Db.");
			promise.fail(err);
			return;
	
		} else if (user) {
			console.log("User " + twitterUserMetadata.id + " found and logged in.");
			promise.fulfill(user);
	
		} else {
	
		  	var expiresDate = getExpiresDate();
		  	var user = new User();
			
		  	user.twitter.id 					= twitterUserMetadata.id;
		  	user.twitter.accessToken		= accessToken;
		  	user.twitter.expires				= expiresDate;
		  	user.twitter.statuses_count	= twitterUserMetadata.statuses_count;
		  	user.twitter.name					= twitterUserMetadata.name;
		  	user.twitter.screen_name		= twitterUserMetadata.screen_name;
		  	user.twitter.picture				= twitterUserMetadata.profile_image_url;
		  	user.twitter.locale				= twitterUserMetadata.locale;
		  	user.twitter.followers_count	= twitterUserMetadata.followers_count;
		  	user.twitter.description		= twitterUserMetadata.description;
		  	user.twitter.link					= twitterUserMetadata.url;
		  	user.twitter.created_at			= twitterUserMetadata.created_at;
		  	user.twitter.friends_count		= twitterUserMetadata.friends_count;
		  	user.twitter.location			= twitterUserMetadata.location;
		  	user.twitter.time_zone			= twitterUserMetadata.time_zone;
		  	user.twitter.lang					= twitterUserMetadata.lang;
		  	user.username						= twitterUserMetadata.screen_name;
		  	user.photo							= twitterUserMetadata.profile_image_url;
		  	user.gender							= 'm';
		  	user.activated 					= true;
			
		  	user.save(function (err, savedUser) {
		     	if (err) {
		  			console.log("Couldnt save new user: " + err);
		  			promise.fail(err);
		  			return;
		  		} else {
		  			console.log("User '" + twitterUserMetadata.id + "' created: ");
		  			promise.fulfill(savedUser);
		  		}
		  	});
		}	
	});	
};

/** 
 * Update Authentication Linkedin Data with oauth2
 * @static
 */
UserSchema.statics.findOrCreateByLinkedinData = function (linkedinUserMetadata, accessToken, accessTokenExtra, promise) {
	//phxUtil.strings.var_dump(linkedinUserMetadata);
	var User = mongoose.model('User');
	
	this.findOne({'linkedin.id': linkedinUserMetadata.id}, function (err, user) {
	
		if (err) {
			console.log("Error in finding user for auth. Check Db.");
			promise.fail(err);
			return;
	
		} else if (user) {
			console.log("User " + linkedinUserMetadata.id + " found and logged in.");
			promise.fulfill(user);
	
		} else {
	
				var expiresDate = getExpiresDate();
				var user = new User();

				user.linkedin.id 							= linkedinUserMetadata.id;
				user.linkedin.accessToken				= accessToken;
				user.linkedin.expires					= expiresDate;
				user.linkedin.associations				= linkedinUserMetadata.associations;
				user.linkedin.firstname					= phxUtil.strings.capitaliseFirstLetter(linkedinUserMetadata.firstName);
				user.linkedin.lastname					= phxUtil.strings.capitaliseFirstLetter(linkedinUserMetadata.lastName);
				user.linkedin.headline					= linkedinUserMetadata.headline;
				user.linkedin.honors						= linkedinUserMetadata.honors;
				user.linkedin.industry					= linkedinUserMetadata.industry;
				user.linkedin.interests					= linkedinUserMetadata.interests;
				user.linkedin.location.name			= linkedinUserMetadata.location.name;
				user.linkedin.numConnections			= linkedinUserMetadata.numConnections;
				user.linkedin.numRecommenders			= linkedinUserMetadata.numRecommenders;
				user.linkedin.picture					= linkedinUserMetadata.pictureUrl;
				user.linkedin.link						= linkedinUserMetadata.publicProfileUrl;
				user.linkedin.specialties				= linkedinUserMetadata.specialties;
				user.linkedin.summary					= linkedinUserMetadata.summary;
				user.username								= phxUtil.strings.capitaliseFirstLetter(linkedinUserMetadata.firstName)+"-"+phxUtil.strings.capitaliseFirstLetter(linkedinUserMetadata.lastName);
				user.firstname								= phxUtil.strings.capitaliseFirstLetter(linkedinUserMetadata.firstName);
				user.lastname								= phxUtil.strings.capitaliseFirstLetter(linkedinUserMetadata.lastName);
				user.photo									= linkedinUserMetadata.pictureUrl;
				user.gender									= 'm';
				user.activated 							= true;

				user.save(function (err, savedUser) {
					if (err) {
						console.log("Couldnt save new user: " + err);
						promise.fail(err);
						return;
					} else {
						console.log("User '" + linkedinUserMetadata.id + "' created: ");
						promise.fulfill(savedUser);
					}
				});
			}	
	});	
};


exports = module.exports = mongoose.model('User', UserSchema);