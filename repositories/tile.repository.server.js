var daFactory = require("../da/daFactory.da.server");
var Tile = require("../models/tile.model.server");

var TileRepository = function() {

	var tiles = new Array();

	var getTile = function(tileId) {
		var self = this;

		var tile = tiles.find(function(aTile) {
			return aTile.tileId === tileId;
		});
		if(tile) {
			return new Promise(function(resolve,reject) {
				resolve(tile);
			});
		} else {
			var newTile = new Tile();
			self.tiles.push(newTile);
			return newTile.load(tileId);
		}	
	}

	return {
		load: getTile,
		tiles: tiles
	}
}

module.exports = new TileRepository();