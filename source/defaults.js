import {Map, List} from 'immutable';

const initial = Map({
	data: List(),
	config: Map({
		branches: 2,
		depth: false
	}),
	nav: Map({
		level: 0,
		node: 0,
		maxLevel: 0			
	})	
});

export default initial


