var User = require('../models/user');
var express = require('express');
var router = express.Router();

//get homepage
router.get('/',function (req,res) {
    res.render('index',{title:"Home"});
});
// router.get('/about',function (req,res) {
//     res.render('about',{title:"About"});
// });


router.get('/about',function (req,res) {

    User.find( function (err, result) {

        if (err){
            return;
        }

        res.render('about',{
         title:"About",
         teachers:result
        });
    });
});




router.get('/contact',function (req,res) {
    res.render('contact',{title:"Contact"});
});
router.get('/login', sureAuthenticated, function (req, res) {
res.render('login',{title:"Login", layout:false});
});

router.get('/register',sureAuthenticated, function (req, res) {
	res.render('register',{title:"Register", layout: false});
});
// router.get('/',ensureAuthenticated,function (req,res) {
//     res.render('index',{title:"Home"});
// });

function ensureAuthenticated(req,res,next){
     if(req.isAuthenticated()){
         return next();
     }
     else {
         //req.flash('error_msg','You are not logged in');
         res.redirect('/users/login');
     }
};
module.exports= router;
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