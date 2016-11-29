import {DimensionNode} from './grid_node'

const AXES = {
	0: [0,1,2],
	1: [1,0,2],
	2: [1,2,0],
	3: [0,2,1],
	4: [2,0,1],
	5: [2,1,0]
}

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

class CubeFaceNode extends DimensionNode {
	buildFace(){
		let percentU, percentV, values = [], axisValue;
		this.traverse((item, [u,v])=>{
			percentU = u/(this.dimensions()[0] - 1);
			percentU = this.direction > 0 ? percentU : 1.0 - percentU
	  	percentV = v/(this.dimensions()[1] - 1);
			percentV = this.direction > 0 ? percentV : 1.0 - percentV
	  	axisValue = this.root.radius * this.direction

			values[0]	= axisValue
	  	values[1] = ((this.root.radius * 2) * percentU) - this.root.radius;
	  	values[2] = ((this.root.radius * 2) * percentV) - this.root.radius;
	  	this.set([u,v], [
	  		this.root.center[0] + values[this.axes[0]], 
	  		this.root.center[1] + values[this.axes[1]], 
	  		this.root.center[2] + values[this.axes[2]]
			])
		})	
	}
	get faces() {

	}
	get direction() {
		return this.root.direction(this.__n)
	}
	get axes() {
		return AXES[this.__n]
	}
	getEdge(i,dir){
		return this.parent.getEdge(this.__n, i)
	}
	get edgeUp(){ return this.parent.getEdge(this.__n, 2) }
	get edgeLeft(){ return this.parent.getEdge(this.__n, 1) }
	get edgeRight(){ return this.parent.getEdge(this.__n, 3) }
	get edgeDown(){ return this.parent.getEdge(this.__n, 0) }
	set edgeUp(array){ return this.parent.setEdge(this.__n, 2, 1.0, array) }
	set edgeLeft(array){ return this.parent.setEdge(this.__n, 1, 1.0, array) }
	set edgeRight(array){ return this.parent.setEdge(this.__n, 3, 1.0, array) }
	set edgeDown(array){ return this.parent.setEdge(this.__n, 0, 1.0, array) }

	get nextEdgeUp() { console.log(EDGES[this.__n]['up']); return this.parent.getEdge(...EDGES[this.__n]['up'])  }
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

}

export {CubeFaceNode}