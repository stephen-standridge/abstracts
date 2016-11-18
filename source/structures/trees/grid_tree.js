import guid from '../../generators/guid';

class GridNode {
	constructor({__l, __n, __first, __last}){
		this.__id = guid();
		this.__l = __l;
		this.__n = __n;
		this.__first = __first;
		this.__last = __last;
		this.__children = [];
		this.dimensions = [];
	}
	get children(){
		if(this.leaf) return this.root.grid.slice(this.__first, this.__last )

		return this.__children.reduce((sum, child)=> { return sum.concat(child.children) }, [])
	}
	set children( value ){
		let v = [].concat(value)
		if(this.leaf) return (this.root.grid.splice(this.__first, this.density, ...v )).length == 0

		this.__children.forEach((child)=> child.children = value )
		return true
	}	
	get value(){
		return this.children
	}
	set value( value ){
		this.children = value
		return true
	}
	traverse(callback, address=[]){
		if(this.leaf) return callback.call( this, this.root.grid.slice( this.__first, this.__last ), address )
		let a = address;
		this.__children.forEach((child, index)=>{
			a.push(index); 
			child.traverse( callback, a ) 
			a.pop()
		})
	}
	index(indices) {
		let current = indices && indices.length ? indices.shift() : undefined;
		if(this.leaf){
			return current !== undefined ? this.__first + current : this.__first
		}
		if(current !== undefined){
			return this.__children[current].index(indices)
		}
		return this.__first
	}
	get(indices) {
		let current = indices && indices.length ? indices.shift() : undefined;
		if(current >= this.density){ 
			console.warn(`cannot set to ${current} in dimension ${this.__l}`)			
			return
		}			
		if(this.leaf){
			return current !== undefined ? this.children[current] : this.children
		}
		return this.__children[current].get(indices)
	}
	set(indices, value) {
		let current = indices && indices.length ? indices.shift() : undefined;
		if(current >= this.density){ 
			console.warn(`cannot set to ${current} in dimension ${this.__l}`)			
			return false
		}		
		if(this.leaf){
			if(current !== undefined){
				return (this.root.grid[this.__first + current] = value) == value
			}
			this.children = value;
			return true
		}
		if(!this.__children[current]){
			return false
		}
		return this.__children[current].set(indices, value)
	}	
	makeChildren() {
		let dimensions = this.dimensions.slice();
		let childLength = dimensions.reduce((sum, density)=>{return sum * density},1)
		for(let i =0; i< this.density; i++){
			this.__children[i] = new DimensionNode(this.root, {
				__l: this.__l + 1, 
				__n: i,
				__first: this.__first + (childLength * i), 
				__last: (this.__first + (childLength * i)) + childLength
			}, this)
		}		
	}
}

class DimensionNode extends GridNode {
	constructor(grid, address, parent){
		super(address)
		this.__parent = parent || null;
		this.root = grid;		
		this.dimensions = this.__parent ? this.__parent.dimensions.slice() : this.root.dimensions.slice();
		this.density = this.dimensions.shift()
		if(this.dimensions.length == 0 ){
			this.leaf = true;
			return
		}
		this.makeChildren()
	}
	get length() {
		return this.dimensions.reduce((sum, density)=>{return sum * density},1)
	}	
}

class GridTree extends GridNode {
	constructor(dimensions){
		super({ __first: 0, __last: 0, __l: 0})
		this.dimensions = dimensions.slice();	
		this.density = this.dimensions.shift()
		this.grid = [];
		this.grid.length = this.length;
		this.root = this;
		this.makeChildren()
	}
	get length() {
		return this.dimensions.reduce((sum, density)=>{return sum * density},this.density)
	}		
}

export { GridTree }