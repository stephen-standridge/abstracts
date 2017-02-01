import {vector} from '../../math'

export function normalsGenerator(type){
	switch( type ){
		case 'towards':
			break;
		case 'away':
			return away;
			break;
		case 'perpendicular':
			break;
	}
}

export function away( pointA, pointB ){
	return vector.unit(vector.subtract(a,b))
}

export function aways( point, points, normals ) {
	for(let p = 0; p<points.length; p+=3){
		normals = normals.concat( 
			vector.unit( vector.subtract(point,points.slice( p, p+3 )))
		)
	}
	return normals;
}

export function perpendicular( pointA, pointB, normals ){

}

export function perpendiculars( pointsA, pointsB, normals ){
	let n;
	for(let p = 0; p<pointsA.length; p+=3){
		n = vector.scale(vector.cross( pointsA.slice( p, p+3 ), pointsB.slice( p, p+3 ) ), -1.0);
		normals = normals.concat(n,n)
	}
	return normals;
}