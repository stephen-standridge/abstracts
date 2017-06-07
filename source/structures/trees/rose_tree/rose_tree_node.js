import guid from '../../../generators/guid';

class RoseTreeNode {
	constructor(tree, args){
		this.state = {
			value: null,
			prevIndex: null,
			currentIndex: null,
			rootIndex: null,
			parentIndex: null,
			children: [],
			id: guid()
		}
		this.setState(args);
		this.__tree = tree;
	}

	setNav(newIndex, prevIndex=null) {
		if(!isNaN(Number(newIndex))) {
			this.state.prevIndex = !isNaN(Number(prevIndex)) ? prevIndex : null;
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

	get index() {
		return this.state.rootIndex;
	}

	get length(){
		let length = 1;
		this.getChildren().forEach((child) => length += (child.length) || 0 )
		return length;
	}

	get root() {
		return this.get(this.state.rootIndex);
	}

	get rootObject(){
		return this.getObject(this.state.rootIndex);
	}

	get rootState(){
		return this.getState(this.state.rootIndex);
	}

	get rootValue(){
		this.root;
		return this.nodeValue;
	}

	get node() {
		return this.nodeValue
	}

	get nodeValue(){
		let returned = this.getState(this.state.currentIndex);
		return returned && returned.value;
	}

	get nodeState(){
		let returned = this.getState(this.state.currentIndex);
		return returned && returned;
	}

	get nodeObject(){
		return this.__tree.data[this.state.currentIndex] || undefined
	}

	get parent(){
		return this.get(this.nodeState.parentIndex)
	}

	get parentState(){
		return this.getState(this.nodeState.parentIndex)
	}

	get parentObject(){
		return this.getObject(this.nodeState.parentIndex)
	}

	getObject(index) {
		return this.__tree.data[index];
	}

	getState(index){
		return this.__tree.data[index] ? this.__tree.data[index].state : undefined
	}

	get(index){
		return this.__tree.data[index] ? this.__tree.data[index].state.value : undefined
	}

	set(index, value, parentIndex=null){
		let parent = parentIndex;
		let node = this.__tree.data[index];

		if (isNaN(parent) && node && node.state.parentIndex) {
			//if the node has a parent, keep it
			parent = node.state.parentIndex;
		} else if(isNaN(parent)) {
			//if the node was navigated to from a parent
			parent = this.state.prevIndex != this.state.currentIndex ? this.state.prevIndex : null;
		}

		if (node) {
			node.nodeState.value = value;
		} else {
			this.__tree.data[index] = new RoseTreeNode(this.__tree, { value, currentIndex: index, rootIndex: index, parentIndex: parent })
		}
		return this.__tree.data[index].state
	}

	setNode(value) {
		return this.set(this.state.currentIndex, value).value
	}

	setRoot(value) {
		return this.set(this.state.rootIndex, value).value
	}

	setChild(index, value) {
		if (index == undefined) return false
		let childIndex = this.nodeState.children[index];
		if (childIndex == undefined) return false
		// let node = this.getObject(childIndex).removeChildren();
		return this.set(childIndex, value).value
	}

	setParent(value) {
		let parentIndex = this.nodeState.parentIndex;
		if (parentIndex !== null) return this.set(parentIndex, value).value

		parentIndex = this.__tree.data.push(undefined) - 1;
		this.set(parentIndex, value)
		this.__tree.data[parentIndex].state.children.push(this.nodeState.currentIndex)
		this.__tree.data[this.nodeState.currentIndex].state.parentIndex = parentIndex;
		if(this.nodeState.rootIndex == this.state.rootIndex) {
			this.state.rootIndex = parentIndex;
		}
		return this.parent.value;
	}

	toFirst(){
		this.toNth(0)
	}

	toLast(){
		this.toNth(this.nodeState.children.length - 1);
	}

	toNth(childIndex){
		this.setNav(this.nodeState.children[childIndex], this.nodeState.currentIndex)
	}

	toRoot(){
		this.setNav(this.state.rootIndex, null)
	}

	toParent(){
		if (this.nodeState.parentIndex == null) return;
		this.setNav(this.nodeState.parentIndex, this.nodeState.currentIndex)
	}

	toNode(index){
		this.setNav(index)
	}

	get children(){
		return this.getChildren('node')
	}

	getChildren(prop){
		return this.nodeState.children.map((childIndex) => prop && this.__tree.data[childIndex][prop] || this.__tree.data[childIndex])
	}

	addChild(value){
		let newIndex = this.__tree.data.push(undefined) - 1;
		if (this.nodeObject) {
			this.nodeObject.state.children.push(newIndex);
		}
		this.set(newIndex, value, newIndex == this.state.currentIndex ? null : this.state.currentIndex );
	}

	addChildren(values=[]){
		values.forEach((val) => this.addChild(val));
	}

	remove(index=this.state.currentIndex) {
		let node = this.getObject(index);
		node.removeChildren();
		let parentIndex = node.state.parentIndex;
		delete this.__tree.data[node.index]

		if (parentIndex !== null) {
			//remove from parent
			this.__tree.data[parentIndex].state.children = this.__tree.data[parentIndex].state.children.filter((childIndex) => childIndex != index)
		}

		if(index == this.state.currentIndex) {
			//go to parent node if currentIndex no longer exists
			this.toNode(parentIndex)
		}
	}

	removeChild(index) {
		if(index == undefined) return;
		//get the index relative to the parent
		this.remove(this.getChildren('index')[index])
	}

	removeChildren(){
		this.getChildren().forEach((child) => {
			child.removeChildren();
			delete this.__tree.data[child.index]
		})
	}

	eachChild(callback, ctx=this){
		let children = [];
		this.nodeState.children.forEach((childIndex, index) => {
			this.toNth(index);
			children.push(callback.call(this, this.node, this.nodeState))
			this.toParent()
		});
		return children;
	}

	preOrderTraverse(callback, ctx=this){
		callback.call(ctx, this.node, this.nodeState)
		this.nodeState.children.forEach((childIndex, index) => {
			this.toNth(index);
			this.nodeObject.preOrderTraverse(callback, ctx);
			this.toParent();
		})
	}

	postOrderTraverse( callback, ctx=this ){
		this.nodeState.children.forEach((childIndex, index) => {
			this.toNth(index);
			this.nodeObject.postOrderTraverse( callback, ctx );
			this.toParent();
		})
		callback.call(ctx, this.node, this.nodeState)
	}
}

export { RoseTreeNode }
