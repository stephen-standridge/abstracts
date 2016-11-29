import {GridTree} from '../trees/grid_tree'
import {CubeFaceNode} from '../trees/nodes/cube_face_node'
import {normalize, subtract, scale, distance} from '../../math/vector'
import {filter, reduce, reduceRight, forEach, forEachRight} from 'lodash'


const EDGE_INDICES = {
	'down': 0,
	'left': 1,
	'up': 2,
	'right': 3
}

class SphereGrid extends GridTree {
	constructor(resolution, center, radius){
		if(resolution.length !== 2){ console.warn('must have 2 resolution to make each grid'); return false }
		resolution.unshift(6)
		resolution.push(3)
		super(resolution)
		this.center = center;
		this.radius = radius;
		this.buildGrid();
	}
	get DimensionNodeType() {
		return CubeFaceNode		
	}
	setEdge(face, edge, direction=1, array ) {
		let f = this.__children[face];
		let eachType = direction > 0 ? forEach : forEachReverse,
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
	toSphere() {
		let radius = this.radius;
		let center = this.center;
		this.traverse(function(value){
			let diff = subtract(value, center);
			this.value = scale(normalize(diff), radius)
		})
	}
	eachFace(callback){
		this.__children.forEach((child, index)=>{
			callback.call(this, child, index)
		})
	}
	direction(n) {
		return n % 2 == 0 ? 1.0 : -1.0
	}
	getFace(i=0, dir) {
		return this.__children[i]
	}	
	buildGrid(){
		let direction, axes, percentU, percentV, values=[];	
		this.eachFace((face, index)=>{
			face.buildFace()
		})	
	}
}
export { SphereGrid }