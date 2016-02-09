var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var TileSchema = new Schema({
	tileId: String,
	rowPos: Number,
	colPos: Number,
	rowInit: Number,
	colInit: Number,
	rowGoal: Number,
	colGoal: Number,
	label: String,
	empty: Boolean
});

var tileModel = mongoose.model('Tile', TileSchema);

var TileDA = function() {
	var save = function(tile) {
		return new Promise(function(resolve,reject) {
			tileModel.findOne({ tileId: tile.tileId }).exec(function(err, doc) {
				if(err) {
					reject(err);
					return;
				} 
				if(doc) {
					doc.rowPos = tile.rowPos;
					doc.colPos = tile.colPos;

					doc.save(function(err) {
						if(err) {
							reject(err);
						} else {
							resolve(doc);
						}
					});
				} else {
					var newTile = new tileModel();
					
					newTile.tileId = tile.tileId;
					newTile.rowPos = tile.rowPos;
					newTile.colPos = tile.colPos;
					newTile.rowInit = tile.rowInit;
					newTile.colInit = tile.colInit;
					newTile.rowGoal = tile.rowGoal;
					newTile.colGoal = tile.colGoal;
					newTile.label = tile.label;
					newTile.empty = tile.empty;

					newTile.save(function(err) {
						if(err) {
							reject(err);
						} else {
							resolve(newTile);
						}
					});
				}	
			});
		});
	}

	var load = function(tileId) {
		return new Promise(function(resolve,reject) {
			tileModel.findOne({ tileId: tileId }).exec(function(err,doc) {
				if(err) {
					reject(err);
					return;
				}
				if(doc) {
					resolve(doc);
				} else {
					reject("No tile found with that id.");
				}
			});
		});
	}

	return {
		save: save,
		load: load
	}
}

module.exports = TileDA;