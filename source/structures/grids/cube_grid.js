import {GridTree} from '../trees/grid_tree'
import {FaceNode} from '../trees/nodes/face_node'
import {normalize, subtract, scale, distance} from '../../math/vector'
import {findIndex, reduce, reduceRight, forEach, forEachRight, isMatch} from 'lodash'


const EDGE_INDICES = {
	'down': 0,
	'left': 1,
	'up': 2,
	'right': 3
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

class CubeGrid extends GridTree {
	constructor(resolution, center, radius){
		// if(resolution.length !== 2){ console.warn('must have 2 resolution to make each grid'); return false }
		resolution.unshift(6)
		super(resolution)
		this.center = center;
		this.radius = radius;
	}	
	get NodeType() {
		return FaceNode		
	}
	setEdge(face, edge, array, direction=1 ) {
		let f = this.__children[face];
		let eachType = direction > 0 ? forEach : forEachRight,
				length = f.dimensions()[2],
				iterator = new Array(array.length/length);
		edge = !isNaN(Number(edge)) ? edge : EDGE_INDICES[edge]

		switch(edge){
			case 0:
				//get first row	
				return eachType(iterator, (item, i) => f.set([0, i], array.slice(i*length, i*length + length)) )
			case 1:
				//get first column
				return eachType(iterator, (item, i) => f.set([i,0], array.slice(i*length, i*length + length)) )
			case 2:
					//get last row
				return eachType(iterator, (item, i) => f.set([this.dimensions()[1]-1, i], array.slice(i*length, i*length + length)) )
			case 3:
				//get last column
				return eachType(iterator, (item, i) => f.set([i,f.dimensions()[1] -1], array.slice(i*length, i*length + length)) )				
		}				
	}
	getEdge(face, edge, direction=1) {
		let f = this.__children[face];
		let iterator = [], reducer = direction > 0 ? reduce : reduceRight;
		edge = !isNaN(Number(edge)) ? edge : EDGE_INDICES[edge]
		
		switch(edge){
			case 0:
				//get first row			
				iterator.length = f.dimensions()[1];
				return reducer(iterator, (sum, a, i) =>{ return sum.concat(f.get([0, i])) }, [])
			case 1:
				//get first column
				iterator.length = f.dimensions()[0];
				return reducer(iterator, (sum, a, i)=>{ return sum.concat(f.get([i,0])) },[] )
			case 2:
					//get last row
				iterator.length = f.dimensions()[1];			
				return reducer(iterator, (sum, a, i) =>{ return sum.concat(f.get([this.dimensions()[1]-1, i])) }, [])
			case 3:
				//get last column
				iterator.length = f.dimensions()[0];		
				return reducer(iterator, (sum, a, i)=>{ return sum.concat(f.get([i,f.dimensions()[1] -1])) },[] )
		}		
	}
	eachFace(callback){
		this.__children.forEach((child, index)=>{
			callback.call(this, child, index)
		})
	}
	direction(n) {
		return n % 2 == 0 ? 1.0 : -1.0
	}
	getAxis(axis) {
		return this.__children[findIndex(MAJOR_AXES, (ax)=> isMatch(ax, axis) )];
	}
	getFace(i=0, dir) {
		return this.__children[i]
	}	
	build(){
		let direction, axes, percentU, percentV, values=[];	
		this.eachFace((face, index)=>{
			let percentU, percentV, values = [], axisValue;
			face.traverse((item, [u,v])=>{
				percentU = u/(face.dimensions()[0] - 1);
				percentU = face.direction > 0 ? percentU : 1.0 - percentU
		  	percentV = v/(face.dimensions()[1] - 1);
				percentV = face.direction > 0 ? percentV : 1.0 - percentV
		  	axisValue = this.radius * face.direction

				values[0]	= axisValue
		  	values[1] = ((this.radius * 2) * percentU) - this.radius;
		  	values[2] = ((this.radius * 2) * percentV) - this.radius;
		  	face.set([u,v], [
		  		this.center[0] + values[face.axes[0]], 
		  		this.center[1] + values[face.axes[1]], 
		  		this.center[2] + values[face.axes[2]]
				])
			})	
		})	
	}	
}
export { CubeGrid }