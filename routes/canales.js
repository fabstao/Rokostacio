var express = require('express');
var router = express.Router();

var mongo = require('mongodb');
var malla = require("gridfs-stream");
var dbconfs = require('../conf.js');
var writestream;
var grfs;


// Inicializa toda la base de datos con GRFS
console.log("DBServer: " + dbconfs.dbserver);
console.log("DBName: " + dbconfs.dbname);
var db = new mongo.Db(dbconfs.dbname, new mongo.Server(dbconfs.dbserver, dbconfs.dbport));
db.open(function (err) {
  if (err) console.log(err);
  grfs = malla(db, mongo);
  console.log("Conectado a DB rradio");
});


/* ROCK */
router.get('/canales/rock', function(req, res, next) {
    var rolaid;
    var fotoid;
    var banda;
    var mgusta;
    var tocadas;
    var larola;
    var itunes;
    var album;
    var google;
    console.log("Sesión: " + req.user);
    var larola;
    //var db=req.app.locals.db;
    var datos=db.collection("fs.files");
    datos.find( { "metadata.genero" : "rock", "metadata.aprobada" : "si" } ).count(function(err,count){
        console.log(err);
        var irid = Math.random();
        irid = Math.ceil(irid * count)-1;
        console.log(irid);
        var options = {
            limit: 1,
            skip: irid
            };
        datos.find({ "metadata.genero" : "rock", "metadata.aprobada" : "si" },options).toArray(function(err,rrola){
            console.log(err);
            rrola.forEach(function(lista) {
                //if(!grfs) console.log("No llega el objeto grfs");
                rolaid=lista._id;
                console.log("Canal rola:" + rolaid);
                banda=lista.metadata.banda;
                console.log("Canal banda: " + banda);
                mgusta=lista.metadata.megusta;
                tocadas=lista.metadata.tocadas;
                larola=lista.metadata.rola;
                album=lista.metadata.album;
                itunes=lista.metadata.itunes;
                google=lista.metadata.google;
                });
            datos.find({ "metadata.banda" : banda, "metadata.tipo" : "foto" }).toArray(function(err,foto) {
                console.log(err);
                foto.forEach(function(lista) {
                    fotoid=lista._id;
                });
                res.render('canales', { title: 'ROCK', usuario: req.user, rola: rolaid, larola: larola,
                                    foto: fotoid, mgusta: mgusta, tocadas: tocadas, album: album, itunes: itunes,
                                      google: google});
            });
        });
    });
    
});

/* ROCK */
router.get('/canales/indie', function(req, res, next) {
    var rolaid;
    var fotoid;
    var banda;
    var mgusta;
    var tocadas;
    var larola;
    var itunes;
    var album;
    var google;
    console.log("Sesión: " + req.user);
    var larola;
    //var db=req.app.locals.db;
    var datos=db.collection("fs.files");
    datos.find( { "metadata.genero" : "indie", "metadata.aprobada" : "si"  } ).count(function(err,count){
        console.log("Error = "+err);
        var irid = Math.random();
        irid = Math.ceil(irid * count)-1;
        console.log("IRID = "+irid);
        var options = {
            limit: 1,
            skip: irid
            };
        datos.find({ "metadata.genero" : "indie", "metadata.aprobada" : "si" },options).toArray(function(err,rrola){
            console.log(err);
            rrola.forEach(function(lista) {
                //if(!grfs) console.log("No llega el objeto grfs");
                rolaid=lista._id;
                console.log("Canal rola:" + rolaid);
                banda=lista.metadata.banda;
                console.log("Canal banda: " + banda);
                mgusta=lista.metadata.megusta;
                tocadas=lista.metadata.tocadas;
                larola=lista.metadata.rola;
                });
            datos.find({ "metadata.banda" : banda, "metadata.tipo" : "foto" }).toArray(function(err,foto) {
                console.log(err);
                foto.forEach(function(lista) {
                    fotoid=lista._id;
                });
                res.render('canales', { title: 'INDIE', usuario: req.user, rola: rolaid, larola: larola,
                                    foto: fotoid, mgusta: mgusta, tocadas: tocadas, album: album, itunes: itunes,
                                      google: google});
            });
        });
    });
    
});

