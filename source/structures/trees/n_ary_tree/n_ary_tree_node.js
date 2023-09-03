import guid from '../../../generators/guid';

class NAryTreeNode {
	constructor({ value, level, node, order }) {
		this.value = value
		this.__order = order || null;
		this.__l = level
		this.__n = node
		this.__id = guid()
	}
}

export { NAryTreeNode }
