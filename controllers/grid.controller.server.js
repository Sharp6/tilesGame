var daFactory = require("../da/daFactory.da.server");
var repoFactory = require("../repositories/repositoryFactory.repository.server");
var Grid = require("../models/grid.model.server");

var GridController = function() {

	var getGrids = function(req,res) {
			loadGrids()
			.then(function(grids) {
				res.json(grids);
			})
			.catch(function(err) {
				console.log(err);
				res.status(500).send(err);
			});
	}

	var loadGrids = function() {
		return daFactory.grid.loadMultiple()
			.then(function(gridsData) {
				var gridPromises = gridsData.map(function(gridData) {
					var grid = new Grid();
					// OPTIMIZE: this loads the griddata again...
					return grid.load(gridData.gridId);
				});
				return Promise.all(gridPromises);
			});
	}

	var getGrid = function(req,res) {
		loadGrid(req.gridId)
			.then(function(grid) {
				res.json(grid);
			})
			.catch(function(err) {
				console.log(err);
				res.status(500).send(err);
			});
	}

	var loadGrid = function(gridId) {
		return repoFactory.grid.load(gridId)
			.then(function(grid) {
				
			})
	}

	var createGrid = function(req,res) {
		var grid = new Grid();
		grid.init({});
		res.send("I have no clue");
	}

	var doMove = function(req,res) {
		// load grid

		// 
	}

	return {
		getGrids: getGrids,
		loadGrids: loadGrids,
		createGrid: createGrid
	}
}

module.exports = new GridController;