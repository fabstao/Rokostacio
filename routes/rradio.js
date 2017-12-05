var express = require('express');
var router = express.Router();
var multer = require('multer');

var mongo = require('mongodb');
var malla = require("gridfs-stream");
var ObjectID = require('mongodb').ObjectID;
var writestream;
var grfs;

// Inicializa toda la base de datos con GRFS
var db = new mongo.Db('rokostacio', new mongo.Server("127.0.0.1", 27017));
db.open(function (err) {
  if (err) console.log(err);
  grfs = malla(db, mongo);
  console.log("Conectado a DB rradio");
});

//var db = new mongo.Db('rokostacio', new mongo.Server("127.0.0.1", 27017));
//var subidas = multer( { dest: './uploads/' } );

// db.fs.files.find().limit( 1 ).skip( _rand() * db.fs.files.count() ) query random

router.use(multer( { dest: './uploads/' } ).single('archivo') );

router.get('/rradio',  function(req, res, next) {
    var rrola;
    var lista;
    var db = req.app.locals.db;
    
    var datos=db.collection('fs.files');
    //var rola=datos.find({},{ limit: 1, skip: '_rand()'  }).toArray();
    var cuenta;
    datos.find( { "metadata.rola" : /.*/ , "metadata.aprobada" : "si" } ).count(function(err,count){
        console.log(err);
        var irid = Math.random();
        irid = Math.ceil(irid * count)-1;
        console.log(irid);
        var options = {
            limit: 1,
            skip: irid
        };
        console.log('Filas: ' + count);
        datos.find({ "metadata.rola" : /.*/, "metadata.aprobada": "si" },options).toArray(function(err,rrola){
            if(err) {
                console.log(err);
                return (err);
            }
            rrola.forEach(function(lista) {
                if(!grfs) console.log("No llega el objeto grfs");
                console.log("Rola ID: " + lista._id );
                datos.update({ "_id" : lista._id }, { $inc: { "metadata.tocadas" : 1 }}, function(err,result){
                    if(err) { 
                        console.log(err);
                        return("Error: " + err);
                    }
                    console.log(result.result);    
                }); 
                console.log("Rola: " + lista.metadata.rola + " , Tocadas: " + lista.metadata.tocadas);
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
        console.log(rrola);
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
        console.log("");    
    });
});

router.get('/rradio/megusta',  function(req, res, next) {
    var rrola;
    var lista;
    var rstats=db.collection('rstats');
    var datos=db.collection('fs.files');
    var elid = new ObjectID(req.query.id);
    console.log("Query ID: " +req.query.id);
    rstats.find( { "megusta.userid": req.query.userid , "megusta.rolaid": req.query.id } ).toArray(function(err,result1) {
        if(err) {
            console.log(err);
            res.status(500).send("NOK Falla");
            return(err);
        }
        console.log(typeof result1);
        console.log(result1);
        if((result1.length < 1) && (req.query.userid !== "")) {
            console.log("Query para checar si ya dio like: "+result1.length);
            rstats.insert({ "megusta": { "userid": req.query.userid, "rolaid": req.query.id }}, 
                    function(err,uresult) {
                console.log(err);
                console.log(uresult.result);
            });
            
            datos.update({ "_id" : elid }, { $inc: { "metadata.megusta" : 1 }}, function(err,result2){
                if(err) { 
                    console.log(err);
                    return("Error: " + err);
                    }
                console.log(result2.result);
                });
                //res.send("OK");
        }
        console.log("Type of elid: " + typeof elid + " -- ELID: " + elid);
        datos.find({ "_id" : elid }, { limit: 1 }).toArray(function(err,rfin) {
                if(err) { 
                    console.log(err);
                    return("Error: " + err);
                    }
                if(rfin.length < 1 ) res.status(500).send("NOK error de DB ");
                rfin.forEach(function(flista){
                    console.log("Me gusta: " + flista.metadata.megusta);
                    res.send("" + flista.metadata.megusta);
                });
        });
        
    });
        //res.status(404).send("NOK");
});

router.get('/rradio/aprobar', function(req, res, next) {
    var datos=db.collection('fs.files');
    var elid = new ObjectID(req.query.borrar);
    console.log("aprobar el ID: " +elid);
    if(req.query.borrar) {
        datos.update({ "_id" : elid }, { $set: { "metadata.aprobada" : "si" }}, function(err,result){
                if(err) { 
                    console.log("ERROR: "+err);
                    res.status(500).send("NOK");
                    return("Error: " + err);
                }
                console.log(result.result);
                res.send("OK");
            });
    }
});

router.get('/rradio/borrar', function(req, res, next) {
    var datos=db.collection('fs.files');
    var chunks=db.collection('fs.chunks');
    var elid = new ObjectID(req.query.borrar);
    console.log("borrar pieza ID: " +elid);
    if(req.query.borrar) {
        datos.remove({ "_id" : elid }, function(err,result){
            if(err) { 
                console.log("ERROR: "+err);
                res.status(500).send("NOK");
                return("Error: " + err);
            }
            chunks.remove({ "_id" : elid}, function(err,lista){
                if(err) { 
                    console.log("ERROR: "+err);
                    res.status(500).send("NOK");
                    return("Error: " + err);
                }
            });
            console.log(result.result);
            res.send("OK");
            });
    }
});

module.exports = router;
