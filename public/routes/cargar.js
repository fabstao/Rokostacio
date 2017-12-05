var express = require('express');
var session = require('express-session');
var router = express.Router();

/* GET users listing. */
router.get('/cargar', function(req, res, next) {
    console.log("Cargar rola: "+req.user);
    res.render('cargar.ejs', { usuario : req.user });
});

module.exports = router;
