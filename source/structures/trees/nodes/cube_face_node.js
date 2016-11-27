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
	getNextEdge(i,dir) {
		switch(i){
			case 0:
				return this.parent.getEdge((this.__n + 5) % 6, 0, -1)
				break;
			case 1:
				return this.parent.getEdge((this.__n + 1) % 6, 0, -1)
				break;
			case 2:
				return this.parent.getEdge((this.__n + 2) % 6, 3)
				break;
			case 3:
				return this.parent.getEdge((this.__n + 3) % 6, 3)
				break;				
		}
	}
	getEdge(i,dir){
		return this.parent.getEdge(this.__n, i)
	}
	getFace(i) {

	}
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