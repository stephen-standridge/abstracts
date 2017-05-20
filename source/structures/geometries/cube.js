import Grid from '../grids/grid';

class Cube extends Grid {
	constructor({detail,min,max,center,extents,dimensions=4}){
		detail.unshift(6)
		detail.push(dimensions)
		super(d)
	}
	getUV(){

	}
	// GetWorldSpaceCoordinate(cubePos, height){
	//     cubePos.Normalize();
	//     return cubePos * _fRadius + height;
	// }
	buildMesh(time,centerPos, axisX, axisZ){
		//
    let point, u, v, t;
    for(t = 0; t< 6; t++){
	    for(u = 0; u < height; u++){
	      for(v = 0; v < width; v++){
	      	point = [centerPos + (axisX / width) * (v - width / 2) + (axisZ / height) * (u - height / 2)];
	      	this.set([time,u,v], point)
	      }
	    }
    }
	}
}
