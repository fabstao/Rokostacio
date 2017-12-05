var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("Sesión: " + req.user);
    res.render('index', { title: 'ROKOSTACIO', usuario: req.user });
});

module.exports = router;
