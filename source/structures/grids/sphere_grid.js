import {GridTree} from '../trees/grid_tree'
import {CubeFaceNode} from '../trees/nodes/cube_face_node'
import {normalize, subtract, scale, distance} from '../../math/vector'

class SphereGrid extends GridTree {
	constructor(resolution, center, radius){
		if(resolution.length !== 2){ console.warn('must have 2 resolution to make each grid'); return false }
		resolution.unshift(6)
		resolution.push(3)
		super(resolution)
		this.center = center;
		this.radius = radius;
		this.buildGrid();
		this.toSphere();
	}
	get DimensionNodeType() {
		return CubeFaceNode		
	}	
	vectorGet([x,y,z], origin=center) {
		//accesses the grid point that is closest to vector given 
		//by comparing vector against center
	}
	vectorSet([x,y,z], origin=center) {
		//accesses the grid point that is closest to vector given 
		//by comparing vector against center
	}	
	uvGet(){
		// n = Normalize(sphere_surface_point - sphere_center);
		// u = atan2(n.x, n.z) / (2*pi) + 0.5;
		// v = n.y * 0.5 + 0.5;		
	}
	uvSet(){
		// n = Normalize(sphere_surface_point - sphere_center);
		// u = atan2(n.x, n.z) / (2*pi) + 0.5;
		// v = n.y * 0.5 + 0.5;		
	}	
	toSphere(){
		let radius = this.radius;
		let center = this.center;
		this.traverse(function(value){
			let diff = subtract(value, center);
			this.value = scale(normalize(diff), radius)
		})
	}
	eachFace(callback){
		this.__children.forEach((child, index)=>{
			child.iterate(callback)
			callback.call(this, child.value, index)
		})
	}
	direction(n) {
		return n % 2 == 0 ? 1.0 : -1.0
	}
	axes(n) {
		return [n%3, (n+2)%3, (n+1)%3]
	} 
	buildGrid(){
		let direction, axes, percentU, percentV, values=[];		
		this.traverse(function(value, [n,u,v]){
			direction = this.direction(n)
			axes = this.axes(n)
			percentU = u/(this.dimensions()[0] - 1);
    	percentV = v/(this.dimensions()[1] - 1);			

			values[0] = direction * this.radius * 1.0;
    	values[1] = direction * this.radius * percentU;
    	values[2] = direction * this.radius * percentV;
    	this.set([n,u,v], [
    		this.center[0] + values[axes[0]], 
    		this.center[1] + values[axes[1]], 
    		this.center[2] + values[axes[2]]
  		])    	
		}.bind(this))
	}
}
export { SphereGrid }