import guid from '../../generators/guid';

class DimensionNode extends GridNode {
	constructor(grid, parent){
		super()
		this.__dimensionIndex = parent ? parent.__dimensionIndex + 1 : grid.__dimensionIndex + 1;
		this.__parent = parent || null;
		this.grid = grid;		
		this.__index = grid.getIndex(this.__dimensionIndex);
		this.__id = guid()
		if(this.__dimensionIndex = this.grid.dimensions.length - 1){
			this.leaf = true;
			return
		}
		this.makeChildren()
	}
}
class GridNode {
	constructor(){
		this.__dimensionIndex = 0;
		this.__children = [];
	}

	get count() {
		return this.dimensions ? this.dimensions[this.__dimensionIndex] : this.grid.dimensions[this.__dimensionIndex];
	}	
	get children(){
		if(this.leaf) return this.grid.slice(this.__index, this.__index + this.count )

		return this.__children.reduce((sum, child)=> { return sum.concat(child.children }, [])
	}
	set children( value ){
		if(this.leaf) return this.grid.splice(this.__index, this.count, this.count > 1 ? ...value : value )

		this.__children.forEach((child)=> { child.children = value })
		return true
	}	
	get(indices){
		if(indices.length == 0){
			return this.children
		}
		let index = indices.unshift();
		this.__children[index].get(indices)
	}
	set(indices, value){
		if(indices.length == 0){
			this.children = value;
			return true;
		}
		let index = indices.unshift();
		this.__children[index].set(indices, value)
	}	
	makeChildren(){
		for(let i =0; i< this.count; i++){
			this.__children[i] = new DimensionNode(grid, this)
		}		
	}
}


class Grid extends DimensionNode {
	constructor(dimensions){
		super()
	}
	getIndex(){

	}
}