var GridMongooseModel;

var GridDA = function() {
	var save = function(grid) {

	}

	var getTileIds = function(gridId) {
		return new Promise(function(resolve,reject) {
			GridMongooseModel.find({ gridId: gridId }).exec(function(err, grid) {
				if(err) {
					reject(err);
				} else {
					resolve(grid.tiles);
				}
			});
		});
	}

	return {
		save: save
	}
}

// DA should be a sigleton.
modules.exports = GridDA();