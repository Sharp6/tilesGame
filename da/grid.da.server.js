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
	var self = this;

	var gridCache = new Array();

	var save = function(grid) {
		var self = this;
		return new Promise(function(resolve, reject) {
			gridModel.findOne({ gridId: grid.gridId }).exec(function(err,doc) {
				if(err) {
					reject(err);
					return;
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
									self.gridCache.push(newGrid);
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
			var cachedGrid = self.gridCache.find(function(aGrid) {
				return aGrid.gridId === gridId;
			});
			if(cachedGrid) {
				resolve(cachedGrid);
			} else {
				gridModel.findOne({ gridId: gridId }).exec(function(err,doc) {
					if(err) {
						reject(err);
						return;
					}
					if(doc) {
						self.gridCache.push(doc);
						resolve(doc);
					} else {
						reject("No grid found with that id.");
					}
				});
			}
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
				docs.forEach(function(doc) {
					self.gridCache.push(doc);
				});
				resolve(docs);
			});
		});
	}

	return {
		save: save,
		load: load,
		loadMultiple: loadMultiple,
		gridCache: gridCache
	}
}

// DA should be a sigleton.
module.exports = new GridDA();