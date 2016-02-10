var Tile = require("./tile.model.server");
/*
var GridDA = require("./../da/grid.da.server");
var gridDA = new GridDA();
*/
var daFactory = require('../da/daFactory.da.server');
var uuid = require("uuid");

var Grid = function() {
	var tiles = new Array();
	var moves = new Array();
	var emptyTile;
	var gridId;
	var rowDim;
	var colDim;

	var isLegalMove = function(tile) {
		return (
			(
				(Math.abs(tile.rowPos - this.emptyTile.rowPos == 1) 
					&& (Math.abs(tile.colPos() - this.emptyTile.colPos()) == 0)) 
				|| (
					(Math.abs(tile.rowPos - this.emptyTile.rowPos == 0) 
						&& (Math.abs(tile.colPos - this.emptyTile.colPos) == 1)
						)
					)
				)
			);
	}

	var move = function(tile) {
		var tempRowPos = tile.rowPos;
		tile.rowPos = this.emptyTile.rowPos;
		this.emptyTile.rowPos = tempRowPos;

		var tempColPos = tile.colPos();
		tile.colPos = this.emptyTile.colPos;
		this.emptyTile.colPos = tempColPos;

		return true;
	}

	var init = function(data) {
		var self = this;
		function getRowGoal(label) {
			var labelIndex = originalLabels.indexOf(label);
			if(labelIndex > -1) {
				return Math.floor(labelIndex / self.rowDim);
			} else {
				return undefined;
			}			
		}

		function getColGoal(label) {
			var labelIndex = originalLabels.indexOf(label);
			if(labelIndex > -1) {
				return labelIndex % self.colDim;
			} else {
				return undefined;
			}	
		}

		var getRandomInt = function(max) {
		  return Math.floor(Math.random() * max);
		}

		this.gridId = uuid.v1();
		this.rowDim = data.rowDim || 3;
		this.colDim = data.colDim || 3;
		var availableLabels = data.availableLabels || [ "1", "2", "3", "4", "5", "6", "7", "8" ];
		var originalLabels = availableLabels.slice();

		for(var i=0; i < this.rowDim; i++) {
			for(var j=0; j< this.colDim; j++) {
				var tile;
				var randomIndex = getRandomInt(availableLabels.length);
				if((i!==this.rowDim-1) || (j!==this.colDim-1)) {
					tile = new Tile();
					tile.init({rowInit:i, colInit:j, rowGoal:getRowGoal(availableLabels[randomIndex]), colGoal:getColGoal(availableLabels[randomIndex]), label: availableLabels.splice(randomIndex,1)[0]});	
				} else {
					tile = new Tile();
					tile.init({rowInit: i, colInit: j, rowGoal: i, colGoal: j, label: "", empty: true});
					this.emptyTile = tile;
				}
				this.tiles.push(tile);
			}
		}
		this.save();
	}

	var execute = function(name) {
		var args = Array.prototype.slice.call(arguments,1);
		if(name === "move") {
			this.moves.push({
				name: name,
				tile: args[0]
			});
			return this[name].apply(this, args);
		}
		return false;
	}

	var save = function() {
		return daFactory.grid.save(this);
	}

	var load = function(id) {
		var self = this;
		return daFactory.grid.load(id)
			.then(function(gridData) {
				self.gridId = gridData.gridId;
				self.rowDim = gridData.rowDim;
				self.colDim = gridData.colDim;
				var promises = gridData.tileIds.map(function(tileId) {
					var tile = new Tile();
					self.tiles.push(tile);
					return tile.load(tileId);
				});
				return Promise.all(promises);
			})
			.then(function(tiles) {
				self.emptyTile = self.tiles.find(function(aTile) {
					return aTile.empty;
				});
				return self;
			});
	}

	return {
		gridId: gridId,
		tiles: tiles,
		emptyTile: emptyTile,
		rowDim: rowDim,
		colDim: colDim,
		isLegalMove: isLegalMove,
		move: move,
		init: init,
		save: save,
		load: load
	}
}

module.exports = Grid;