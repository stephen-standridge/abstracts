import {List, Map} from 'immutable';
class Tree{
	constructor(branchCount, depth){
		if(!branchCount){
			throw new Error('must specify branch count')
		}
		this._branchCount = branchCount;
		this._depth = depth;
		this._level = 0;
		this._node = 0;
		this._maxLevel = 0;
		this._store = List();
	}
	get length(){
		return this._store.size
	}
	set width( arg ){
		this._branchCount = arg;
	}
	get maxNodeIndex(){
		let depth = this._depth || this._maxLevel;
		return ( this.nodesAtIndexed( depth + 1 ) / this.adjCount ) - 1;
	}
	get adjCount(){
		return this._branchCount - 1
	}
	get firstChildNode(){
		return this._node * this._branchCount
	}
	get firstChildIndex(){
		return this.locate( this._level + 1, this.firstChildNode )
	}
	get lastChildNode(){
		return this._node * this._branchCount + this.adjCount;
	}	
	get lastChildIndex(){
		return this.locate( this._level + 1, this.lastChildNode )
	}	
	set node( value ){
		let level=this._level, 
				node=this._node,
				index = this.locate( level, node );
				this._store = this._store.set( index, this.makeNode(value) )
				if(this._level > this._maxLevel){
					this._maxLevel = this._level;
				}
				return
	}	
	get node(){
		let level=this._level, 
				node=this._node,
				index = this.locate( level, node );
		return this._store.getIn( [index, 'value'] ) || false
	}
	get nodeItem(){
		let level=this._level, 
				node=this._node,
				index = this.locate( level, node );
		return this._store.get( index ) || false
	}	
	get root(){
		this._level = 0;
		this._node = 0;
		return this.node
	}
	set root( value ){
		this._level = 0;
		this._node = 0;
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
		let children = this._store.slice( this.firstChildIndex, this.lastChildIndex + 1 ),
		returned = List();
		children.map((item, index)=>{
			returned = returned.push(item.get('value'))
		});
		return returned.toJS();
	}
	get childrenItems(){
		let children = this._store.slice( this.firstChildIndex, this.lastChildIndex + 1 );
				return children
	}
	set children( vals ){
		vals.length = this._branchCount;

		vals.map( ( value, index ) =>{
			this.toNth( index )
			this.node = value
			this.parent
		}, this)
	}	
	makeNode( value=false, n=this._node, l=this._level ){
		return Map({
			value: value,
			__n: n,
			__l: l
		})
	}
	nodesAt( level ){
		level = level || this._level
		return Math.pow( this._branchCount, level )
	}
	nodesAtIndexed( level ){
		level = level || this._level;
		return this.nodesAt( level ) - 1 
	}	
	rootNodeAt( level ){
		level = level || this._level
		return this.nodesAtIndexed( level ) / this.adjCount
	}
	locate( level, node ){
		let index = node + this.nodesAtIndexed( level ) / this.adjCount 
				return index
	}
	toFirst(){
		this._level ++;
		this._node = this.firstChildNode;
	}	
	toLast(){
		this._level ++;
		this._node = this.lastChildNode; 
	}
	toNth( index ){
		this._level ++
		this._node = this.firstChildNode + index;
		return this.node
	}
	toParent(){
		this._level --;
		this._node = Math.floor( this._node / this._branchCount );
	}
	goTo( node, level ){
		this._level = level !== undefined ? level : this._level;
		this._node = node !== undefined ? node : this._node;
		return this.nodeItem
	}
	preOrderDepth( callback, ctx=this ){
		let node = this.nodeItem;
		callback.call(ctx, node.get('value'), this._node, this._level)			
		for( let i = 0; i< this._branchCount; i++ ){
			this.toNth(i)
			if( this.node ){
				this.preOrderDepth( callback, ctx )
			}
			this.parent
		}		
	}
	postOrderDepth( callback, ctx=this ){
		let node = this.nodeItem;
			for( let i = 0; i< this._branchCount; i++ ){
				this.toNth(i)
				if(this.node){
					this.postOrderDepth( callback, ctx )					
				}
				this.parent
			}		
		callback.call(ctx, node.get('value'), this._node, this._level)	
	}
	preOrderBreadth( callback, ctx=this, index=0 ){
		let node = this._store.get(index), 
				value = node.get('value'),
				l = node.get('__l'),
				n = node.get('__n');

				this.goTo(n, l)	
				callback.call(ctx, value, this._node, this._level)	

				if( index < this.maxNodeIndex ){				
					this.preOrderBreadth( callback, ctx, index + 1 )
				}
	}
	postOrderBreadth( callback, ctx=this, index=0 ){
		let node = this._store.get(index), 
				value = node.get('value'),
				l = node.get('__l'),
				n = node.get('__n');

				if( index < this.maxNodeIndex ){
					this.postOrderBreadth( callback, ctx, index + 1 )
				}
				this.goTo(n, l)									
				callback.call(ctx, value, this._node, this._level)				
	}
	reIndex(){
		if( this.node ){
			this.node = this.node;
			for( let i = 0; i< this._branchCount; i++ ){
				this.toNth(i)
				if( this.node !== false ){
					this.reIndex()
				}
				this.parent
			}
		}
	}
	toJS(retrieved){
		let returned = List();
		this._store.forEach((item)=> {
			if(retrieved){ 
				returned = returned.push(item.get('value')) 
			}
			else{ 
				returned = returned.push(item)
			}
		})
		return returned.toJS();
	}
}
export default Tree