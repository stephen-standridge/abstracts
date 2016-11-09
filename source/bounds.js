const EPSILON = 0.0002
class Bounds {
	intersects(arg1, arg2){
		let [center, extent] = arg1.toParams ?  arg1.toParams() : [arg1, arg2]
				extent = extent || 0
		let extents2 = !isNaN(Number(extent)) ? [extent, extent, extent] : extent, 
				dmin = 0, min, max, 
				center1 = this.center(),
				extents1 = this.extent(),
				dist, contained, overlapping, difference;
		return center.reduce((bool, value, i)=>{
	  	dist = Math.abs(value-center1[i]);	 
	  	//a shape is contained if the difference of centers
	  	//is less than the difference of extents 	
	  	overlapping = dist - (extents1[i]+extents2[i]) <= EPSILON;
	  	difference = Math.abs(extents1[i] - extents2[i]);
	  	contained = dist < difference;
			return bool && (overlapping && !contained)
		}, true)
	}		
	contains(arg1, arg2){
		let [center, extent] = arg1.toParams ?  arg1.toParams() : [arg1, arg2]
				extent = extent || 0
		let extents2 = !isNaN(Number(extent)) ? [extent, extent, extent] : extent, 
				dmin = 0, min, max, 
				center1 = this.center(),
				extents1 = this.extent(),
				dist, contained, overlapping, difference;
		return center.reduce((bool, value, i)=>{
	  	dist = Math.abs(value-center1[i]);	 
	  	//a shape is contained if the difference of centers
	  	//is less than the difference of extents 	
	  	difference = (extents1[i] - extents2[i]);
	  	contained = dist < difference;
			return bool && contained
		}, true)
	}	
}

export default Bounds