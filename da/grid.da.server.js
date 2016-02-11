var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var GridSchema = new Schema({
	gridId: String,
	rowDim: Number, 
	colDim: Number,
	tileIds: [ String ],
	moveIds: [ String ]
});

var gridModel = mongoose.model('Grid', GridSchema);

var GridDA = function() {
	var self = this;

	var save = function(grid) {
		var self = this;
		return new Promise(function(resolve, reject) {
			gridModel.findOne({ gridId: grid.gridId }).exec(function(err,doc) {
				if(err) {
					reject(err);
					return;
				}
				if(doc) {
					var moveIds = grid.moves.map(function(move) {
						return move.commandId;
					});
					doc.moveIds = moveIds;
					doc.save();
					var promises = grid.tiles.map(function(tile) {
						return tile.save();
					});
					return Promise.all(promises);
				} else {
					var newGrid = new gridModel();

					newGrid.gridId = grid.gridId;
					newGrid.rowDim = grid.rowDim;
					newGrid.colDim = grid.colDim;
					newGrid.tileIds = grid.tiles.map(function(tile) {
						return tile.tileId;
					});

					var promises = grid.tiles.map(function(tile) {
						return tile.save();
					});
					Promise.all(promises)
						.then(function(results) {
							newGrid.save(function(err) {
								if(err) {
									reject(err);
								} else {
									resolve(newGrid);
								}
							});		
						})
						.catch(function(err) {
							reject(err);
						});				
				}
			})
		});
	};

	var load = function(gridId) {
		var self = this;
		return new Promise(function(resolve, reject) {
			gridModel.findOne({ gridId: gridId }).exec(function(err,doc) {
				if(err) {
					reject(err);
					return;
				}
				if(doc) {
					resolve(doc);
				} else {
					reject("No grid found with that id.");
				}
			});
		});
	};

	var loadMultiple = function() {
		var self = this;

		return new Promise(function(resolve, reject) {
			gridModel.find().exec(function(err,docs) {
				if(err) {
					reject(err);
					return;
				} 
				resolve(docs);
			});
		});
	}

	return {
		save: save,
		load: load,
		loadMultiple: loadMultiple
	}
}

// DA should be a sigleton.
module.exports = new GridDA();