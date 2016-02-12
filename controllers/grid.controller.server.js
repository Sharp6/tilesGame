var repoFactory = require("../repositories/repositoryFactory.repository.server");
var commandFactory = require("../commands/commandFactory.command.server");

// These two should not be needed here, a repo should hand back all objects.
var daFactory = require("../da/daFactory.da.server");
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
		repoFactory.grid.load(req.params.gridId)
			.then(function(grid) {
				res.json(grid);
			})
			.catch(function(err) {
				console.log(err);
				res.status(500).send(err);
			});
	}

	/*
	var loadGrid = function(gridId) {
		return repoFactory.grid.load(gridId);
	}
	*/

	var createGrid = function(req,res) {
		var grid = new Grid();
		grid.init({});
		res.send("I have no clue");
	}

	var doMove = function(req,res) {
		// This function checks too much. It should only check if the grid and tile can be loaded, not whether the tile is in a moveable position.
		// It should then create a MOVE COMMAND, but I don't think the grid model should do that. Rather, a command should be a separate object with a reference to the grid, the tile, and an execute method.
		// This means that a grid does not have a reference to its commands? (otherwise: circular references.)
		repoFactory.grid.load(req.params.gridId)
			.then(function(grid) {
				return new Promise(function(resolve, reject) {
					req.grid = grid;
					resolve(req);
				});
			})
			.then(function(req) {
				console.log("Gridcontroller: Searching tile");
				return new Promise(function(resolve, reject) {
					var tileToMove = req.grid.tiles.find(function(aTile) {
						return aTile.tileId === req.params.tileId;
					});
					if(tileToMove) {
						req.tileToMove = tileToMove;
						resolve(req);
					} else {
						reject("Unable to find tile in grid.");
					}
				});
			})
			.then(function(req) {
				console.log("Gridcontroller: Making command.");
				return new Promise(function(resolve,reject) {
					req.command = repoFactory.command.getNewMoveCommand(req.grid, req.tileToMove);
					// Here, a transition to the domain should be made
					// A commandfactory should be asked to create a move command
					// commandFactory.getCommand("move", grid, tile)
					resolve(req);
				});
			})
			.then(function(req) {
				console.log("Gridcontroller: Executing command.");
				return new Promise(function(resolve, reject) {
					req.resultStatus = req.command.execute();
					resolve(req);
				});
			})
			.then(function(req) {
				console.log("Gridcontroller: Constructing answer.");
				return new Promise(function(resolve,reject) {
					req.answer = {
						resultStatus: req.resultStatus,
						grid: req.grid
					};
					resolve(req);
				});
			})
			.then(function(req) {
				console.log("Gridcontroller:Sensing answer.");
				return new Promise(function(resolve,reject) {
					res.send(req.answer);
					resolve(req);
				});
			})
			// I don't think the grid should be saved here, the domain should handle that
			.then(function(req) {
				console.log("Gridcontroller: Saving grid.");
				req.grid.save();
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
		doMove: doMove
	}
}

module.exports = new GridController;