import { GridNode } from './grid_node';

class GridTree extends GridNode {
	constructor(dimensions){
		super({ __first: 0, __last: 0, __l: 0})
		this.__dimensions = dimensions.slice();
		this.grid = [];
		this.grid.length = this.length;
		this.root = this;
		this.makeChildren()
	}
	dimensions(start=0, end=this.__dimensions.length){
		return this.__dimensions.slice(start,end)
	}
	get density(){
		return this.dimensions()[0]
	}
}

export { GridTree }
