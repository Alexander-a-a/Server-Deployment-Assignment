var express = require('express');
var router = express.Router();
const isAuth = require('../middleware/auth');

/* GET home page. */
router.get('/', async function (req, res, next) {
	res.send("main page");
});





// TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST
// router.get('/participants', isAuth, handler);