import {GridTree} from '../trees/grid_tree'
import {CubeFaceNode} from '../trees/nodes/cube_face_node'
import {normalize, subtract, scale, distance} from '../../math/vector'
import {filter} from 'lodash'

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
	getEdge(face, edge, direction=1) {
		let f = this.__children[face];
		let e = filter(f.value, (item, index)=>{
			switch(edge){
				case 0:
					return Math.floor(index / f.dimensions()[2]) / f.dimensions()[1] < 1
					break;
				case 1:
					return Math.floor(index / f.dimensions()[2]) % f.dimensions()[1] == 0
					break;
				case 2:
					return Math.floor(index / f.dimensions()[2]) / f.dimensions()[1] >= (this.dimensions()[2] - 1)
					break;
				case 3:
					return Math.floor(index / f.dimensions()[2]) % f.dimensions()[1] == (this.dimensions()[1] - 1)
			}
		})
		if(direction > 0) return e
		let returned = [];
		e.reverse().forEach((item, index)=>{
			let itemSize = this.dimensions()[3]
			returned[(Math.floor(index/itemSize) * itemSize) + itemSize-(index%itemSize) -1] = item;
		})
		return returned
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
	axes(n) {
		return [!!(n%3) ? 0 : 1, !!((n+2)%3) ? 0 : 1, !!((n+1)%3) ? 0 : 1]
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