var GridRepository = function() {
	var grids = new Array();

	var load = function(gridId) {
		var self = this;
		
		var myGrid = grids.find(function(aGrid) {
			return aGrid.gridId === gridId;
		});
		if(myGrid) {
			return new Promise(function(resolve,reject) {
				resolve(myGrid);
			});
		} else {
			var Grid = require("../models/grid.model.server");
			var newGrid = new Grid();
			self.grids.push(newGrid);
			return newGrid.load(gridId);
		}	
	}

	return {
		load: load,
		grids: grids
	}
}

module.exports = new GridRepository();