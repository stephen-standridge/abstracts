import { each, times } from 'lodash'

//a flat tree wherein each entry is a pointer to the next index until the end.
//['1,2','3,4,5','6,7,8']

class Grid {
	constructor(d){
		this.dimensions = d.filter((item)=> item );
		if(!this.dimensions.length){ console.warn('no dimensions set')}		
		this.nodes = [];
		this.indices = [];
		this.nodes.length = this.length;
		this.indices.length = this.length;
		this.createIndices()
		this.cache = {};
	}
	get length(){
		return this.dimensions.reduce((sum, x)=>{return sum * x}, 1);
	}
	createIndices(){
		this.indices = this.indices.map((v,i)=>i)
	}
	iterate(callback, dimensions=this.dimensions){
		dimensions.forEach(()=>{

		})
		//specify direction, number, or all
		let start;

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
	memo(indices) {
		let cached = this.cache[indices.join('_')];
		if (cached) return cached
		return indices.reduce((sum,k,i)=>{ 	
			return sum + ( k *  this.dimensions.slice(0,i).reduce((sum, n)=>{ return sum * n },1) ) 
		}, 0)
	}
	index(indices) {
		if(!this.inRange(indices)){ return false }

		return this.memo( indices )
	}
	inRange(indices){
		return indices.reduce((sum,k,i)=>{ 
			if(!(k < this.dimensions[i]) ){ console.warn(`index ${i} is out of dimension bounds`); }
			return sum && k < this.dimensions[i];
		}, true)
	}
	get(indices){
		if(!this.inRange(indices)){ return }
		let difference = this.dimensions.length - indices.length;
	  let index = this.index(indices)

		if(difference <= 0){
		  if (!isNaN(Number(index))){
		  	return this.nodes[index];
		  }
		}
		let lastIndex = index+this.dimensions[this.dimensions.length - 1];
		return this.nodes.slice(index, lastIndex)
	}
	set(indices,value){
		if(!this.inRange(indices)){ return false }
		let difference = this.dimensions.length - indices.length;

		if(difference <= 0){
		  let index = this.index(indices)			
		  if (!isNaN(Number(index))){
		  	this.nodes[index] = value;
		  	return true
		  }
		}
		let length = this.dimensions[this.dimensions.length - 1];

	  let index = this.index(indices)
	  for(let i = 0; i< length; i++){
	  	indices.push(i)
	  	this.nodes[this.index(indices)] = value[i]
	  	indices.pop()	  	
	  }
		return true
	}

}

export default Grid