var daFactory = require("../da/daFactory.da.server");
var Grid = require("../models/grid.model.server");

var GridRepository = function() {
	var grids = new Array();

	var load = function(gridId) {
		var self = this;
		
		return new Promise(function(resolve,reject) {
			var grid = grids.find(function(aGrid) {
				return aGrid.gridId === gridId;
			});
			if(grid) {
				resolve(grid);
			} else {
				var newGrid = new Grid();
				self.grids.push(newGrid);
				return newGrid.load(gridId);
			}	
		});
	}

	return {
		load: load
	}
}

module.exports = new GridRepository();