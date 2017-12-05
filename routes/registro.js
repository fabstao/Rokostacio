//*******************************************
//* (C) 2015 NUO Tecnología S de RL de CV
//* fabian@nuo.com.mx
//*******************************************
    
var express = require('express');
var router = express.Router();
var mongo = require('mongodb'),
    MongoClient = require('mongodb').MongoClient,
    Binary = require('mongodb').Binary,
    Grid = require('mongodb').Grid,
    Db = require('mongodb').Db,
    GridStore = require('mongodb').GridStore;
var malla = require("gridfs-stream");
var crypto = require('crypto');
var multer = require('multer');
var fs = require("fs");
var nodemailer = require('nodemailer');
var smtpTx = require('nodemailer-smtp-transport');
var grfs;

var db = new mongo.Db('rokostacio', new mongo.Server("127.0.0.1", 27017));
db.open(function (err) {
    if (err) console.log(err);
    grfs = malla(db, mongo);
    console.log("Conectado a DB");
    });

/* GET users listing. */
router.get('/registro', function(req, res, next) {
  res.render('registro.ejs', { 'title': 'CARGAR' , usuario: req.user });
});

subida=multer( { dest: './uploads/' } );
router.post('/registro', subida.single('archivo'), function(req, res, next) {
    //db = req.app.locals.db;
    var datos = db.collection('usuarios');
    var bandera = true;
    
    datos.find( { "email": req.body.email }, { limit: 1 }).toArray(function(err,chequeo) {
        if(err) {
            console.log(err);
            res.render('error.ejs', { message: err, error: err});
            return("ERROR");
        }
        
        console.log(chequeo);
        console.log(req.body.email);
        if(chequeo.length > 0) {
                console.log("ERROR: Cuenta ya existe");
                res.status(500);
                res.render('error.ejs', { message: "ERROR: Cuenta ya existe", error: "Cuenta ya existe " + req.body.email});
                //return("ERROR");
            }
            
        if(chequeo.length < 1) {
                var banda = req.body.banda;
                var passwd = crypto.createHash('md5').update(req.body.password).digest('hex');
    
                datos.save({ email: req.body.email, banda: req.body.banda, password: passwd, 
                            nombre: req.body.nombre, descripcion: req.body.descripcion });
                  
                //console.log(req.file.path);
                //console.log(req.body);
                console.log(req.body.banda);
                console.log("Arrancando grws...");
                writestream = grfs.createWriteStream({
                    filename: req.file.filename,
                    mode: 'w',
                    metadata: {
                        tipo : "foto",
                        original: req.file.originalname,
                        banda: req.body.banda,
                        descripcion: req.body.descripcion
                    } 
                });
                console.log("WS creado");
                fs.createReadStream(req.file.path).pipe(writestream);
                console.log("Cerrando DB");
                options = { host: "smtpout.secureserver.net", port: "465", auth: { user: "elvis@rokostacio.rocks", pass: "A9b8c7D6!" },
                           secure: true };
                var transportem = nodemailer.createTransport(smtpTx(options));
                console.log("Mandando correo de registro a ... " + req.body.email);
                transportem.sendMail({
                    from: 'elvis@rokostacio.rocks',
                    to: req.body.email,
                    subject: 'Bienvenid@ a ROKOStacio!',
                    html: "<html><body><h2>Gracias por registrarte en ROKOStacio</h2><p>Te damos la bienvenida, puedes comenzar a subir tus piezas. Es importante que sepas que todo material que subas quedará sujeto a aprobación</p><p>Tu nombre de usuario es tu dirección de correo electrónico.</p><h3>Atte. Staff de ROKOStacio</h3><p><a href='http://rokostacio.com'>http://rokostacio.rocks</a></p></body></html>"
                }, function(err, response){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Mensaje enviado de registro a: '+ req.body.email);
                    }
                    console.log("Redireccionando registro -> login");
                    res.redirect(301,'/login');
                });
                
                } 
        });
});

