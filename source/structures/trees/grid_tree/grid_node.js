import guid from '../../../generators/guid';
import { forEachRight } from 'lodash';

class GridNode {
	constructor({__l, __n, __first, __last}){
		this.__id = guid();
		this.__l = __l;
		this.__n = __n;
		this.__first = __first;
		this.__last = __last;
		this.__children = [];
	}
	get length() {
		return this.dimensions().reduce((sum, density)=>{return sum * density},1)
	}
	get NodeType() {
		return DimensionNode
	}
	get children(){
		if(this.leaf) return this.root.grid.slice(this.__first, this.__last )

		return this.__children.reduce((sum, child)=> { return sum.concat(child.children) }, [])
	}
	set children(value){
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
			child.traverse(callback, a)
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
		indices = indices.slice()
		let current = indices && indices.length ? indices.shift() : undefined;
		if(current >= this.density){
			// console.warn(`OUT OF RANGE INDICES:: cannot set to ${current} in dimension ${this.__l}`)
			return
		}
		if(this.leaf){
			return current !== undefined ? this.children[current] : this.children
		}
		return current !== undefined && this.__children[current] ? this.__children[current].get(indices) : this.children
	}
	set(indices, value) {
		let current = indices && indices.length ? indices.shift() : undefined;
		if(current >= this.density){
			// console.warn(`OUT OF RANGE INDICES:: cannot set to ${current} in dimension ${this.__l}`)
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
		let childLength = this.dimensions(this.__l+1).reduce((sum, density)=>{return sum * density},1)
		for(let i =0; i< this.density; i++){
			this.__children[i] = new this.NodeType(this.root, {
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
		this.parent = parent || null;
		this.root = grid;
		if(this.leaf) return
		this.makeChildren()
	}
	get density(){
		return this.dimensions()[0]
	}
	get leaf(){
		return this.dimensions().length == 1
	}
	dimensions(level = this.__l){
		return this.root.dimensions().slice(level)
	}
}

export { GridNode, DimensionNode }
