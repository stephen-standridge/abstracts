class Tree extends Array {
	constructor(branchCount, depth){
		super()
		this._branchCount = branchCount;
		this._depth = depth;
		this._level = 0;
		this._node = 0;
	}
	set width( arg ){
		this._branchCount = arg;
	}
	get maxNodes(){
		return this.nodesAtIndexed( this._depth + 1 ) / this.adjCount;
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
				this.deepen(index + 1)
		this[this.locate( level, node ) ] = value
	}	
	get node(){
		let level=this._level, 
				node=this._node,
				index = this.locate( level, node );
		return this[ this.locate( level, node ) ]
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
	get parent(){
		this.toParent()
		return this.node
	}
	set parent( arg ){
		this.toParent()
		this.node = arg;
	}
	get children(){
		let children = this.slice( this.firstChildIndex, this.lastChildIndex + 1 );
				return children
	}
	set children( vals ){
		vals.length = this._branchCount;
		this.deepen( this.lastChildIndex + 1 )	
		vals.map(function( item, index ){
			this[this.firstChildIndex+index] = item
		}, this)
		return this.children
	}	
	deepen( index ){
		if(this.length < index ){
			this.length = index;
		}		
	}
	nodesAt( level= this._level ){
		return Math.pow( this._branchCount, level )
	}
	nodesAtIndexed( level= this._level ){
		return this.nodesAt( level ) - 1 
	}	
	rootNodeAt( level=this._level ){
		return this.nodesAtIndexed( level ) / this.adjCount
	}
	locate( level, node ){
		return node + this.nodesAtIndexed( level ) / this.adjCount 
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
	goTo( node=this._node, level=this._level ){
		this._level = level;
		this._node = node;
		return this.node
	}
	depthTraversalCall( callback ){
		callback( this.node )									
		for( let i = 0; i< this._branchCount; i++ ){
			this.toNth(i)
			if( this.node !== undefined ){
				this.depthTraversalCall(callback)
			}
			this.parent
		}
	}
	depthTraversalSet( value ){
		for( let i = 0; i< this._branchCount; i++ ){
			this.toNth(i)
			if( this.node !== undefined ){
				if( typeof value == 'function'){
					this.node = value()
				} else {
					this.node = value
				}
				this.depthTraversal(value)
			}
			this.parent
		}
	}
	breadthTraversalCall( callback, level= this._level ){
		for( let i = 0, j = this.nodesAt(); i< j; i++ ){
			this.toNode( i )
			callback( this.node );
		}
		if( this.length > this.lastChildIndex + 1 ){
			this._level ++;
			this.breadthTraversal();
		}
	}
	breadthTraversalSet( value, level ){
		this._level = level || this._level
		for( let i = 0, j = this.nodesAt(); i< j; i++ ){
			this.goTo( i, this._level )
				if( typeof value == 'function'){
					this.node = value()
				} else {
					this.node = value
				}
		}
	}	
	breadthTraversalInitialize( func, val, level ){
		this._level = level || this._level
		for( let i = 0, j = this.nodesAt(); i< j; i++ ){
			this.goTo( i, this._level )
				this.node = new func( val )
		}
	}	


}
module.exports = Tree