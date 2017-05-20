import guid from '../../generators/guid';
import TreeNode from './nodes/tree_node';

class Tree {
	constructor( args={} ){
		this.state = this.initialState()
		this.setState( args )
		this.__id = guid()
	}
	initialState(){
		return {
			data: [],
			config: {
				branches: 2,
				depth: false
			},
			nav: {
				level: 0,
				node: 0,
				maxLevel: 0
			}
		};
	}
	setState(state){
		if (state.config){ this.setConfig( state.config ) }
		if (state.data){ this.setData( state.data ) }
		if (state.nav){ this.setNav( state.nav )	}
	}
	setData(newData=[]){
		this.state.data = newData.slice();
		this.root
		this.index()
		return this.state.data
	}
	setConfig(newConfig={}){
		this.state.config = Object.assign(this.state.config, newConfig);
		return this.state.config
	}
	setNav(newNav={}){
		this.state.nav = Object.assign(this.state.nav, newNav)
		return this.state.nav
	}
	flatten(){
		let thing = this.state.data.map((item, index)=> item.value )
		return thing;
	}
	attribute(name) {
		return this.state.config[name] !== undefined ? this.state.config[name] : this.state.nav[name]
	}
	shouldIndexDeeper(){
		return this.getIndex( this.attribute('level'), this.attribute('branches') ) < this.traversed();
	}
	shouldTraverseDeeper(){
		return this.getIndex( this.attribute('level'), this.attribute('branches') ) < this.length;
	}
	get length(){
		return this.maxNodeIndex( this.attribute('depth') ) + 1
	}
	traversed(){
		return this.maxNodeIndex( this.attribute('maxLevel') ) + 1
	}
	firstChildNode(){
		return this.attribute('node') * this.attribute('branches')
	}
	firstChildIndex(){
		return this.getIndex( this.attribute('level') + 1, this.firstChildNode() )
	}
	lastChildNode(){
		return this.attribute('node') * this.attribute('branches') + (this.attribute('branches') - 1);
	}
	lastChildIndex(){
		return this.getIndex( this.attribute('level') + 1, this.lastChildNode() )
	}
	set node( value ){
		this.set({level:this.attribute('level'), node:this.attribute('node')}, value)

		if(this.attribute('level') > this.attribute('maxLevel')){
			this.setNav({maxLevel: this.attribute('level')})
		}
		this.trim()
		return
	}
	get data(){
		return this.state.data
	}
	get node(){
		return this.get({level:this.attribute('level'), node:this.attribute('node')})
	}
	get nodeItem(){
		let level=this.attribute('level'),
				node=this.attribute('node'),
				index = this.getIndex( level, node );
		return this.state.data[index] || undefined
	}
	get nodeAddress(){
		return { __l: this.attribute('level'), __n: this.attribute('node') }
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
			node: Math.floor( this.attribute('node') / this.attribute('branches') )
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
		vals.length = this.attribute('branches');

		vals.map( ( value, index ) =>{
			this.toNth( index )
			this.node = value
			this.toParent()
		}, this)
	}
	getChildren(prop){
		let children = [];
		for(let i = 0; i< this.attribute('branches'); i++){
			this.toNth( i )
			children.push(this[prop])
			this.toParent()
		}
		return children;
	}
	eachChild(block){
		let children = [];
		for(let i = 0; i< this.attribute('branches'); i++){
			this.toNth( i )
			children.push(block.call(this, this.nodeItem, i))
			this.toParent()
		}
		return children;
	}
	maxNodeIndex( max ){
		return ( this.nodesAtIndexed( max + 1 ) / (this.attribute('branches') - 1) ) - 1;
	}
	makeNode( value ){
		let val = value == undefined? false : value;
		return new TreeNode({ value: value, node: this.attribute('node'), level: this.attribute('level') })
	}
	nodesAt( level ){
		level = level || this.attribute('level')
		return Math.pow( this.attribute('branches'), level )
	}
	nodesAtIndexed( level ){
		level = level || this.attribute('level');
		return this.nodesAt( level ) - 1
	}
	rootNodeAt( level ){
		level = level || this.attribute('level')
		return this.nodesAtIndexed( level ) / (this.attribute('branches') - 1)
	}
	getIndex(level, node){
		let index = node + this.nodesAtIndexed( level ) / (this.attribute('branches') - 1)
		index = level == 0 && node == 0 ? 0 : index;
		return index
	}
	get({level, node}){
		let index = node + this.nodesAtIndexed( level ) / (this.attribute('branches') - 1)
		index = level == 0 && node == 0 ? 0 : index;
		return this.state.data[index] ? this.state.data[index].value : undefined
	}
	set({level, node}, value){
		let index = node + this.nodesAtIndexed( level ) / (this.attribute('branches') - 1)
		index = level == 0 && node == 0 ? 0 : index;
		let created = this.makeNode(value)
		this.state.data[index] = created
		return created
	}
	getNodeItem({level, node}){
		let index = node + this.nodesAtIndexed( level ) / (this.attribute('branches') - 1)
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
		while(this.attribute('level') > level){
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
		callback.call(ctx, this.node, this.attribute('node'), this.attribute('level'))
		for( let i = 0; i< this.attribute('branches'); i++ ){
			this.toNth(i)
			if( this.shouldTraverseDeeper() ){
				this.preOrderDepth( callback, ctx )
			}
			this.toParent()
		}
	}
	postOrderDepth( callback, ctx=this ){
		for( let i = 0; i< this.attribute('branches'); i++ ){
			this.toNth(i)
			if( this.shouldTraverseDeeper() ){
				this.postOrderDepth( callback, ctx )
			}
			this.toParent()
		}
		callback.call(ctx, this.node, this.attribute('node'), this.attribute('level'))
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
				callback.call(ctx, this.node, this.attribute('node'), this.attribute('level'))
				q = q.concat(this.getChildren('nodeAddress'))
			}
		}
	}
	breadthTraverse( callback, ctx, index ){
		let node = this.state.data[index];
		this.goToNode( node )
		if( this.node ){
			callback.call(ctx, this.node, this.attribute('node'), this.attribute('level'))
		}
	}
	reIndex(){
		if(this.node !== undefined){
			this.node = this.node;
		}
		if( this.shouldIndexDeeper() ){
			for( let i = 0; i< this.attribute('branches'); i++ ){
				this.toNth(i)
				this.reIndex()
				this.toParent()
			}
		}
	}
	index(){
		if(this.node !== undefined){
			this.node = this.node;
			for( let i = 0; i< this.attribute('branches'); i++ ){
				this.toNth(i)
				this.index()
				this.toParent()
			}
		}
	}
	trim(){
		if(this.attribute('depth') && this.attribute('level') > this.attribute('depth')){
			this.reRoot();
		}
	}
	reRoot(){
		var level = this.attribute('level'),
				node = this.attribute('node'),
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
export { Tree }
