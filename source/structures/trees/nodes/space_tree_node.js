import guid from '../../../generators/guid';
import TreeNode from './tree_node';

class SpaceTreeNode extends TreeNode {
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

export default SpaceTreeNode
