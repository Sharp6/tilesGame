var express = require('express');
var router = express.Router();

var gridController = require('./../controllers/grid.controller.server');

/* GET home page. */
router.get('/grids', function(req, res) {
  return gridController.getGrids(req,res);
});

router.get('/actions/createGrid', function(req,res) {
	return gridController.createGrid(req,res);
});

module.exports = router;
