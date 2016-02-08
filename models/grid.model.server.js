var Tile = require("./tile.model.server.js");

var Grid = function(data) {
	var tiles[];
	
	var rowDim = data.rowDim || 3;
	var colDim = data.colDim || 3;

	var emptyTile;

	var init = function() {
		var availableLabels = [ "1", "2", "3", "4", "5", "6", "7", "8" ];
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

	var getState = function() {
		
	}

	return {
		init: init,
		isLegalMove: isLegalMove,
		move: move
	}
}

module.exports = Grid;