var Tile = function(data) {
	var rowPos = data.rowPos;
	var colPos = data.colPos;
	var label = data.label;
	var empty = data.empty || false;

	return {
		rowPos: rowPos,
		colPos: colPos,
		label: label,
		empty: empty
	}
}

module.exports = Tile;