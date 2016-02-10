var RepoFactory = function() {
	var repos = this;
	var repoList = [ {name: 'grid', source: './grid.repository.server' },
					{name: 'tile', source: './tile.repository.server' } ];
	repoList.forEach(function(repo) {
		repos[repo.name] = require(repo.source);
	});
}

// The factory should be a singleton
module.exports = new RepoFactory();


