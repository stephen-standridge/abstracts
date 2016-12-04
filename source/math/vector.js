export function dot( a, b ) {
	return a.reduce((start, next, index)=> {
		return start + next * b[index]
	},0)
}

export function cross( a, b ) {
	if( a.length !== 3 || b.length !== 3){ throw new Error('can only cross vectors in 3d')}
	return [ 
		a[1] * b[2] - a[2] * b[1],
		a[2] * b[0] - a[0] * b[2],
		a[0] * b[1] - a[1] * b[0]
	]
}

export function perpendicular( v, s ) {
	// return vector such that v dot vector = 0;
	// v[0] * vector[0] + v[1] * vector[1] + v[2] * vector[2] = 0
	// v[2] * vector[2] = -v[0] * vector[0] - v[1] * vector[1]
	// vector[2] = ( -v[0] * vector[0] - v[1] * vector[1] ) / v[2]
	return [ 
		s, 
		s,
		( - v[0] * s - v[1] * s ) / v[2]
	];
}

export function direction(to,from) {
	return unit(subtract(to,from))
}

export function length( v ) {
	return Math.sqrt( dot(v, v) );
}

export function toLength( v, s ) {
	let u = unit( v );
	return scale( u, s )
}

export function unit( v ) {
	let l = length( v );
	return v.map( p => p / l)
}

export const normalize = unit;

export function descale( v, s ) {
	return v.map( p => p / s)
}

export function multiply( a, b ) {
	return a.map( (p, i) => p * b[i])
}

export function divide( a, b ) {
	return a.map( (p, i) => p / b[i])
}

export function add(vectors) {
	let returned = [], newVector = [];
	vectors.forEach((toAdd)=> { 
		toAdd.forEach((value,i)=>{
			returned[i] = !isNaN(Number(returned[i])) ? Number(value) + returned[i] : Number(value)
		})
	})
	return returned
}

export function subtract( a, b ) {
	return a.map( (p, i) => p - b[i])
}

export function distance( a, b ) {
	return a.map( (p, i) => Math.abs(p - b[i]) )
}

export function scale( v, s ) {
	return v.map( p => p * s)
}

export function copy( v ) {
	return v.slice(0)
}

export function average(a) {
	let t = add(a);
	return descale(t, a.length);
}

export function createAxes(v, s) {
	let a = unit(perpendicular( v, s || Math.random() ));
	let b = cross(a, v)
	return [a, b]	
}

export function majorAxis(v) {
	return v.reduce((returned, p, i) => { 
		if(Math.abs(p) > Math.abs(returned[0]) ) { returned = [p,i] }
		return returned
	}, [0,0])
}