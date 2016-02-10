var express = require('express');
var router = express.Router();

var commandController = require('./../controllers/command.controller.server')();

/* GET home page. */
router.get('/move', function(req, res) {
  return commandController.move(req,res);
});

module.exports = router;
