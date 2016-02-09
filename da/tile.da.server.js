var TileDA = function() {

	// Implement a cache
	var tileCache = [];

	// TODO: should save refresh the data in cache?
	var save = function(tile) {

	}

	// TODO: load should first search the cache, only then talk to DB.
	// TODO: if talking to DB, it should be stored in the cache.
	var load = function(tileId) {
		return new Promise(function(resolve,reject) {

		});
	}

	return {
		save: save
	}
}

// DA should be a singleton
module.exports = TileDA();