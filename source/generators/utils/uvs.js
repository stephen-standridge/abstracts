export function uvGenerator( rows, cols ){
	let colValue = (1.0/(cols-1));
	let rowValue = (1.0/(rows))
	return function( i, uvs ){
		let u,v;
		if( i > rows ){ return uvs }
		for(let k = 0; k< cols; k++){
			v = colValue * k;
			u = rowValue * i;
		 	uvs.push(u,v)
		}
	  return uvs;
	}

}
