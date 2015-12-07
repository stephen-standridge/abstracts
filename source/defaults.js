var Immutable = require('immutable'),
		Map = Immutable.Map,
		List = Immutable.List;

module.exports = {
	initialData: List(),
	initialConfig: Map({
		branches: 2,
		depth: false
	}),
	initialNav: Map({
		level: 0,
		node: 0,
		maxLevel: 0			
	})	
}


