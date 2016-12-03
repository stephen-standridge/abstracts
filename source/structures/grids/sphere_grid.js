import {CubeGrid} from './cube_grid'
import {normalize, subtract, scale, distance} from '../../math/vector'
import {filter, reduce, reduceRight, forEach, forEachRight} from 'lodash'

class SphereGrid extends CubeGrid {
	build(){
		let direction, axes, percentU, percentV, values=[];	
		this.eachFace((face, index)=>{
			let percentU, percentV, values = [], axisValue, valuesToSet;
			face.traverse((item, [u,v])=>{
				percentU = u/(face.dimensions()[0] - 1);
				percentU = face.direction > 0 ? percentU : 1.0 - percentU
		  	percentV = v/(face.dimensions()[1] - 1);
				percentV = face.direction > 0 ? percentV : 1.0 - percentV
		  	axisValue = this.radius * face.direction

				values[0]	= axisValue
		  	values[1] = ((this.radius * 2) * percentU) - this.radius;
		  	values[2] = ((this.radius * 2) * percentV) - this.radius;

		  	valuesToSet = [
		  		this.center[0] + values[face.axes[0]], 
		  		this.center[1] + values[face.axes[1]], 
		  		this.center[2] + values[face.axes[2]]
				]
				valuesToSet = subtract(valuesToSet, this.center)
				valuesToSet = scale(normalize(valuesToSet), this.radius)
		  	face.set([u,v], valuesToSet)
			})	
		})	
	}
}

export { SphereGrid }