import {DimensionNode} from './grid_node'
import {times} from 'lodash'

const AXES = {
	0: [0,1,2],
	1: [1,0,2],
	2: [1,2,0],
	3: [0,2,1],
	4: [2,0,1],
	5: [2,1,0]
}

const MAJOR_AXES = [
	[1,0,0],
	[0,-1,0],
	[0,0,1],
	[-1,0,0],
	[0,1,0],
	[0,0,-1]
]

const MINOR_AXES = [
	[1,2],
	[0,2],
	[0,1],
	[2,1],
	[2,0],
	[1,0]
]
const EDGE_ORDER = [
	'down',
	'left',
	'up',
	'right'
]

const EDGES = {
	0: { 
		'left': [5, 'left', -1.0], 
		'right': [2, 'up', 1.0],
		'up': [4, 'right', 1.0],
		'down': [1, 'down', -1.0]
	},
	1: {
		'left': [2, 'left', -1.0], 
		'right': [5, 'up', 1.0],
		'up': [3, 'right', 1.0],
		'down': [0, 'down', -1.0]		
	},
	2: {
		'left': [1, 'left', -1.0], 
		'right': [4, 'up', 1.0],
		'up': [0, 'right', 1.0],
		'down': [3, 'down', -1.0]		
	},
	3: {
		'left': [4, 'left', -1.0], 
		'right': [1, 'up', 1.0],
		'up': [5, 'right', 1.0],
		'down': [2, 'down', -1.0]		
	},
	4: {
		'left': [3, 'left', -1.0], 
		'right': [0, 'up', 1.0],
		'up': [2, 'right', 1.0],
		'down': [5, 'down', -1.0]		
	},
	5: {
		'left': [0, 'left', -1.0], 
		'right': [3, 'up', 1.0],
		'up': [1, 'right', 1.0],
		'down': [4, 'down', -1.0]		
	}
}

class FaceNode extends DimensionNode {
	get direction() { return this.root.direction(this.__n) }
	get minorAxes() { return MINOR_AXES[this.__n] }
	get axes() { return AXES[this.__n] }	

	get edgeUp(){ return this.parent.getEdge(this.__n, 2) }
	get edgeLeft(){ return this.parent.getEdge(this.__n, 1) }
	get edgeRight(){ return this.parent.getEdge(this.__n, 3) }
	get edgeDown(){ return this.parent.getEdge(this.__n, 0) }

	set edgeUp(array){ return this.parent.setEdge(this.__n, 2, array) }
	set edgeLeft(array){ return this.parent.setEdge(this.__n, 1, array) }
	set edgeRight(array){ return this.parent.setEdge(this.__n, 3, array) }
	set edgeDown(array){ return this.parent.setEdge(this.__n, 0, array) }

	get nextEdgeUp() { return this.parent.getEdge(...EDGES[this.__n]['up'])  }
	get nextEdgeLeft() { return this.parent.getEdge(...EDGES[this.__n]['left'])  }
	get nextEdgeRight() { return this.parent.getEdge(...EDGES[this.__n]['right']) }
	get nextEdgeDown() { return this.parent.getEdge(...EDGES[this.__n]['down']) }

	get faceUp() { return this.parent.getFace((this.__n + 4) % 6) }
	get faceLeft() { 
		let offset = this.direction < 0 ? 2 : 5;		
		return this.parent.getFace((this.__n + offset) % 6) 
	}
	get faceAcross() { return this.parent.getFace((this.__n + 3) % 6) }
	get faceRight() { 
		let offset = this.direction > 0 ? 2 : 5;				
		return this.parent.getFace((this.__n + offset) % 6) 
	}
	get faceDown() { return this.parent.getFace((this.__n + 1) % 6) }	

	eachEdge(callback) {
		return times(4, (i)=> callback(this.parent.getEdge(this.__n, i), i) )
	}
	getEdge(i) {
		return this.parent.getEdge(this.__n, i)
	}	
	setEdge(i,array) {
		return this.parent.setEdge(this.__n, i, array)
	}		
	getNextEdge(i) {
		// console.log(i,EDGE_ORDER[i], EDGES[this.__n][EDGE_ORDER[i]])
		return this.parent.getEdge(...EDGES[this.__n][EDGE_ORDER[i]]) 
	}
}

export {FaceNode}