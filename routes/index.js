var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var Mensaje = require('../models/message')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	title: 'IntranetMSGS',
  	user: req.user
   });
});

// get the signin form
router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'IntranetMSGS - Nuevo registro' });
});

// get the login form
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'IntranetMSGS - Usuario registrado' });
});

// process the login form
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/main');
});

router.post('/enviarmensaje', isLoggedIn, function(req, res) {
  console.log("###DBG Nuevo Mensaje");
  console.dir(req.body);
  var nuevoMensaje = new Mensaje({
        text: req.body.text,
        author: req.user.username,
        dest: req.body.dest,
        roleDest: req.body.roleDest,
        created: Date.now()
      });
  nuevoMensaje.save( function(err, res){
    if (err) {
      res.render('error', {
        message: err.message,
        error: err
      });
    } else {
      console.log("Mensaje nuevo guardado.")
    }
  });
  res.redirect('/main', { });
});

// process the signin form
router.post('/signin', function(req, res) {
	console.log("###DBG Nuevo Usuario");
	console.dir(req.body);
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {return res.render('signin', {
            	account : Account,
            	message : err
            });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/main');
        });
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// MAIN SECTION =========================
router.get('/main', isLoggedIn, function(req, res) {
	console.log("Cargando la Pagina principal.");
	var msgsAll = 0;
  Mensaje.find ({}, function(err, docs){
    msgsAll = docs;
    console.dir(docs);
  })
  res.render('main', {
    user: req.user,
    messages: msgsAll
  })
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}

module.exports = router;


