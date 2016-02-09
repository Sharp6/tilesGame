var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var GridSchema = new Schema({
	gridId: String,
	rowDim: Number, 
	colDim: Number,
	tileIds: [ String ]
});

var gridModel = mongoose.model('Grid', GridSchema);

var GridDA = function() {
	var save = function(grid) {
		return new Promise(function(resolve, reject) {
			gridModel.findOne({ gridId: grid.gridId }).exec(function(err,doc) {
				if(err) {
					reject(err);
					return
				}
				if(doc) {
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
	}

	var load = function(gridId) {
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
			})

		});
	}

	var getTileIds = function(gridId) {
		return new Promise(function(resolve,reject) {
			GridMongooseModel.find({ gridId: gridId }).exec(function(err, grid) {
				if(err) {
					reject(err);
				} else {
					resolve(grid.tileIds);
				}
			});
		});
	}

	return {
		save: save,
		load: load,
		getTileIds: getTileIds
	}
}

// DA should be a sigleton.
modules.exports = GridDA();