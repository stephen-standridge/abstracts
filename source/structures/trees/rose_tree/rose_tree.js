import guid from '../../../generators/guid';
import { RoseTreeNode } from './rose_tree_node';

class RoseTree extends RoseTreeNode {
	constructor(args={}) {
		super(null, { index: 0, parent: null })
		this.__tree = this;
		this.data = [];
		this.setState(args);
		this.__id = guid();
	}
	setData(newData=[]){
		this.state.data = newData.slice();
		this.root
		return this.state.data
	}
	flatten(){
		let thing = this.state.data.map((item, index)=> item.value )
		return thing;
	}
	get length(){
		return this.children.reduce((sum, child) => { return sum + child.length }, 1)
	}




	eachChild(block){
		let children = [];
		for(let i = 0; i< this.state.maxBranches; i++){
			this.toNth( i )
			children.push(block.call(this, this.nodeItem, i))
			this.toParent()
		}
		return children;
	}


	preOrderDepth(callback, ctx=this){
		callback.call(ctx, this.node, this.state.node, this.state.level)
		for( let i = 0; i< this.state.maxBranches; i++ ){
			this.toNth(i)
			if( this.shouldTraverseDeeper() ){
				this.preOrderDepth( callback, ctx )
			}
			this.toParent()
		}
	}
	postOrderDepth( callback, ctx=this ){
		for( let i = 0; i< this.state.maxBranches; i++ ){
			this.toNth(i)
			if( this.shouldTraverseDeeper() ){
				this.postOrderDepth( callback, ctx )
			}
			this.toParent()
		}
		callback.call(ctx, this.node, this.state.node, this.state.level)
	}
	preOrderBreadth(callback, ctx=this){
		if( !this.node ){ return }

		let q = [], current, count=0;
		q.push(this.nodeAddress)

		while( q.length > 0){
			current = q[0];
			q.shift();
			if( this.getIndex(current.__l, current.__n) < this.state.data.length ){
				this.goToNode(current)
				callback.call(ctx, this.node, this.state.node, this.state.level)
				q = q.concat(this.getChildren('nodeAddress'))
			}
		}
	}

	// reIndex(){
	// 	if(this.node !== undefined){
	// 		this.node = this.node;
	// 	}
	// 	if( this.shouldIndexDeeper() ){
	// 		for( let i = 0; i< this.state.maxBranches; i++ ){
	// 			this.toNth(i)
	// 			this.reIndex()
	// 			this.toParent()
	// 		}
	// 	}
	// }


	// trim(){
	// 	if(this.state.maxDepth && this.state.level > this.state.maxDepth){
	// 		this.reRoot();
	// 	}
	// }
	// toParentAtLevel(level=0){
	// 	while(this.state.level > level){
	// 		this.toParent()
	// 	}
	// }
	// reRoot(){
	// 	var level = this.state.level,
	// 			node = this.state.node,
	// 			returnToIndex = 0,
	// 			returned = [];

	// 	this.toParentAtLevel(1);
	// 	this.preOrderBreadth((item, n, l)=>{
	// 		returned.push(this.nodeItem)
	// 		if(l == level && n == node){
	// 			returnToIndex = returned.length -1;
	// 		}
	// 	})
	// 	this.setData(returned)
	// 	this.goToNode(this.state.data[returnToIndex])
	// 	return
	// }

	toJS(retrieved = false){
		let returned = [];
		this.state.data.forEach((item)=> {
			if( retrieved && item ){
				returned.push(item[retrieved]);
			}else{
				returned.push(item);
			}
		})
		return returned;
	}
}
export { RoseTree }
