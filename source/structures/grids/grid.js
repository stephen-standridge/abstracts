import { each, times } from 'lodash'

class Grid {
	constructor(d){
		this.dimensions = d.filter((item)=> item );
		if(!this.dimensions.length){ console.warn('no dimensions set')}		
		this.nodes = [];
		this.nodes.length = this.length;
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
		if(!this.inRange(indices)){ return false }
		return indices.reduce((sum,k,i)=>{ 
			slice = this.dimensions.slice(0,i).reduce((sum, n)=>{ return sum * n },1)	
			return sum + (k *  slice ) 
		}, 0)
	}
	inRange(indices){
		return indices.reduce((sum,k,i)=>{ 
			if(!(k < this.dimensions[i]) ){ console.warn(`index ${i} is out of dimension bounds`); }
			return sum && k < this.dimensions[i];
		}, true)
	}
	get(indices){
		if(!this.inRange(indices)){ return false }
	  let index = this.index(indices)
	  if (this.dimensions[2] == 1){
		  return this.nodes[index]	  	
	  }
  	let returned = this.nodes.slice(index, index+this.dimensions[2])
  	if(z){ return returned[z] }
  	return returned
	}
	set(indices,value){
		if(!this.inRange(indices)){ return false }
	  let index, count = 0, toSet = [], length;
	  index = this.index(indices)

	  if (!isNaN(Number(index))){
	  	this.nodes[index] = value;
	  	return true
	  }	  
	  if(typeof z == 'number' && z < this.dimensions[2] ){
			count = z;
			length = 1;
	  }	  
	  toSet = toSet.concat(value);
	  toSet.length = this.dimensions[2];
	  this.nodes.splice(index+count,length,...toSet)
	  return this.nodes.slice(index, index+this.dimensions[2])
	}

}

export default Grid