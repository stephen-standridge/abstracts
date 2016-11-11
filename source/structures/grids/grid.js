import { each, times } from 'lodash'

class Grid {
	constructor(d){
		this.dimensions = d.filter((item)=> item );
		if(!this.dimensions.length){ console.warn('no dimensions set')}		
		this.grid = [];
		this.grid.length = this.length;
	}
	get length(){
		return this.dimensions.reduce((sum, x)=>{return sum * x}, 1);
	}
	iterate(callback){
	  let x,z, i,k;
	  let returned = [];
	  for(i = 0; i< this.dimensions[0]; i++){
	    x = this.dimensions[1]-1 == 0 ? 0 : i/(this.dimensions[1]-1);
	    for(k=0; k< this.dimensions[2]; k++){
	      z = this.dimensions[2]-1 == 0 ? 0 : k/(this.dimensions[2]-1);
	      returned.push(callback([i,k], [x,z]))
	    }
	  }
	  return returned
	}	
	index(indices) {
		let slice;
		return indices.reduce((sum,k,i)=>{ 
			if(k >= this.dimensions[i]){ console.warn('index is higher than 0-indexed dimension bounds') }
			slice = this.dimensions.slice(0,i).reduce((sum, n)=>{ return sum * n },1)	
			return sum + (k *  slice ) 
		}, 0)
	}
	get([x,y,z=false]){
	  if (x < 0 || x > this.dimensions[0] - 1 || y < 0 || y > this.dimensions[1] - 1) return;
	  let index = this.index([x,y])
	  if (this.dimensions[2] == 1){
		  return this.grid[index]	  	
	  }
  	let returned = this.grid.slice(index, index+this.dimensions[2])
  	if(z){ return returned[z] }
  	return returned
	}
	set([x,y,z=false],value){
	  if (x < 0 || x > this.dimensions[0] - 1 || y < 0 || y > this.dimensions[1] - 1 || z && z > this.dimensions[2]) return;		
	  let index, count = 0, toSet = [], length;
	  index = this.index([x,y])
	  length = this.dimensions[2];
	  if (this.dimensions[2] == 1){
	  	this.grid[index] = value;
	  	return this.grid[index];
	  }	  
	  if(typeof z == 'number' && z < this.dimensions[2] ){
			count = z;
			length = 1;
	  }	  
	  toSet = toSet.concat(value);
	  toSet.length = this.dimensions[2];
	  this.grid.splice(index+count,length,...toSet)
	  return this.grid.slice(index, index+this.dimensions[2])
	}

}

export default Grid