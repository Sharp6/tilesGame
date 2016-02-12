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
		// This function checks too much. It should only check if the grid and tile can be loaded, not whether the tile is in a moveable position.
		// It should then create a MOVE COMMAND, but I don't think the grid model should do that. Rather, a command should be a separate object with a reference to the grid, the tile, and an execute method.
		// This means that a grid does not have a reference to its commands? (otherwise: circular references.)
		loadGrid(req.params.gridId)
			.then(function(grid) {
				var tileToMove = grid.tiles.find(function(aTile) {
					return aTile.tileId === req.params.tileId;
				});
				if(tileToMove) {

					// Here, a transition to the domain should be made
					if(grid.isLegalMove(tileToMove)) {
						grid.execute("move", tileToMove);
						var answer = {
							resultStatus: 'success',
							grid: grid
						}
						res.send(answer);
						return grid;
					} else {
						var answer = {
							resultStatus: "Tile is not in a movable position.",
							grid: grid
						}
						res.send(answer);
						return false;
					}
				// Below is the responsibility of the controller.
				} else {
					console.log("ERROR: tile not found");
					res.status(500).send("Tile not found");
					return false;
				}
			})
			// I don't think the grid should be saved here, the domain should handle that
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