var CommandFactory = function() {
	var commands = this;
	var commandList = [ {name: 'move', source: './move.command.server' } ];
	commandList.forEach(function(command) {
		commands[command.name] = require(command.source);
	});
}

// The factory should be a singleton
module.exports = new CommandFactory();
