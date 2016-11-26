import {DimensionNode} from './grid_node';

class CubeFaceNode extends DimensionNode {
	iterate(callback){
		//iterate over axes in order
		//depending on direction

			// 	direction = this.direction(n)
			// 	axes = this.axes(n)
			// 	percentU = u/(this.dimensions[0] - 1);
   		//	percentV = v/(this.dimensions[1] - 1);			

		// 		values[0] = direction * this.radius * 1.0;
   	//  	values[1] = direction * this.radius * percentU;
   	//  	values[2] = direction * this.radius * percentV;
   	//  	this.set([n,u,v], [
   	//  		this.center[0] + values[axes[0]], 
   	//  		this.center[1] + values[axes[1]], 
   	//  		this.center[2] + values[axes[2]]
  	// 		])   		
	}
	get direction() {
		return this.parent.direction(this.__n)
	}
	get axes() {
		return this.parent.axes(this.__n)
	}
	get faceUp() {
		let index = (this.__n + 2) % 6
		this.get([index])
		//get two faces forward, looped by 6
	}
	get faceLeft() {
		let index = (this.__n + 1) % 6
		//get one faces forward, looped by 6
	}	
	get faceAcross() {
		let index = (this.__n + 4) % 6
		//get one faces forward, looped by 6
	}			
	get faceRight() {
		let index = (this.__n + 4) % 6
		//get one faces forward, looped by 6
	}		
	get faceBottom() {
		let index = (this.__n + 5) % 6
		//get one faces forward, looped by 6
	}			
}

export {CubeFaceNode}