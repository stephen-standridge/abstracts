class Grid {
	constructor(x, y, z=1){
		if(!x && !y){ console.warn('no dimensions set')}
		this.dimensions =[x, x||y, z]		
		this.grid = [];
		this.grid.length = this.dimensions[0] * this.dimensions[1] * this.dimensions[2];
	}
	length(){
		return this.dimensions[0] * this.dimensions[1] * this.dimensions[2];
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
	index([x,y,z=false]) {
		return (x * this.dimensions[2])  + (y * this.dimensions[0] * this.dimensions[2])
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
  average(values) {
  	if( this.dimensions[2] == 1 ) return this._average(values);
  	let total = [];
  	let sum = values.reduce((start, val)=>{
  		if( val == undefined || !val.length ) return start
  		for(let i = 0, v; i<this.dimensions[2]; i++){
  			v = val[i]
	  		if( v !== undefined ){
	  			start[i] = typeof start[i] == 'number' ? start[i] + v : v;
	  			total[i] = typeof total[i] == 'number' ? total[i] + 1 : 1;
	  		}
  		}
  		return start
  	},[]);

  	return sum.map((val, i)=> val / total[i] )
  }
  _average(values) {
    let valid = values.filter((val)=> val !== undefined && val !== -1 );
    var total = valid.reduce((sum, val)=>{ return sum + val; }, 0);
    return total / valid.length;
  }

}

export {Grid}