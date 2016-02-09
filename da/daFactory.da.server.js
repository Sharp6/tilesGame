var DAFactory = function() {
	var DAs = this;
	var daList = [ {name: 'grid', source: './grid.da.server' },
					{name: 'tile', source: './tile.da.server' } ];
	daList.forEach(function(da) {
		DAs[da.name] = require(da.source);
	});
	/*this.getDA = function(daType) {
		if(daType === 'grid') {
			if(this.gridDA) {
				return this.gridDA;
			} else {
				this.gridDA = require('./grid.da.server');
				return this.gridDA;	
			}
		}

		if(daType === 'tile') {
			if(this.tileDA) {
				return this.tileDA;
			} else {
				this.tileDA = require('./tile.da.server');
				return this.tileDA;
			}
		}
	}*/
}

// The factory should be a singleton
module.exports = DAFactory();