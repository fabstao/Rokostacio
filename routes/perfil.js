var express = require('express');
var mongo = require('mongodb');
var malla = require("gridfs-stream");
var crypto = require('crypto');
var multer = require('multer');
var fs = require("fs");
var router = express.Router();
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
    
                datos.save({ email: req.body.email, banda: req.body.banda, password: passwd });
                  
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
                    }
                });
                console.log("WS creado");
                fs.createReadStream(req.file.path).pipe(writestream);
                console.log("Cerrando DB");
    
                res.redirect(301,'/');
                }
            
        });
    
});

router.get('/registro/perfil', function(req, res, next) {
    var datos = db.collection('usuarios');
    var foto = db.collection('fs.files');
    var perfil = req.user;
    datos.find({ "email": perfil.email }, { limit: 1 }).toArray(function(err,poblar){
        if(err) console.log(err);
        poblar.forEach(function(lista) {
            res.render('perfil.ejs', { "usuario": req.user, "email": perfil.email, "banda": lista.banda });        
        });
    });
    
});

module.exports = router;
