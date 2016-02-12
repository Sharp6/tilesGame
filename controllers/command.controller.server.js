// I don't think I need a command controller. 

var Tile = require("../models/tile.model.server");
var Grid = require("../models/grid.model.server");

var CommandController = function() {
	var move = function(req,res) {
		var grid = new Grid();
		grid.load("98229c50-ceac-11e5-b12c-1bbdd23172f2")
			.then(function() {
				console.log("RowDim", grid.rowDim);
			})
			.catch(function(err) {
				console.log(err);
			});
		/*var tile = new Tile();
		tile.load("c05f5a50-ce9d-11e5-9197-cd2f365cd866")
			.then(function() {
				console.log('rowpos', tile.rowPos);		
			});
		
		
		tile.init({
			rowInit: 1,
			colInit: 1,
			rowGoal: 2,
			colGoal: 2
		});
		console.log("Tile id: ", tile.tileId);
		tile.save()
			.then(function());

		res.send(tile.tileId);
		*/
		// Load game

		// check for move legality

		// get move command

		// execute command

		// return {{ WHAT? }} game state? 
	}

	return {
		move: move
	}
}

module.exports = CommandController;