router.post('/registro/perfil', subida.single('archivo'), function(req, res, next) {
    //db = req.app.locals.db;
    var datos = db.collection('usuarios');
    var bandera = true;
    var perfil = req.user;
    var banda = perfil.banda;
    console.log("Perfil: "+JSON.stringify(perfil));
    datos.find( { "email": perfil.email }, { limit: 1 }).toArray(function(err,chequeo) {
        if(err) {
            console.log(err);
            return("ERROR perfiles: "+ err);
        }
        
        console.log("Buscando perfil de banda: "+JSON.stringify(chequeo));
        console.log(req.body);
        chequeo.forEach(function(listado) {
            if(typeof req.body.password !== "undefined") {
                console.log("Cambio con passwd");
                var prepass = req.body.password;
                var passwd = crypto.createHash('md5').update(prepass).digest('hex');
                datos.update({ "_id": listado._id},{  $set: { password: passwd, 
                                                descripcion: req.body.descripcion } }, function(err,datou1){
                    if(err) {
                        console.log("ERR Update con pass: " + err);
                        return(err);
                    }
                    console.log(datou1.result);
                });
            }
            if(typeof req.body.password === "undefined" ) {
                console.log("Cambio sin passwd");
                datos.update({ "_id": listado._id},{ $set: { descripcion: req.body.descripcion } }, function(err,datou2){
                    if(err) {
                        console.log("ERR Update con pass: " + err);
                        return(err);
                    }
                    console.log(datou2.result);
                });
            }
        });
        
        var rkblob = db.collection('fs.files');
        if(req.file) {
            console.log(req.file);
            rkblob.find({ "metadata.tipo": "foto", "metadata.banda": banda }, { "limit": 1 }).toArray(function(err, mandar){
                if(err) console.log("ERROR buscando file id perfil: " + err);
                mandar.forEach(function(lista) {
                    grfs.remove({ "_id": lista._id}, function(err,dato){
                        if(err) console.log("Error borrando chunks: "+err);
                        console.log("Etapa de borrado chunks");
                        console.log("Arrancando grws...");
                        writestream = grfs.createWriteStream({
                            filename: req.file.originalname,
                            mode: 'w',
                            metadata: {
                                tipo : "foto",
                                original: req.file.originalname,
                                banda: banda
                                }
                            });
                        console.log("Abriendo stream de escritura");
                        fs.createReadStream(req.file.path).pipe(writestream);
                        console.log("Grid File creado");
                        fs.unlink(req.file.path, function(err,data) {
                            if(err) console.log("FS Error: " + err);
                            console.log(data);
                        }); 
                        //res.render("puente", {});
                        
                        /* datos.find({ "email": perfil.email }, { limit: 1 }).toArray(function(err,poblar){
                        if(err) console.log(err);
                            poblar.forEach(function(lista) {
                                rkblob.find({ "metadata.tipo": "foto", "metadata.banda": lista.banda }).toArray(function(err, mandar){
                                    if(err) console.log(err);
                                    mandar.forEach(function(lista2) { */
                                    //rkblob.find({ "metadata.rola" : /.*/ , "metadata.banda" : lista.banda}).toArray(function(err,rola){
                                    /* if(err) console.log("PERFIL ERR: " + err);
                                    res.render('perfil.ejs', { "usuario": req.user, "email": perfil.email, "banda": lista.banda, 
                                      "nombre": lista.nombre, "descripcion": lista.descripcion, "foto": lista2._id,
                                        "rolas" : rola });
                                            });
                                        });
                                    });
                                });
                            }); */
                        });
                    });
                
                
            }); 
        }
        res.render("puente", {});
        //res.redirect(301,'/registro/perfil');
        
    });
});

router.get('/registro/perfil', function(req, res, next) {
    var datos = db.collection('usuarios');
    var rkblob = db.collection('fs.files');
    var perfil = req.user;
    console.log(JSON.stringify(perfil));
    datos.find({ "email": perfil.email }, { limit: 1 }).toArray(function(err,poblar){
        if(err) console.log(err);
        poblar.forEach(function(lista) {
            rkblob.find({ "metadata.tipo": "foto", "metadata.banda": lista.banda }).toArray(function(err, mandar){
                if(err) console.log(err);
                console.log("GET perfil "+mandar);
                if(mandar.length < 1) {
                    console.log("No hay foto");
                    return("ERROR no hy foto");
                    res.status(500).send("ERROR de foto");
                }
                mandar.forEach(function(lista2) {
                    rkblob.find({ "metadata.rola" : /.*/ , "metadata.banda" : lista.banda}).toArray(function(err,rola){
                        if(err) console.log("PERFIL ERR: " + err);
                        res.render('perfil.ejs', { "usuario": req.user, "email": perfil.email, "banda": lista.banda, 
                                      "nombre": lista.nombre, "descripcion": lista.descripcion, "foto": lista2._id,
                                        "rolas" : rola });
                        });
                    });
            });
        });
    });
});

module.exports = router;
