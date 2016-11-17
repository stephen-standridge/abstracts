import {PHI, E, TAU} from '../math/constants';

export function logarithmic( c, r, a ){
	let angle = a || 0.30635;
	let constant = c || 1;
	let rotation = r || TAU;
	return function(x){
		let t = x * rotation
		let polar = constant * Math.pow(E, angle * t)
		return [
			(polar * Math.cos(t)).toFixed(5)/1,
			(polar * Math.sin(t)).toFixed(5)/1,
			(polar * Math.tan(angle)).toFixed(5)/1
		]
	}
}