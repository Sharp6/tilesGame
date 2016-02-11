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
		console.log("Getting grid in gridcontroller.");
		loadGrid(req.params.gridId)
			.then(function(grid) {
				res.json(grid);
			})
			.catch(function(err) {
				console.log(err);
				res.status(500).send(err);
			});
	}

	var loadGrid = function(gridId) {
		return repoFactory.grid.load(gridId);
	}

	var createGrid = function(req,res) {
		var grid = new Grid();
		grid.init({});
		res.send("I have no clue");
	}

	var doMove = function(req,res) {
		loadGrid(req.params.gridId)
			.then(function(grid) {
				var tileToMove = grid.tiles.find(function(aTile) {
					return aTile.tileId === req.params.tileId;
				});
				if(tileToMove) {
					if(grid.isLegalMove(tileToMove)) {
						grid.execute("move", tileToMove);
						res.send("Tile has been moved");
						return grid;
					} else {
						res.send("Tile is not in a movable position.");
						return false;
					}
				} else {
					console.log("ERROR: tile not found");
					res.status(500).send("Tile not found");
					return false;
				}
			})
			.then(function(grid) {
				if(grid) {
					grid.save();
				}
			})
			.catch(function(err) {
				console.log(err);
				res.status(500).send(err);
			});
	}

	return {
		getGrids: getGrids,
		loadGrids: loadGrids,
		createGrid: createGrid,
		getGrid: getGrid,
		loadGrid: loadGrid,
		doMove: doMove
	}
}

module.exports = new GridController;