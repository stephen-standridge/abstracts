import guid from '../../../generators/guid';
import { RoseTreeNode } from './n_ary_tree_node';

class RoseTree {
	constructor(args={}) {
		this.state = this.initialState();
		this.set(args);
		this.__id = guid();
	}
	initialState() {
		return {
			data: [],
			maxBranches: 2,
			maxDepth: false
			level: 0,
			node: 0,
			maxLevel: 0,
			maxNode: 0
		};
	}
	set(state){
		Object.keys(this.state).forEach((key) => {
			if (state[key] == undefined) return;
			if (key == 'data') this.state[key] = state[key].slice();
			else this.state[key] = state[key];
		})
		this.root
		this.index();
	}
	flatten(){
		let thing = this.state.data.map((item, index)=> item.value )
		return thing;
	}
	shouldIndexDeeper(){
		return this.getIndex( this.state.level, this.state.maxBranches ) < this.traversed();
	}
	shouldTraverseDeeper(){
		return this.getIndex( this.state.level, this.state.maxBranches ) < this.length;
	}
	get length(){
		return this.maxNodeIndex( this.state.depth ) + 1
	}
	traversed(){
		return this.maxNodeIndex( this.state.maxLevel ) + 1
	}
	firstChildNode(){
		return this.state.node * this.state.maxBranches
	}
	firstChildIndex(){
		return this.getIndex( this.state.level + 1, this.firstChildNode() )
	}
	lastChildNode(){
		return this.state.node * this.state.maxBranches + (this.state.maxBranches - 1);
	}
	lastChildIndex(){
		return this.getIndex( this.state.level + 1, this.lastChildNode() )
	}
	set node( value ){
		this.set({level:this.state.level, node:this.state.node}, value)

		if(this.state.level > this.state.maxLevel){
			this.setNav({maxLevel: this.state.level})
		}
		this.trim()
		return
	}
	get data(){
		return this.state.data
	}
	get node(){
		return this.get({level:this.state.level, node:this.state.node})
	}
	get nodeItem(){
		let level=this.state.level,
				node=this.state.node,
				index = this.getIndex( level, node );
		return this.state.data[index] || undefined
	}
	get nodeAddress(){
		return { __l: this.state.level, __n: this.state.node }
	}
	get root(){
		this.setNav({level: 0, node: 0})
		return this.node
	}
	set root( value ){
		this.root
		this.node = value;
		return this.node
	}
	get rootItem(){
		this.root
		return this.nodeItem
	}
	get parent(){
		return this.get(this.parentAddress)
	}
	get parentAddress(){
		return {
			level: this.state.nav.level - 1,
			node: Math.floor( this.state.node / this.state.maxBranches )
		}
	}
	get parentItem(){
		return this.getNodeItem(this.parentAddress)
	}
	set parent( arg ){
		this.set(this.parentAddress, arg)
		return this.parent
	}
	get children(){
		return this.getChildren('node')
	}
	set children( vals ){
		vals.length = this.state.maxBranches;

		vals.map( ( value, index ) =>{
			this.toNth( index )
			this.node = value
			this.toParent()
		}, this)
	}
	getChildren(prop){
		let children = [];
		for(let i = 0; i< this.state.maxBranches; i++){
			this.toNth( i )
			children.push(this[prop])
			this.toParent()
		}
		return children;
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
	maxNodeIndex( max ){
		return ( this.nodesAtIndexed( max + 1 ) / (this.state.maxBranches - 1) ) - 1;
	}
	makeNode( value ){
		let val = value == undefined? false : value;
		return new RoseTreeNode({ value: value, node: this.state.node, level: this.state.level })
	}
	nodesAt( level ){
		level = level || this.state.level
		return Math.pow( this.state.maxBranches, level )
	}
	nodesAtIndexed( level ){
		level = level || this.state.level;
		return this.nodesAt( level ) - 1
	}
	rootNodeAt( level ){
		level = level || this.state.level
		return this.nodesAtIndexed( level ) / (this.state.maxBranches - 1)
	}
	getIndex(level, node){
		let index = node + this.nodesAtIndexed( level ) / (this.state.maxBranches - 1)
		index = level == 0 && node == 0 ? 0 : index;
		return index
	}
	get({level, node}){
		let index = node + this.nodesAtIndexed( level ) / (this.state.maxBranches - 1)
		index = level == 0 && node == 0 ? 0 : index;
		return this.state.data[index] ? this.state.data[index].value : undefined
	}
	set({level, node}, value){
		let index = node + this.nodesAtIndexed( level ) / (this.state.maxBranches - 1)
		index = level == 0 && node == 0 ? 0 : index;
		let created = this.makeNode(value)
		this.state.data[index] = created
		return created
	}
	getNodeItem({level, node}){
		let index = node + this.nodesAtIndexed( level ) / (this.state.maxBranches - 1)
		index = level == 0 && node == 0 ? 0 : index;
		return this.state.data[index]
	}
	toFirst(){
		let l = this.state.nav.level + 1
		let n = this.firstChildNode()
		this.setNav({level: l, node: n })
	}
	toLast(){
		let l = this.state.nav.level + 1
		let n = this.lastChildNode()
		this.setNav({level: l, node: n })
	}
	toNth( index ){
		let l = this.state.nav.level + 1
		let n = this.firstChildNode() + index
		this.setNav({level: l, node: n })
	}
	toParent(){
		this.setNav(this.parentAddress)
	}
	toParentAtLevel(level=0){
		while(this.state.level > level){
			this.toParent()
		}
	}
	goTo( node, level ){
		let l = level !== undefined ? level : this.state.nav.level;
		let n = node !== undefined ? node : this.state.nav.node;
		this.setNav({level: l, node: n })
	}
	goToNode( node ){
		if( node == undefined ){ return; }
		let l = node.__l,
				n = node.__n;
		this.goTo( n, l )
	}
	preOrderDepth( callback, ctx=this ){
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
	breadthTraverse( callback, ctx, index ){
		let node = this.state.data[index];
		this.goToNode( node )
		if( this.node ){
			callback.call(ctx, this.node, this.state.node, this.state.level)
		}
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
	index(){
		if(this.node !== undefined){
			this.node = this.node;
			for( let i = 0; i< this.state.maxBranches; i++ ){
				this.toNth(i)
				this.index()
				this.toParent()
			}
		}
	}
	trim(){
		if(this.state.depth && this.state.level > this.state.depth){
			this.reRoot();
		}
	}
	reRoot(){
		var level = this.state.level,
				node = this.state.node,
				returnToIndex = 0,
				returned = [];

		this.toParentAtLevel(1);
		this.preOrderBreadth((item, n, l)=>{
			returned.push(this.nodeItem)
			if(l == level && n == node){
				returnToIndex = returned.length -1;
			}
		})
		this.setData( returned )
		this.goToNode( this.state.data[returnToIndex] )
		return
	}
	toJS(retrieved = false ){
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
