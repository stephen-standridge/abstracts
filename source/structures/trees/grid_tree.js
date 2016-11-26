import {GridNode} from './nodes/grid_node';

class GridTree extends GridNode {
	constructor(dimensions){
		super({ __first: 0, __last: 0, __l: 0})
		this.__dimensions = dimensions.slice();
		this.grid = [];
		this.grid.length = this.length;
		this.root = this;
		this.makeChildren()
	}
	dimensions(level=0){
		return this.__dimensions.slice(level)
	}
	get density(){
		return this.dimensions()[0]
	}	
}

export { GridTree }