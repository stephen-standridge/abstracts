import {DimensionNode} from './grid_node'

class CubeFaceNode extends DimensionNode {
	buildFace(){
		let percentU, percentV, values = [], axisValue;
		this.traverse((item, [u,v])=>{
			percentU = u/(this.dimensions()[0] - 1);
			percentU = this.direction > 0 ? percentU : 1.0 - percentU
	  	percentV = v/(this.dimensions()[1] - 1);
			percentV = this.direction > 0 ? percentV : 1.0 - percentV

	  	values.push(((this.root.radius * 2) * percentU) - this.root.radius);
	  	values.push(((this.root.radius * 2) * percentV) - this.root.radius);
	  	axisValue = this.root.radius * this.direction
	  	this.set([u,v], [
	  		this.root.center[0] + this.axes[0] ? axisValue : values.pop(), 
	  		this.root.center[1] + this.axes[1] ? axisValue : values.pop(), 
	  		this.root.center[2] + this.axes[2] ? axisValue : values.pop()
			])
		})	
	}
	get direction() {
		return this.root.direction(this.__n)
	}
	get axes() {
		return this.root.axes(this.__n)
	}
	getEdge(i,dir){
		return this.parent.getEdge(this.__n, i)
	}
	get edgeUp(){ return this.parent.getEdge(this.__n, 2) }
	get edgeLeft(){ return this.parent.getEdge(this.__n, 1) }
	get edgeRight(){ return this.parent.getEdge(this.__n, 3) }
	get edgeDown(){ return this.parent.getEdge(this.__n, 0) }
	set edgeUp(array){
		return this.parent.setEdge(this.__n, 2, array)
	}
	set edgeLeft(array){
		return this.parent.setEdge(this.__n, 1, array)
	}
	set edgeRight(array){
		return this.parent.setEdge(this.__n, 3, array)
	}
	set edgeDown(array){
		return this.parent.setEdge(this.__n, 0, array)
	}
	get nextEdgeUp() { return this.parent.getEdge((this.__n + 4) % 6, 2) }
	get nextEdgeLeft() { 
		let offset = this.direction < 0 ? 2 : 5;
		let edge = this.__n == 0 ? 1 : this.__n == 4 ? 1 : this.__n == 2 ? 0 : this.__n == 5 ? 2 : this.direction < 0 ? 3 : 0;
		let reverse = this.parent.direction((this.__n + offset) % 6) == this.direction ? 1.0 : -1.0;
		return this.parent.getEdge((this.__n + offset) % 6, edge, reverse ) 
	}
	get nextEdgeRight() {
		let offset = this.direction > 0 ? 2 : 5;
		let edge = this.__n == 5 ? 0 : this.direction > 0 ? 3 : 1;
	 	return this.parent.getEdge((this.__n + offset) % 6, edge, this.direction) 
	}
	get nextEdgeDown() { return this.parent.getEdge((this.__n + 4) % 6, 0, -1) }

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