var Tile = function() {
	var rowPos;
	var colPos;

	var rowInit;
	var colInit;

	var rowGoal;
	var colGoal;

	var label;
	var empty;

	var init = function(data) {
		this.rowPos = data.rowPos;
		this.colPos = data.colPos;

		this.rowInit = data.rowInit;
		this.colInit = data.colInit;

		this.rowGoal = data.rowGoal;
		this.colGoal = data.colGoal;

		this.label = data.label;
		this.empty = data.empty || false;
	}

	var load = function(id) {

	}

	var save = function() {

	}

	return {
		rowPos: rowPos,
		colPos: colPos,
		label: label,
		empty: empty
	}
}

module.exports = Tile;