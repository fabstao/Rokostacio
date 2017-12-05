var express = require('express');
var router = express.Router();
var multer = require('multer');

var mongo = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var malla = require("gridfs-stream");
var writestream;
var grfs;

// Inicializa toda la base de datos con GRFS

var db = new mongo.Db('rokostacio', new mongo.Server("127.0.0.1", 27017));
db.open(function (err) {
  if (err) console.log(err);
  grfs = malla(db, mongo);
  console.log("Conectado a DB");
});

//var subidas = multer( { dest: './uploads/' } );
router.use(multer( { dest: './uploads/' } ).single('archivo') );

router.get('/uploads/:fileId',  function(req, res, next) {
    var elid=new ObjectID(req.params.fileId);
    console.log(req.params.fileId);
    var datos=db.collection("fs.files");
    datos.update({ "_id": elid, "metadata.rola" : /.*/  }, { $inc: { "metadata.tocadas" : 1 }}, function(err,result){
        console.log(err);
        console.log(result.result);
    });
    var tocadas=0;
    //datos.save( { _id : req.params.fileId, "metadata.tocadas" : { $add: [ "$tocadas" , 1  ]} });
    var readstream = grfs.createReadStream({
        "_id": req.params.fileId,
        "metadata.aprobada": "si"
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

router.get('/foto',  function(req, res, next) {
    var foto;
    var lista;
    var db = req.app.locals.db;
    
    var datos=db.collection('fs.files');
    //var rola=datos.find({},{ limit: 1, skip: '_rand()'  }).toArray();
    var cuenta;
    datos.find( { "metadata.tipo" : "foto" } ).count(function(err,count){
        console.log(err);
        var irid = Math.random();
        irid = Math.ceil(irid * count)-1;
        console.log(irid);
        var options = {
            limit: 1,
            skip: irid
        };
        console.log('Filas: ' + count);
        datos.find({ "metadata.rola" : /.*/ },options).toArray(function(err,foto){
            console.log(err);
            foto.forEach(function(lista) {
                if(!grfs) console.log("No llega el objeto grfs");
                console.log("Foto ID:" + lista._id);
                console.log(foto);
                var readstream = grfs.createReadStream({
                    _id: lista._id
                });
                readstream.on('error', function (err) {
                    console.log("Error stream ! " + err);
                });
                //readstream.contents;
                console.log(readstream.contents);
                readstream.pipe(res);
                });
        });
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
        console.log(foto);
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
        console.log("");    
    });
});

module.exports = router;
