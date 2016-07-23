var ObjectId = require('mongodb').ObjectID;
var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var Mensaje = require('../models/message')
var mongoose = require('mongoose'); 
/* GET home page. */
router.get('/', function(req, res, next) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  console.log("Nueva conexión desde " + ip);
  //console.dir(req);
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
    console.log("###DBG " + req.user.username + " se ha conectado.");
    res.redirect('/main');
});

// process a new message form
router.post('/enviarmensaje', isLoggedIn, function(req, res) {
  console.log("###DBG Nuevo Mensaje");
  console.log("Para " + req.body.dest);
  console.log("Contenido " + req.body.text)
  var nuevoMensaje = new Mensaje({
        text: req.body.text,
        author: req.user.username,
        dest: req.body.dest,
        roleDest: req.body.roleDest,
        created: Date.now(),
        leido: false
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
  res.redirect(200, '/main');
});

// process the role change form
router.post('/enviarrol', isLoggedIn, function(req, res) {
  console.log("###DBG Se pretende editar el rol de " + req.body.username + " " + req.body.id.replace(/\"/g,''));
  var unID =  req.body.id.replace(/\"/g,'');
  console.log(unID);
  Account.findOneAndUpdate({username:req.body.username}, {rol:req.body.roleDest}, function(err, user) {
    if (err) {
      console.log(id + ' no existe.');
      res.status(404);
      var err = new Error('Not Found');
      err.status = 404;
      return err;
    }
  });
  res.redirect(200, '/main');
});

// process a password reset form
router.post('/resetpwd', isLoggedIn, function(req, res) {
  Account.findOne({_id:req.body.userResetId}).then(function(user){
    console.log(user.username + "?");
    user.setPassword("prueba", function(){
      user.save();
      console.log("###DBG Se reseteo el password de " + user.username);
    })
  });

  res.redirect(200, '/main');
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

// ------------------------------------------------------------------
// MAIN SECTION =====================================================
// ------------------------------------------------------------------
router.get('/main', isLoggedIn, function(req, res) {
	console.log("Cargando la Pagina principal.");
  console.log("Buscando mensajes para " + req.user.username)
  Mensaje.find ({ dest:req.user.username}, "_id author dest roleDest text creado" , function(err, docs){
    if (err) {
      return console.error(err);
    } else {
      // Si es gerente:
      Account.find({}, "username rol createdAt", function (err, users){
          if (err) {
            return console.error(err);
          } else {
            console.log(users);
            res.render('main', {
              me: req.user,
              users : users,
              docs: docs
            });
          }
      });       
    }
  });
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}

module.exports = router;


