var Tile = require("./tile.model.server");
var GridDA = require("./../da/grid.da.server");
var gridDA = new GridDA();
var uuid = require("uuid");

var Grid = function() {
	var tiles = new Array();
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
	}

	var init = function(data) {
		this.gridId = uuid.v1();
		this.rowDim = data.rowDim || 3;
		this.colDim = data.colDim || 3;

		var getRandomInt = function(max) {
		  return Math.floor(Math.random() * max);
		}

		var availableLabels = data.availableLabels || [ "1", "2", "3", "4", "5", "6", "7", "8" ];

		for(var i=0; i < this.rowDim; i++) {
			for(var j=0; j< this.colDim; j++) {
				console.log("Creating a tile");
				var tile;
				if((i!==this.rowDim-1) || (j!==this.colDim-1)) {
					tile = new Tile();
					tile.init({rowInit:i, colInit:j, rowGoal:i, colGoal:j, label: availableLabels.splice(getRandomInt(availableLabels.length),1)[0]});	
				} else {
					tile = new Tile();
					tile.init({rowInit: i, colInit: j, rowGoal: i, colGoal: j, label: "", empty: true});
					this.emptyTile = tile;
				}
				this.tiles.push(tile);
			}
		}
		console.log("Saving the grid.");
		this.save();
	}

	var save = function() {
		gridDA.save(this);
	}

	var load = function(id) {
		var self = this;
		return gridDA.load(id)
			.then(function(gridData) {
				console.log(gridData);
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
				console.log("All tiles have been added.");
				// TODO add empty tile to this.emptyTile
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