var express = require('express');
var session = require('express-session');
var path = require('path');
var crypto = require('crypto');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var subidas = multer( { dest: './uploads/' } );
var fs = require("fs");
//var bcrypt = require('bcrypt');
var flash = require('connect-flash');

var routes = require('./routes/index.js');
var canales = require('./routes/canales.js');
var rradio = require('./routes/rradio.js');
var cargar = require('./routes/cargar.js');
var users = require('./routes/users.js');
var registro = require('./routes/registro.js');
var login = require('./routes/login.js');
var uploads = require('./routes/uploads.js');
var buscar = require('./routes/buscar.js');
var mongo = require('mongodb');
var malla = require("gridfs-stream");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
   , FacebookStrategy = require('passport-facebook').Strategy;
var writestream;
var grfs;

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Inicializa Express 4.x

var app = express();

// Inicializa toda la base de datos con GRFS

var db = new mongo.Db('rokostacio', new mongo.Server("127.0.0.1", 27017));
db.open(function (err) {
  if (err) console.log(err);
  grfs = malla(db, mongo);
  console.log("Conectado a DB");
});

// Inicializa sistema de autenticación

//function encuentraEmail(email, fn) {
//console.log("Arranca encuentraEmail");
var User=db.collection('usuarios');
   
// Express inicializa passport

app.use(flash());
app.use(session({ resave: true, saveUninitialized: false, secret: 'fkfkf2015' }));

passport.use(new LocalStrategy( { 
    usernameField: 'email',
    passwordField: 'password'
    //passReqToCallback : true
    },
    function(email, password, done) {
    console.log('Inicia passport');
    console.log('inicializa encuentraEmail() para "',email,'"');
    User.findOne({ 'email' :  email }, function(err, user) {
            if (err)
                return done(err);
            //console.log(JSON.stringify(user));
            console.log(user);
            // if no user is found, return the message
            if (!user)
                return done(null, false, { message : 'No existe el email' } ); 
            
            console.log('Password: ' + user.password + ' !! hash: ' + password);
            var compara = crypto.createHash('md5').update(password).digest('hex');
            console.log('Password: ' + user.password + ' !! hash: ' + compara);
            if (compara != user.password) {
                return done(null, false, { message : 'Contraseña inválida'}); // 
            }
            return done(null, user);
        });
    //});
}));

passport.use(new FacebookStrategy({
    clientID: "176542362693823",
    clientSecret: "5803a558d9c4665d5fa269e1db3be76c",
    callbackURL: "https://www.rokostacio.rocks/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
        var fbuser = { "id" : "" , "email" : "ROKOStacio Fan" ,"band" : "Público" , "extras" : "" };
        var palogs = JSON.stringify(profile);
        console.log("FB: "+palogs);
        fbuser.id = profile.id;
        fbuser.email = profile.displayName;
        fbuser.band = "Público";
        done(null, fbuser);
  }
));


// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    console.log('Sesión ' + JSON.stringify(user));
    done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    var esto = "usuario";
    console.log('Logout: ' + JSON.stringify(id));
    if(typeof id !== "undefined") esto = id.email; 
    done(null,id);
    });


// Puebla DB a los módulos

app.locals.db = db;

subida=multer( { dest: './uploads/' } );
app.post("/subir.php7",subida.single('archivo'),function(req,res, next) {
//app.post("/subir.php7",subida.array(),function(req,res, next) {
    console.log(req.file.path);
    console.log(req.user);
    console.log(req.body.banda);
    console.log("Arrancando grws...");
    //console.log(grfs);
    writestream = grfs.createWriteStream({
       filename: req.file.filename,
       mode: 'w',
       metadata: {
            creadopor: "NUO",
            original: req.file.originalname,
            banda: req.body.banda,
            rola: req.body.rola,
            genero: req.body.genero,
            megusta: parseInt(0),
            tocadas: parseInt(0),
            aprobada: 'no',
            album: req.body.album,
            itunes: req.body.itunes,
            google: req.body.google
       }
    });
    console.log("WS creado");
    fs.createReadStream(req.file.path).pipe(writestream);
    console.log("Cerrando DB");
    fs.unlink(req.file.path, function(err,data) {
        if(err) console.log("FS Error: " + err);
    });
    res.redirect(301,'/');
   //db.close();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('uploads', path.join(__dirname, 'uploads'));
app.set('html', path.join(__dirname, 'html'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
//app.use(bodyParser({ keepExtensions: true, uploadDir: '/uploads' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//GETs

app.use('/', routes);
app.get('/rradio', rradio);
app.get('/rradio/megusta', rradio);
app.get('/buscar',buscar);
app.get('/cargar',cargar);
app.get('/buscar/:banda',buscar);
app.get('/uploads/:fileId',uploads);
app.get('/login', login);
app.get('/login/loolvide', login);
app.get('/registro', registro);
app.get('/registro/perfil', registro);
app.get('/canales/rock', canales);
app.get('/canales/metal', canales);
app.get('/canales/indie', canales);
app.get('/canales/soul', canales);
app.get('/canales/podcasts', canales);
app.get('/rradio/aprobar', rradio);
app.get('/rradio/borrar', rradio);

//POSTs
app.post('/users', users);
app.post('/login/loolvide', login);
app.post('/uploads', uploads);
app.post('/registro', registro);
app.post('/registro/perfil', registro);
app.post('/login', urlencodedParser, passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
