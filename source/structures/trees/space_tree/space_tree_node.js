import guid from '../../../generators/guid';
import { NAryTreeNode } from '../n_ary_tree';

class SpaceTreeNode extends NAryTreeNode {
	constructor(args){
		super(args)
		this.leaf = true;
		this.branch = false;
		this.objects = [];
		this.built = false;
		this.ready = false;
	}
	add(item){
		this.objects.__id = guid();
		this.objects.push(item)
		return true
	}
	remove(item){
		this.objects = this.objects.filter((obj, index)=> obj.__id == item.__id )
		return true
	}
}

export { SpaceTreeNode }
