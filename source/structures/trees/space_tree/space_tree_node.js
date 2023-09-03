import guid from '../../../generators/guid';
import { NAryTreeNode } from '../n_ary_tree';

class SpaceTreeNode extends NAryTreeNode {
	constructor(args) {
		super(args)
		this.leaf = true;
		this.branch = false;
		this.indices = [];
		this.objects = [];
		this.built = false;
		this.ready = false;
	}
	add(item, index = null) {
		this.objects.__id = guid();
		this.objects.push(item)
		if (index != null) {
			this.indices.push(index)
		}
		return true
	}
	remove(item) {
		this.objects = this.objects.filter((obj, index) => obj.__id == item.__id)
		return true
	}
}

export { SpaceTreeNode }
