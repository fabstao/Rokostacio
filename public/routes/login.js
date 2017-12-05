var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var smtpTx = require('nodemailer-smtp-transport');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET users listing. */
router.get('/login', function(req, res, next) {
    var mensaje=req.flash('error');
    res.render('login.ejs', { 'mensaje': mensaje});
});

router.get('/login/loolvide', function(req, res, next) {
    var mensaje=req.flash('error');
    var mensaje="Revisa tu correo, recibirás instrucciones para tu nueva contraseña (checa en spam si no lo ves en 10 minutos)";
    if(req.query.mensaje ==="nok" ) mensaje="Dirección de correo-e no encontrada";
    res.render('loolvide.ejs', { 'mensaje': mensaje});
});

router.post('/login/loolvide', urlencodedParser, function(req, res, next) {
    db = req.app.locals.db;
    var recupera = db.collection("usuarios");
    var email = req.body.email;
    console.log("Generando hash en recuperacion: " + email);
    var prepass = Date.now();
    prepass = String(prepass,{});
    console.log("Prepass: " + prepass + "Type: "+ typeof prepass);
    var passd = crypto.createHash('md5').update(prepass).digest('hex');
    var passwd = passd.substring(0,8);
    var cpasswd = crypto.createHash('md5').update(passwd).digest('hex');
    console.log("Has recuperado: " + cpasswd);
    recupera.update({ "email" : email }, { $set: { "password": cpasswd }}, function(err,respt) {
        if(err) console.log(err);
        console.log("Passwd modificado: " + respt.result);
        console.log(typeof respt.result + " elementos ");
        for ( var prop in respt.result ) {
            console.log("elemento: " + prop);
        }
        if(typeof respt.result.nModified ==="undefined") { 
            console.log("ERROR: contraseña no actualizada");
            res.redirect("/login/loolvide?mensaje=nok");
            return("ERROR"); 
        }
        if(respt.result.nModified > 0) {
            var options = { host: "smtpout.secureserver.net", port: "465", auth: { user: "elvis@rokostacio.rocks", pass: "Valtis23#" },
                           secure: true };
            var transportem = nodemailer.createTransport(smtpTx(options));
                console.log("Mandando correo de registro a ... " + req.body.email);
                transportem.sendMail({
                    from: 'elvis@rokostacio.rocks',
                    to: email,
                    subject: 'ROKOSTACIO: Recuperacion de cuenta',
                    html: "<html><body><h2>Recuperaci&oacute;n de cuenta</h2><p>Tu nueva contraseña es: <b>"+passwd+"</b></p><h3>Atte. Staff de ROKOStacio</h3><p><a href='http://rokostacio.com'>http://rokostacio.rocks</a></p></body></html>"
                }, function(err, response){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Mensaje enviado de registro a: '+ req.body.email);
                    }
                    //if(resp.response.modif=="") resp
                    res.redirect("/login");
                });
        }
    });
});

module.exports = router;
