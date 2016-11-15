import GridTree from '../trees/grid_tree'
import {normalize, subtract, scale} from '../../math/vector'

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
	buildGrid(){
		let direction, axis, percentU, percentV, axisValue, value1, value2, range, toSet;
		for(let i = 0; i< this.density; i++){		
			direction = i % 2 == 0 ? 1.0 : -1.0;
			axis = i % 3;
			axisValue = (this.radius * direction);
			range = this.radius - (this.radius * -1.0)
	    for(let u = 0; u < this.dimensions[0]; u++) {
				percentU = u/(this.dimensions[0] - 1);
	    	value1 = direction * ((percentU * range) + (this.radius * -1.0));
	      for(let v = 0; v < this.dimensions[1]; v++) {
	      	percentV = v/(this.dimensions[1] - 1);
	      	value2 = direction * ((percentV * range) + (this.radius * -1.0));
	      	toSet = [
	      		this.center[0] + axis == 0 ? axisValue : axis == 1 ? value2 : value1, 
	      		this.center[1] + axis == 1 ? axisValue : axis == 2 ? value2 : value1, 
	      		this.center[2] + axis == 2 ? axisValue : axis == 0 ? value2 : value1
	    		];
	      	this.set([i,u,v], toSet)
	      }
	    }
	  }
	}
}
export default SphereGrid