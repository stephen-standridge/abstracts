import guid from '../../../generators/guid';

class NAryTreeNode {
	constructor({value, level, node}){
		this.value = value
		this.__l = level
		this.__n = node
		this.__id = guid()
	}
}

export { NAryTreeNode }
