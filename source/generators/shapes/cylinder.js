import {makePointsOnLoop} from './loop';
import {facesIndexGenerator, aways as makeNormals, uvGenerator} from '../utils'


export function makeCylinder(controls, n, radius){

	let returned = [[],[],[],[]];
	let r, t, current, index, next, normals, points;
	let faces = 7;
	let makeIndices = facesIndexGenerator( n, faces );
	let makeUVs = uvGenerator( n,faces );
	current = bezier( 0, controls );

	for (let i = 0; i<=n; i++){
		t = (i+1)/n
		next = bezier( t, controls );
		points = makePointsOnLoop(current,faces,
			function(){ return radius },
			function(p){ return vector.unit(vector.subtract(p,next)) },
			function(){ return 0 });

		returned[0] = returned[0].concat(points)
		returned[1] = makeIndices( i, returned[1] )
		returned[2] = makeNormals( current, points, returned[2] )		
		returned[3] = makeUVs( i, returned[3] )
		current = next;
	}
	return returned
}