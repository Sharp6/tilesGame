var DAFactory = function() {
	var DAs = this;
	var daList = [ {name: 'grid', source: './grid.da.server' },
					{name: 'tile', source: './tile.da.server' },
					{name: 'command', source: './command.da.server'} ];
	daList.forEach(function(da) {
		DAs[da.name] = require(da.source);
	});
}

// The factory should be a singleton
module.exports = new DAFactory;