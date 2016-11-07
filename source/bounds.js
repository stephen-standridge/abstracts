class Bounds {
	contains(point, dimension){
		if(dimension !== undefined){
			if(dimension >= this.dimensions || dimension >= point.length ){ return false }
			return Math.abs(this.center(dimension) - point[dimension]) <= this.extent(dimension)
		}
		return point.reduce((bool, value, index)=>{ 
			return bool && Math.abs(this.center(index) - value) <= this.extent(index)
		}, true)
	}
	intersects(center,extent){
		let extents2 = !isNaN(Number(extent)) ? [extent, extent, extent] : extent, 
				dmin = 0, min, max, 
				center1 = this.center(),
				extents1 = this.extent();
		return center.reduce((bool, value, i)=>{
			min = center1[i] - extents1[i];
			max = center1[i] + extents1[i]
			dmin = 0
	    if( value < min ) dmin += Math.pow( value - min, 2 );
	    else if( value > max ) dmin += Math.pow( value - max, 2 );
	    return bool && dmin <= extents2[i] * extents2[i]
		}, true)
	}	
}

export default Bounds