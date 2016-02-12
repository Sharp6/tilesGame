var MoveCommand = require('../commands/move.command.server');

var CommandRepository = function() {
	var commands = new Array();

	var load = function(commandId) {
		return undefined
	}

	var getNewMoveCommand = function(grid, tile) {
		console.log("Command repository: making a new command");
		var newCommand = new MoveCommand();
		newCommand.init({ grid: grid, tile: tile });
		commands.push(newCommand);
		// async parallel exection... What if save fails?
		newCommand.save();
		return newCommand;
	}

	return {
		load: load,
		getNewMoveCommand: getNewMoveCommand
	}
}

module.exports = new CommandRepository();