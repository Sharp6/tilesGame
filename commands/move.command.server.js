var uuid = require('uuid');
var daFactory = require('../da/daFactory.da.server');

var Command = function() {
	var commandId;

	var name;
	var tile;
	var grid;
	var timestamp;

	var execute = function() {
		console.log("Executing command.");
		if(this.grid.isLegalMove(this.tile)) {
			console.log("Move command: move is found to be legal.")
			if(this.grid.move(this.tile)) {
				return "Move complete.";
			} else {
				return "Move could not be completed.";
			}
		} else {
			return "Tile is not in a movable position.";
		}
	}

	var init = function(data) {
		this.commandId = uuid.v1();
		this.timestamp = Date.now();
		this.name = "move";

		this.tile = data.tile;
		this.grid = data.grid;

		return;
	}

	var load = function(id) {
		var self = this;
		// shouldn't we have a command-reposiorty?
		return daFactory.command.load(id)
			.then(function(commandData) {
				self.commandId = commandData.commandId;
				self.name = commandData.name;
				// TODO: load grid through gridRepository
				// TODO: load tile through tileRepository or through grid?
				return self;
			});
	}

	var save = function() {
		console.log("Passing this on to command DA");
		daFactory.command.save(this);
	}

	return {
		commandId: commandId,
		name: name,
		tile: tile,
		grid: grid,
		init: init,
		save: save,
		load: load,
		execute: execute
	}
}

module.exports = Command;