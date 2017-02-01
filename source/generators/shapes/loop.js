import {vector, constants} from '../../math'
const TAU = constants.TAU
export function makePointOnLoop(start, end, radius, n){
	// chooses a point on a circle in 3d space
	// http://math.stackexchange.com/questions/73237/parametric-equation-of-a-circle-in-3d-space
	let returned = [];
	let angle, axis, a, b;
	axis = vector.subtract(end, start);
	[a, b] = vector.createAxes(axis)


	angle = Math.random() * TAU;

	let x = end[0]+( radius * Math.cos( angle ) * a[0] )+( radius * Math.sin( angle ) * b[0] )
	let y = end[1]+( radius * Math.cos( angle ) * a[1] )+( radius * Math.sin( angle ) * b[1] )
	let z = end[2]+( radius * Math.cos( angle ) * a[2] )+( radius * Math.sin( angle ) * b[2] )

	return [x,y,z]
}

export function makePointsOnLoop(point, n=1, radius, axis, rotation){
	// chooses a point on a circle in 3d space
	// point is the location of the circle in 3d space
	// where axis returns the normal of the circle	
	// and rotation returns a number 0-1 corresponding to the percent of TAU 
	// and radius returns the radius
	// http://math.stackexchange.com/questions/73237/parametric-equation-of-a-circle-in-3d-space
	let returned = [];
	let angle,axis1,axis2,sin,cos,
	rad = typeof radius == 'function' ? radius() : radius,
	rot = typeof rotation == 'function' ? rotation() : rotation,
	axis0 = typeof axis == 'function' ? axis( point ) : axis;
	[axis1, axis2] = vector.createAxes(axis0)

	for(let i = 0; i< n; i++){


		sin = Math.sin( (rot*TAU) + (TAU/n * i)),
		cos = Math.cos( (rot*TAU) + (TAU/n * i));
		returned.push(
			point[0]+( rad * cos * axis1[0] )+( rad * sin * axis2[0] ),
			point[1]+( rad * cos * axis1[1] )+( rad * sin * axis2[1] ),
			point[2]+( rad * cos * axis1[2] )+( rad * sin * axis2[2] )			
		)
	}

	return returned
}



