import {Map, List, fromJS} from 'immutable';
import {initialData, initialNav, initialConfig} from './defaults'
// var Immutable = require('immutable'),
// 		Map = Immutable.Map,
// 		List = Immutable.List,
// 		fromJS = Immutable.fromJS;

// var Defaults = require('./defaults'),
// 		initialData = Defaults.initialData,
// 		initialNav = Defaults.initialNav,
// 		initialConfig = Defaults.initialConfig;

class Tree{
	constructor( args={} ){
		this._config = initialConfig;
		this._data = initialData;
		this._nav = initialNav;
		this.setConfig( args.config )		
		this.setDataFromJS( args.data )
		this.setNav( args.nav )
	}
	setDataFromJS( newData={}, data=this._data ){
		newData = fromJS( newData )
		this.setData( newData, data )
	}
	setData(newData, data=this._data){
		data = data.merge(newData)
		this._data = data
		if(newData.size){
			this.root
			this.index()
		}	
		return data	
	}	
	setConfig( newConfig={}, config=this._config){
		config = config.merge(newConfig)
		this._config = config
		return config
	}
	setNav( newNav={}, nav=this._nav ){
		nav = nav.merge( newNav );
		this._nav = nav;
		return nav
	}
	flatten(){
		let thing = this._data.map((item, index)=>{
			return item.get('value')
		})
		return thing;
	}	
	flattenItem(){
		return this._data
	}
	get branches(){
		return this._config.get('branches')
	}
	get depth(){
		return this._config.get('depth')
	}
	get shouldIndexDeeper(){
		return this.getIndex( this._level, this.branches ) < this.traversed;
	}
	get shouldTraverseDeeper(){
		return this.getIndex( this._level, this.branches ) < this.length;		
	}
	get _node(){
		return this._nav.get('node')
	}
	get _level(){
		return this._nav.get('level')
	}	
	get maxLevel(){
		return this._nav.get('maxLevel')
	}
	get length(){
		return this.maxNodeIndex( this.depth ) + 1
	}
	get traversed(){
		return this.maxNodeIndex( this.maxLevel ) + 1
	}
	get adjCount(){
		return this.branches - 1
	}
	get firstChildNode(){
		return this._node * this.branches
	}
	get firstChildIndex(){
		return this.locate( this._level + 1, this.firstChildNode )
	}
	get lastChildNode(){
		return this._node * this.branches + this.adjCount;
	}	
	get lastChildIndex(){
		return this.locate( this._level + 1, this.lastChildNode )
	}	
	set node( value ){
		let level=this._level, 
				node=this._node,
				index = this.locate( level, node );
				this._data = this._data.set( index, this.makeNode(value) )
				if(this._level > this.maxLevel){
					this.setNav({maxLevel: this._level})
				}
				this.trim()	
				return
	}	
	get node(){
		let level=this._level, 
				node=this._node,

				index = this.locate( level, node ),
				value = this._data.getIn( [index, 'value'] );
		return  value;
	}
	get nodeItem(){
		let level=this._level, 
				node=this._node,
				index = this.locate( level, node );
		return this._data.get( index ) || undefined
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
		this.toParent()
		return this.node
	}
	get parentItem(){
		this.toParent()
		return this.nodeItem
	}	
	set parent( arg ){
		this.toParent()
		this.node = arg;
	}	
	get children(){
		return this.childrenList.toJS()
	}
	get childrenList(){
		let children = List();
		for(let i = 0; i< this.branches; i++){
			this.toNth( i )
			children = children.push(this.node)
			this.toParent()
		}
		return children;		
	}
	get childrenItems(){
		let children = List();
		for(let i = 0; i< this.branches; i++){
			this.toNth( i )
			children = children.push(this.nodeItem)
			this.toParent()
		}
		return children;		
	}
	set children( vals ){
		
		if(vals.size){
			vals.size = this.branches;
		}else{
			vals.length = this.branches;
		}

		vals.map( ( value, index ) =>{
			this.toNth( index )
			this.node = value
			this.parent
		}, this)
	}	
	maxNodeIndex( max ){
		return ( this.nodesAtIndexed( max + 1 ) / this.adjCount ) - 1;
	}	
	makeNode( value, n=this._node, l=this._level ){
		let val = value == undefined? false : value;
		return Map({
			value: value,
			__n: n,
			__l: l
		})
	}
	nodesAt( level ){
		level = level || this._level
		return Math.pow( this.branches, level )
	}
	nodesAtIndexed( level ){
		level = level || this._level;
		return this.nodesAt( level ) - 1 
	}	
	rootNodeAt( level ){
		level = level || this._level
		return this.nodesAtIndexed( level ) / this.adjCount
	}
	getIndex(level, node){
		let index = node + this.nodesAtIndexed( level ) / this.adjCount 
		return index
	}
	locate( level, node ){
		let index = this.getIndex(level, node)
				return index
	}
	toFirst(){
		let l = this._nav.get('level') + 1
		let n = this.firstChildNode
		this.setNav({level: l, node: n })
	}	
	toLast(){
		let l = this._nav.get('level') + 1
		let n = this.lastChildNode
		this.setNav({level: l, node: n })		
	}
	toNth( index ){
		let l = this._nav.get('level') + 1
		let n = this.firstChildNode + index
		this.setNav({level: l, node: n })
	}
	toParent(){
		let l = this._nav.get('level') - 1
		let n = Math.floor( this._node / this.branches )
		this.setNav({level: l, node: n })
	}
	toParentAtLevel(level=0){
		while(this._level > level){
			this.toParent()
		}
	}
	goTo( node, level ){
		let l = level !== undefined ? level : this._nav.get('level');
		let n = node !== undefined ? node : this._nav.get('node');
		this.setNav({level: l, node: n })
	}		
	goToNode( node ){
		if( node == undefined ){ return; }
		let l = node.get('__l'),
				n = node.get('__n');
		this.goTo( n, l )
	}
	preOrderDepth( callback, ctx=this ){
		callback.call(ctx, this.node, this._node, this._level)			
		for( let i = 0; i< this.branches; i++ ){
			this.toNth(i)
			if( this.shouldTraverseDeeper ){
				this.preOrderDepth( callback, ctx )
			}
			this.parent
		}		
	}	
	postOrderDepth( callback, ctx=this ){
			for( let i = 0; i< this.branches; i++ ){
				this.toNth(i)
				if( this.shouldTraverseDeeper ){
					this.postOrderDepth( callback, ctx )					
				}
				this.parent
			}
		callback.call(ctx, this.node, this._node, this._level)	
	}
	preOrderBreadth( callback, ctx=this, index=0 ){
		if( index < this.traversed ){
			this.breadthTraverse( callback, ctx, index )
			this.preOrderBreadth( callback, ctx, index + 1 )		
		}
	}	
	postOrderBreadth( callback, ctx=this, index=0 ){
		if( index < this.traversed ){
			this.postOrderBreadth( callback, ctx, index + 1 )
			this.breadthTraverse( callback, ctx, index )
		}
	}
	breadthTraverse( callback, ctx, index ){
		let node = this._data.get(index);		
		this.goToNode( node )
		if( this.node ){
			callback.call(ctx, this.node, this._node, this._level)			
		}	
	}
	reIndex(){
		if(this.node !== undefined){
			this.node = this.node;
		}
		if( this.shouldIndexDeeper ){			
			for( let i = 0; i< this.branches; i++ ){
				this.toNth(i)
				this.reIndex()
				this.parent
			}
		}
	}
	index(){
		if(this.node !== undefined){
			this.node = this.node;
			for( let i = 0; i< this.branches; i++ ){
				this.toNth(i)
				this.index()
				this.parent
			}
		}
	}	
	trim(){
		if(this.depth && this._level > this.depth){
			this.reRoot();
		}		
	}	
	reRoot(){
		var level = this._level, 
				node = this._node, 
				returnToIndex = 0,
				returned = List();

		this.toParentAtLevel(1);
		returned = returned.push(this.nodeItem)

		this.preOrderDepth(( val )=>{
			this.childrenItems.forEach((item)=>{
				returned = returned.push(item)
				if(item && item.get('__l') == level && item.get('__n') == node){
					returnToIndex = returned.size -1;
				}		
			})	
		})

		this._data = this._data.clear()
		this.setData( returned )
		this.goToNode( this._data.get(returnToIndex) )
		return 
	}
	toJS(retrieved = false ){
		let returned = List();
		this._data.forEach((item)=> {
			if( retrieved && item ){ 
				returned = returned.push(item.get(retrieved));
			}else{
				returned = returned.push(item);
			}
		})
		return returned.toJS();
	}
}
export default Tree;