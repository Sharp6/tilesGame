var gridController = require('./grid.controller.server');

var AdminController = function() {
	var home = function(req, res) {
		gridController.loadGrids()
			.then(function(grids) {
				console.log(grids);
				res.render('home', {grids: grids});		
			})
			.catch(function(err) {
				res.status(500).send(err);
			});		
	}

	return {
		home: home
	}
}

module.exports = new AdminController();