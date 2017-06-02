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
	get length(){
		let length = 1;
		this.state.children.forEach((childIndex) => length += (this.get(childIndex).length) || 0 )
		return length;
	}
	get root(){
		this.setNav(this.state.rootIndex, this.state.currentIndex)
		return this.node
	}
	set root(value){
		this.root
		this.node = value;
		return this.node
	}
	get rootObject(){
		this.root
		return this.nodeObject
	}
	get rootState(){
		this.root;
		return this.nodeState;
	}
	get rootValue(){
		this.root;
		return this.nodeValue;
	}

	set node(value){
		this.set(this.state.currentIndex, value)
		return this.node
	}

	get node() {
		return this.nodeValue
	}
	get nodeValue(){
		let returned = this.get(this.state.currentIndex);
		return returned && returned.value;
	}
	get nodeState(){
		let returned = this.get(this.state.currentIndex);
		return returned && returned;
	}
	get nodeObject(){
		return this.__tree.data[this.state.currentIndex] || undefined
	}
	getNodeItem(index){
		return this.__tree.data[index] || undefined
	}

	get parent(){
		let returned = this.get(this.state.parentIndex);
		return returned && returned.value;
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
		this.__tree.data[index] = new RoseTreeNode(this.__tree, { value, currentIndex: index, rootIndex: index, parentIndex: parent })
		return this.__tree.data[index].state
	}


	toFirst(){
		this.toNth(0)
	}
	toLast(){
		this.toNth(this.nodeState.children.length - 1);
	}
	toNth(childIndex){
		if (!this.nodeState.children[childIndex]) {
			console.warn('cannot go to a child that doesnt exist')
			return;
		}
		this.setNav(this.nodeState.children[childIndex], this.nodeState.currentIndex)
	}
	toParent(){
		this.setNav(this.nodeState.parentIndex, this.nodeState.currentIndex)
	}

	goTo(index){
		this.setNav(index)
	}
	goToNode(node){
		if(node == undefined){ return }
		this.goTo(node.rootIndex)
	}

	get children(){
		return this.getChildren('node')
	}
	set children(value=[]){
		let node = this.nodeState;
		if (node.children.length !== value.length) {
			console.warn('RoseTreeNode: attempting to set children with a differing number of nodes')
		}
		node.children.forEach((childIndex, index)=> this.set(childIndex, value[index], this.state.currentIndex))
	}
	getChildren(prop='state'){
		return this.nodeState.children.map((childIndex) => this.__tree.data[childIndex][prop])
	}

	addChild(value){
		let newIndex = this.__tree.data.push(undefined) - 1;
		this.nodeObject.state.children.push(newIndex);
		this.set(newIndex, value, this.state.currentIndex);
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

export { RoseTreeNode }
