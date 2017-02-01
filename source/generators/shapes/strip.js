import {vector, constants} from '../../math'
const TAU = constants.TAU

import {bezier} from '../curves';
import {makePointOnLoop} from './loop';
import {faceIndexGenerator, perpendiculars as makeNormals} from '../utils';

export function makeStrip(controls, n, radius){

	let returned = [[],[],[]];
	let r, t, current, index, next,normals, points;
	let faces = 2;
	let makeIndices = faceIndexGenerator( n );
	current = bezier( 0, controls );

	for (let i = 0; i<=n; i++){
		t = (i+1)/n
		next = bezier( t, controls );
		points = makePointOnLoop(current,faces,
			function(){ return radius/n *i },
			function(p){ return vector.unit(vector.subtract(p,next)) },
			function(){ return i/(n*2) });

		returned[0] = returned[0].concat(points)
		returned[1] = makeIndices( i, returned[1] )
		returned[2] = makeNormals( current, next, returned[2]);

		// returned[3] = makeUVs( i, returned[3] )
		current = next;
	}
	return returned
}