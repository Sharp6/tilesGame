var uuid = require('uuid');
/*var TileDA = require('../da/tile.da.server')();*/
var daFactory = require('../da/daFactory.da.server');

var Tile = function() {
	var tileId;

	var rowPos;
	var colPos;

	var rowInit;
	var colInit;

	var rowGoal;
	var colGoal;

	var label;
	var empty;

	var init = function(data) {
		this.tileId = uuid.v1();

		this.rowPos = data.rowPos || data.rowInit;
		this.colPos = data.colPos || data.colInit; 

		this.rowInit = data.rowInit;
		this.colInit = data.colInit;

		this.rowGoal = data.rowGoal;
		this.colGoal = data.colGoal;

		this.label = data.label || "x";
		this.empty = data.empty || false;
	}

	var load = function(id) {
		var self = this;
		return daFactory.tile.load(id)
			.then(function(tileData) {
				self.tileId = tileData.tileId;
				self.rowPos = tileData.rowPos;
				self.colPos = tileData.colPos;
				self.rowInit = tileData.rowInit;
				self.colInit = tileData.colInit;
				self.rowGoal = tileData.rowGoal;
				self.colGoal = tileData.colGoal;
				self.label = tileData.label;
				self.empty = tileData.empty;

				return self;
			});
	}

	var save = function() {
		daFactory.tile.save(this);
	}

	return {
		rowPos: rowPos,
		colPos: colPos,
		rowInit: rowInit,
		colInit: colInit,
		rowGoal: rowGoal,
		colGoal: colGoal,
		label: label,
		empty: empty,
		tileId: tileId,
		init: init,
		save: save,
		load: load
	}
}

module.exports = Tile;