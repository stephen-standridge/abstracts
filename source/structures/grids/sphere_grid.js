import GridTree from '../trees/grid_tree'
import BoundingSphere from '../bounds/bounding_spere'

class SphereGrid extends GridTree {
	constructor(resolution, center, radius){
		if(resolution.length !== 2){ console.warn('must have 2 resolution to make each grid'); return false }
		resolution.unshift(6)
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
	buildGrid(centerPos, axisX, axisZ){

    // temp array for demonstraion
    // VertexPositionTextureNormal[] vertices = new VertexPositionTextureNormal[width*height];

    // int index = 0;
    // for(int u = 0; u < height; u++)
    // {
    //     for(int v = 0; v < width; v++)
    //     {
    //         vertices[index].Position = new Vector3(centerPos + (axisX / width) * (v - width / 2) + (axisZ / height) * (u - height / 2));

    //         index++;
    //     }
    // }
	}
}