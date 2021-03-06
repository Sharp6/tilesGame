var gridController = require('./grid.controller.server');

var AdminController = function() {
	var home = function(req, res) {
		gridController.loadGrids()
			.then(function(grids) {
				res.render('home', {grids: grids});		
			})
			.catch(function(err) {
				console.log(err);
				res.status(500).send(err);
			});		
	}

	return {
		home: home
	}
}

module.exports = new AdminController();