/* METAL */ 
router.get('/canales/metal', function(req, res, next) {
    var rolaid;
    var fotoid;
    var banda;
    var mgusta;
    var tocadas;
    var larola;
    var itunes;
    var album;
    var google;
    //var db=req.app.locals.db;
    var datos=db.collection("fs.files");
    datos.find( { "metadata.genero" : "metal", "metadata.aprobada" : "si" } ).count(function(err,count){
        console.log("Error = "+err);
        var irid = Math.random();
        irid = Math.ceil(irid * count)-1;
        console.log("IRID = "+irid);
        var options = {
            limit: 1,
            skip: irid
            };
        datos.find({ "metadata.genero" : "metal", "metadata.aprobada" : "si"  },options).toArray(function(err,rrola){
            console.log(err);
            rrola.forEach(function(lista) {
                //if(!grfs) console.log("No llega el objeto grfs");
                rolaid=lista._id;
                console.log("Canal rola:" + rolaid);
                banda=lista.metadata.banda;
                console.log("Canal banda: " + banda);
                mgusta=lista.metadata.megusta;
                tocadas=lista.metadata.tocadas;
                larola=lista.metadata.rola;
                });
            datos.find({ "metadata.banda" : banda, "metadata.tipo" : "foto" }).toArray(function(err,foto) {
                console.log(err);
                foto.forEach(function(lista) {
                    fotoid=lista._id;
                });
                res.render('canales', { title: 'METAL', usuario: req.user, rola: rolaid, larola: larola,
                                    foto: fotoid, mgusta: mgusta, tocadas: tocadas, album: album, itunes: itunes,
                                      google: google});
            });
        });
    });
});

/* PODCASTS */
router.get('/canales/podcasts', function(req, res, next) {
    var rolaid;
    var fotoid;
    var banda;
    var mgusta;
    var tocadas;
    var larola;
    var itunes;
    var album;
    var google;
    //var db=req.app.locals.db;
    var datos=db.collection("fs.files");
    datos.find( { "metadata.genero" : "podcast", "metadata.aprobada" : "si" } ).count(function(err,count){
        console.log("Error = "+err);
        var irid = Math.random();
        irid = Math.ceil(irid * count)-1;
        console.log("IRID = "+irid);
        var options = {
            limit: 1,
            skip: irid
            };
        datos.find({ "metadata.genero" : "podcast", "metadata.aprobada" : "si" },options).toArray(function(err,rrola){
            console.log(err);
            rrola.forEach(function(lista) {
                //if(!grfs) console.log("No llega el objeto grfs");
                rolaid=lista._id;
                console.log("Canal rola:" + rolaid);
                banda=lista.metadata.banda;
                console.log("Canal banda: " + banda);
                mgusta=lista.metadata.megusta;
                tocadas=lista.metadata.tocadas;
                larola=lista.metadata.rola;
                });
            datos.find({ "metadata.banda" : banda, "metadata.tipo" : "foto" }).toArray(function(err,foto) {
                console.log(err);
                foto.forEach(function(lista) {
                    fotoid=lista._id;
                });
                res.render('canales', { title: 'PODCASTS', usuario: req.user, rola: rolaid, larola: larola,
                                    foto: fotoid, mgusta: mgusta, tocadas: tocadas, album: album, itunes: itunes,
                                      google: google});
            });
        });
    });
});

/* SOUL */
router.get('/canales/soul', function(req, res, next) {
    var rolaid;
    var fotoid;
    var banda;
    var mgusta;
    var tocadas;
    var larola;
    var itunes;
    var album;
    var google;
    console.log("Sesión: " + req.user);
    var larola;
    //var db=req.app.locals.db;
    var datos=db.collection("fs.files");
    datos.find( { "metadata.genero" : "soul", "metadata.aprobada" : "si" } ).count(function(err,count){
        console.log("Error = "+err);
        var irid = Math.random();
        irid = Math.ceil(irid * count)-1;
        console.log("IRID = "+irid);
        var options = {
            limit: 1,
            skip: irid
            };
        datos.find({ "metadata.genero" : "soul", "metadata.aprobada" : "si" },options).toArray(function(err,rrola){
            console.log(err);
            rrola.forEach(function(lista) {
                //if(!grfs) console.log("No llega el objeto grfs");
                rolaid=lista._id;
                console.log("Canal rola:" + rolaid);
                banda=lista.metadata.banda;
                console.log("Canal banda: " + banda);
                mgusta=lista.metadata.megusta;
                tocadas=lista.metadata.tocadas;
                larola=lista.metadata.rola;
                album=lista.metadata.album;
                itunes=lista.metadata.itunes;
                google=lista.metadata.google;
                });
            datos.find({ "metadata.banda" : banda, "metadata.tipo" : "foto" }).toArray(function(err,foto) {
                console.log(err);
                foto.forEach(function(lista) {
                    fotoid=lista._id;
                });
                res.render('canales', { title: 'SOUL', usuario: req.user, rola: rolaid, larola: larola,
                                    foto: fotoid, mgusta: mgusta, tocadas: tocadas, album: album, itunes: itunes,
                                      google: google});
            });
        });
    });
    
});


module.exports = router;
