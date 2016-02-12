var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var MoveCommandSchema = new Schema({
	name: String,
	commandId: String,
	tileId: String,
	gridId: String,
	timestamp: { type : Date, default: Date.now }
});

var MoveCommandModel = mongoose.model('MoveCommand', MoveCommandSchema);

var CommandDA = function() {
	var self = this;

	var save = function(command) {
		console.log("Command DA: saving command.");
		return new Promise(function(resolve,reject) {
			var newMove = new MoveCommandModel();
			
			newMove.name = command.name;
			newMove.commandId = command.commandId;
			newMove.tileId = command.tile.tileId;
			newMove.gridId = command.grid.gridId;

			console.log("This should save to DB.");
			newMove.save(function(err) {
				if(err) {
					reject(err);
				} else {
					resolve(newMove);
				}
			});
		});
	}

	var load = function(moveId) {
		return new Promise(function(resolve,reject) {
			MoveCommandModel.findOne({ moveId: moveId }).exec(function(err,doc) {
				if(err) {
					reject(err);
					return;
				}
				if(doc) {
					resolve(doc);
				} else {
					reject("No move found with that id.");
				}
			});
		});
	}

	return {
		save: save,
		load: load
	}
}

// DA should be a singleton
module.exports = CommandDA();