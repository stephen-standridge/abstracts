import {vector, constants} from '../../math'
import {logarithmic} from '../curves'
import {makePointsOnLoop} from './loop';
import {lineIndexGenerator} from '../utils';

export function makeLine( controls, n, radius ){
	// makes a line divided into n segments 
	// with decrementing random variation around the given radius
	// #TODO: confine previous and next radius to be relative to eachother
	let returned = [[],[]];
	let v, r, t, current,next;
	let makeIndices = lineIndexGenerator( n );
	current = controls[0];
	let spiral = logarithmic( -0.1, constants.TAU * 2 )
	for (let i = 0; i<=n; i++){
		t = i/n 
		next = spiral( t );
		// v = makePointsOnLoop(current,1,
		// 	Math.random,
		// 	function(p){ return vector.unit(vector.subtract(p,next)) },
		// 	function(){ return i });
		v = next;

		returned[0] = returned[0].concat(v)
		returned[1] = makeIndices( i, returned[1] )
		// returned[2] = makeNormals( i, returned[2] )
		current = next;
	}
	return returned
}