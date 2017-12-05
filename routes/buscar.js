var express = require('express');
var router = express.Router();
//var multer = require('multer');
var ObjectID = require('mongodb').ObjectID;

var malla = require("gridfs-stream");
var writestream;
var grfs;

// Inicializa toda la base de datos con GRFS

//var db = new mongo.Db('rokostacio', new mongo.Server("127.0.0.1", 27017));

//var subidas = multer( { dest: './uploads/' } );
//router.use(multer( { dest: './uploads/' } ).single('archivo') );

router.get('/buscar', function( req, res, next ) {
    res.render('buscar.ejs', { matriz : {"1":"hola","2":"a" }});
    var sesion = req.user;
    console.log(req.user);
    /* if( !req.user ) {
        res.redirect(301,"/login");
        return null;
    } */
    var db = req.app.locals.db;
    var datos=db.collection('fs.files');
    datos.find({ "metadata.rola" : /.*/ , "metadata.aprobada" : "no"}).toArray(function(err,lista){
        console.log(err);
        res.render('buscar.ejs', { matriz : lista, usuario : sesion });
    }); 
    //res.render('buscar.ejs', { matriz : "hola" });
});

router.get('/buscar/:rola',  function(req, res, next) {
    var db=req.apps.locals.db;
  
    db.open(function (err) {
        if (err) console.log(err);
        grfs = malla(db, mongo);
        console.log("Conectado a DB");
     });
    var elarchivo="Si ves esto, no jaló";
  console.log(req.params.fileId);  
  var readstream = grfs.createReadStream({
    //_id: req.params.fileId
    metadata: {
        banda: req.params.banda
    }
  });
  req.on('error', function(err) {
      console.log("Error REQ");
      res.send(500, err);
  });
  readstream.on('error', function (err) {
      console.log("Error stream");
      res.send(500, err);
  });
  readstream.contents;
  console.log(readstream.contents);
  readstream.pipe(res);
  //res.render('uploads.ejs', { 'title': 'FILES', valor: req.body.valor, archivo: elarchivo });
});

module.exports = router;
