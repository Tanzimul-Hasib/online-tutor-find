var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
// router.get('/register',sureAuthenticated, function (req, res) {
// 	res.render('register',{title:"Register", layout: false});
// });

//Login
// router.get('/login', sureAuthenticated, function (req, res) {
// res.render('login',{title:"Login", layout:false});
// });

// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var phone= req.body.phone;
	var email = req.body.email;
	var username = req.body.username;
	var titles = req.body.titles;
	var expertise = req.body.expertise;
	var graduatedFrom = req.body.graduatedFrom;
	var address = req.body.address;
	var fbLink = req.body.fbLink;
	var pplink = req.body.pplink;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('phone', 'Phone Number is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('titles', 'titles is required').notEmpty();
	req.checkBody('expertise', 'expertise is required').notEmpty();
	req.checkBody('graduatedFrom', 'graduatedFrom is required').notEmpty();
	req.checkBody('address', 'address is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.redirect('/register');
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: {
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: {
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail,
						layout:false
					});
				}
				else {
					var newUser = new User({
						name: name,
						email: email,
						phone: phone,
						username: username,
						titles: titles,
						expertise: expertise,
						graduatedFrom: graduatedFrom,
						address: address,
						fbLink: fbLink,
						pplink: pplink,
						password: password
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/login');
				}
			});
		});
	}
});

passport.use('user-local',new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('user-local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/login');
});



// authentication check 

function sureAuthenticated(req,res,next){
     if(req.isAuthenticated()){
         res.redirect('/');
     }
     else {
         //req.flash('error_msg','You are not logged in');
         return next();
     }
};

module.exports = router;