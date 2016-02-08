var Tile = require("./tile.model.server");
var TileDA = require("./../da/tile.da.server");
var tileDA = new TileDA();
var GridDA = require("./../da/grid.da.server");
var gridDA = new GridDA();
var uuid = require("uuid");

var Grid = function() {
	var tiles[];
	var emptyTile;
	var id;

	var init = function(data) {
		var id = uuid.v1();
		var rowDim = data.rowDim || 3;
		var colDim = data.colDim || 3;

		var availableLabels = data.availableLabels || [ "1", "2", "3", "4", "5", "6", "7", "8" ];

		for(var i=0; i < rowDim; i++) {
			for(var j=0; j<colDim; j++) {
				var tile;
				if((i!==rowDim-1) || (j!==colDim-1)) {
					tile = new Tile(i,j,availableLabels.splice(getRandomInt(availableLabels.length),1)[0]);	
				} else {
					tile = new Tile(i,j,"",true);
					this.emptyTile = tile;
				}
				this.tiles.push(tile);
			}
		}
	}

	var isLegalMove = function(tile) {
		return (((Math.abs(tile.rowPos - this.emptyTile.rowPos == 1) && (Math.abs(tile.colPos() - this.emptyTile.colPos()) == 0)) || ((Math.abs(tile.rowPos - this.emptyTile.rowPos == 0) && (Math.abs(tile.colPos - this.emptyTile.colPos) == 1)));
	}

	var move = function(tile) {
		var tempRowPos = tile.rowPos;
		tile.rowPos = this.emptyTile.rowPos;
		this.emptyTile.rowPos = tempRowPos;

		var tempColPos = tile.colPos();
		tile.colPos = this.emptyTile.colPos;
		this.emptyTile.colPos = tempColPos;
	}

	var save = function() {
		GridDA.save(this);
		
	}

	var load = function(id) {
		gridDA.getTileIds()
			.then(function(tileIds) {
				var promises = tileIds.map(function(tileId) {
					return tileDA.loadTile(id);
				})
			})
		// gridDA.getTileIds(gridId)
		// TileDA.getTilesForGrid(gridUuid);
		// add tiles to this.tiles
		// add empty tile to this.emptyTile
	}

	return {
		init: init,
		isLegalMove: isLegalMove,
		move: move
	}
}

module.exports = Grid;