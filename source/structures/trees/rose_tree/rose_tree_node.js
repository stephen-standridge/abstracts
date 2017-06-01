import guid from '../../../generators/guid';

class RoseTreeNode {
	constructor(tree, { value, index, parent= null }){
		this.state = {
			value,
			prevIndex: parent,
			currentIndex: index,
			rootIndex: index,
			parentIndex: parent,
			children: [],
			id: guid()
		}
		this.__tree = tree;
	}
	setNav(newIndex, prev=true) {
		if(!isNaN(Number(newIndex))) {
			this.state.prevIndex = prev && this.state.currentIndex || null;
			this.state.currentIndex = newIndex;
		}
	}
	setState(state){
		let toSet;
		Object.keys(this.state).forEach((key) => {
			toSet = state[key];
			if (toSet == undefined) return;
			else this.state[key] = toSet;
		})
	}
	get root(){
		this.setNav(this.node.state.rootIndex)
		return this.node
	}
	set root(value){
		this.root
		this.node = value;
		return this.node
	}
	get rootItem(){
		this.root
		return this.nodeItem
	}
	set node(value){
		this.set(this.state.currentIndex, value)
		return this.node
	}

	get node(){
		return this.get(this.state.currentIndex)
	}
	get nodeItem(){
		return this.__tree.data[this.state.currentIndex] || undefined
	}
	getNodeItem(index){
		return this.__tree.data[index] || undefined
	}

	get parent(){
		return this.get(this.state.parentIndex)
	}
	get parentItem(){
		return this.__tree.data[this.state.parentIndex] || undefined
	}

	// must transfer children, relink parent
	// set parent(arg){
	// 	this.set(this.state.parentIndex, arg)

	// 	return this.parent
	// }


	get(index){
		return this.__tree.data[index] ? this.__tree.data[index].state : undefined
	}
	set(index, value){
		let parent = null;
		let node = this._tree.data[index];
		if (node.state.parentIndex) {
			//if the node has a parent, keep it
			parent = node.state.parentIndex;
		} else {
			//if the node was navigated to from a parent
			index == this.state.currentIndex;
			parent = this.state.prevIndex;
		}
		this._tree.data[index] = new RoseTreeNode(this._tree, { value, index, parent })
		return this._tree.data[index].state
	}


	toFirst(){
		this.toNth(0)
	}
	toLast(){
		this.toNth(this.node.state.children.length - 1);
	}
	toNth(childIndex){
		if (!this.node.state.children[childIndex]) {
			console.warn('cannot go to a child that doesnt exist')
			return;
		}
		this.setNav(this.node.state.children[childIndex])
	}
	toParent(){
		this.setNav(this.state.parentIndex)
	}

	goTo(index){
		this.setNav(index, false)
	}
	goToNode(node){
		if(node == undefined){ return }
		this.goTo(node.rootIndex)
	}

	get children(){
		return this.getChildren('node')
	}
	set children(value=[]){
		let node = this.node;
		if (node.state.children.length !== value.length) {
			console.warn('RoseTreeNode: attempting to set children with a differing number of nodes')
		}
		node.state.children.forEach((childIndex, index)=> this.set(childIndex, value[index]))
	}
	getChildren(prop='state'){
		return this.node.state.children.map((childIndex) => this.__tree.data[childIndex][prop])
	}

	addChild(value){
		let newIndex = this.__tree.data.push() - 1;
		this.node.state.children.push(newIndex);
		this.set(newIndex, value);
	}

	addChildren(values=[]){
		values.forEach((val) => this.addChild(val));
	}

	// traverse(callback, address=[]){
	// 	if(this.leaf) return callback.call( this, this.__tree.grid.slice( this.__first, this.__last ), address )
	// 	let a = address;
	// 	this.__children.forEach((child, index)=>{
	// 		a.push(index);
	// 		child.traverse(callback, a)
	// 		a.pop()
	// 	})
	// }
	// makeChildren() {
	// 	let childLength = this.dimensions(this.__l+1).reduce((sum, density)=>{return sum * density},1)
	// 	for(let i =0; i< this.density; i++){
	// 		this.__children[i] = new RoseTreeNode(this.__tree, {
	// 			__l: this.__l + 1,
	// 			__n: i,
	// 			__first: this.__first + (childLength * i),
	// 			__last: (this.__first + (childLength * i)) + childLength
	// 		}, this)
	// 	}
	// }
}
