import guid from '../../../generators/guid';
import { RoseTreeNode } from './rose_tree_node';

class RoseTree extends RoseTreeNode {
	constructor(args={}) {
		super(null, Object.assign({ rootIndex: 0, currentIndex: 0 }, args));
		this.__tree = this;
		this.data = [];
		this.__id = guid();
	}
	setData(newData=[]){
		this.__tree.data.length = 0;
		let dataToSet = newData.slice();

		//find the root node
		let currentIndex = dataToSet.findIndex(({ parentIndex }) => parentIndex === null);
		this.setState({ currentIndex: currentIndex, rootIndex: currentIndex, parentIndex: null })

		if (currentIndex == -1 ){ console.warn('cannot set data without a root node'); return }

		this.unflatten(currentIndex, dataToSet, null, this.set.bind(this))
		this.toRoot();
	}

	flatten(){
		let thing = this.state.data.map((item, index)=> item.value )
		return thing;
	}

	reIndex(){
		if(this.node !== undefined){
			this.node = this.node;
		}
		if( this.shouldIndexDeeper() ){
			for( let i = 0; i< this.state.maxBranches; i++ ){
				this.toNth(i)
				this.reIndex()
				this.toParent()
			}
		}
	}

	unflatten(currentIndex, data, parentIndex, callback) {
		let currentData = data[currentIndex];
		callback(currentIndex, currentData.value, parentIndex)
		if(currentData.children){
			currentData.children.forEach((childIndex, index) => {
				this.unflatten(childIndex, data, currentIndex, callback)
			})
			this.__tree.data[currentIndex].state.children = currentData.children;
		}
	}

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
