export function facesIndexGenerator( rows, faces ){
	let current, next, across, diagonal;
	let totalIndices = rows * faces

	return function( row, indices ){
		if( row*faces >= totalIndices ){ return indices }
		for(let k = 0; k<faces; k++){
		 	current = (row * faces) + k;
		 	next = (row * faces) + ((k + 1) % faces);
		 	across = ((row + 1) * faces) + k;
		 	diagonal = ((row + 1) * faces) + ((k + 1) % faces)
		 	indices.push(current,across,diagonal, diagonal,next,current)
		}
	  return indices;
	}

}

export function faceIndexGenerator( rows ){
	let current, next, across, diagonal;
	let totalIndices = rows;

	return function( row, indices ){
		if( row >= totalIndices ){ return indices }
	 	current = row * 2;
	 	next = current+1;
	 	across = current+2;
	 	diagonal = current+3;
	 	indices.push(current,next,diagonal,diagonal,across,current)
	  return indices;
	}

}

export function lineIndexGenerator( totalPoints ){
	let index;
	return function( i, indices ){
		if( i + 1 > totalPoints ){ return indices }
	 	index = i * 2;  
	  indices.push( i, i+1 );
	  return indices;
	}
}