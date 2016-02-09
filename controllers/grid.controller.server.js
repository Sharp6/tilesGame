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
					return grid.load(gridData.gridId)
				});
				return Promise.all(gridPromises);
			});
	}

	return {
		getGrids: getGrids,
		loadGrids: loadGrids
	}
}

module.exports = new GridController;