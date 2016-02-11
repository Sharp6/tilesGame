var uuid = require('uuid');
var daFactory = require('../da/daFactory.da.server');

var Command = function() {
	var commandId;

	var name;
	var tile;
	var gridId;

	var init = function(data) {
		this.commandId = uuid.v1();

		this.name = data.name;
		this.tile = data.tile;
		this.gridId = data.gridId;
	}

	var load = function(id) {
		var self = this;
		return daFactory.command.load(id)
			.then(function(commandData) {
				self.commandId = commandData.commandId;
				self.name = commandData.name;
				self.gridId = commandData.gridId;
				// TODO: load tile

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
		gridId: gridId,
		init: init,
		save: save,
		load: load
	}
}

module.exports = Command;