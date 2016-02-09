var express = require('express');
var router = express.Router();

var adminController = require('./../controllers/admin.controller.server');

/* GET home page. */
router.get('/', function(req, res) {
  return adminController.home(req,res);
});

module.exports = router;
