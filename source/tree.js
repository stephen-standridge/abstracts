import {Map, List, fromJS} from 'immutable';

class Tree{
	constructor( args={} ){
		this.state = this.initialState()
		this.setState( args )
	}
	initialState(){
		return Map({
			data: List(),
			config: Map({
				branches: 2,
				depth: false
			}),
			nav: Map({
				level: 0,
				node: 0,
				maxLevel: 0			
			})	
		});
	}
	setState( state ){
		if(state.config){
			this.setConfig( state.config )	
		}	else if( state.get && state.get('config') ){
			this.setConfig( state.get('config') )	
		}

		if(state.data){
			this.setDataFromJS( state.data )			
		}	else if( state.get && state.get('data') ){
			this.setData(state.get('data'))
		}

		if(state.nav){
			this.setNav( state.nav )	
		}	else if( state.get && state.get('nav') ){
			this.setNav( state.get('nav') )	
		}		
	}
	setDataFromJS( newData={}, data=this.state.get('data') ){
		newData = fromJS( newData )
		this.setData( newData, data )
	}
	setData(newData, data=this.state.get('data')){
		data = data.merge(newData)
		this.state = this.state.set('data', data)
		if(newData.size){
			this.root
			this.index()
		}	
		return this.state.get('data')
	}	
	setConfig( newConfig={}, config=this.state.get('config')){
		config = config.merge(newConfig)
		this.state = this.state.set('config', config)
		return this.state.get('config')
	}
	setNav( newNav={}, nav=this.state.get('nav') ){
		nav = nav.merge( newNav );
		this.state = this.state.set('nav', nav)
		return this.state.get('nav')
	}
	flatten(){
		let thing = this.state.get('data').map((item, index)=>{
			return item.get('value')
		})
		return thing;
	}	
	flattenItem(){
		return this.state.get('data')
	}
	get branches(){
		return this.state.getIn(['config','branches'])
	}
	get depth(){
		return this.state.getIn(['config','depth'])
	}
	get shouldIndexDeeper(){
		return this.getIndex( this._level, this.branches ) < this.traversed;
	}
	get shouldTraverseDeeper(){
		return this.getIndex( this._level, this.branches ) < this.length;		
	}
	get _node(){
		return this.state.getIn(['nav', 'node'])
	}
	get _level(){
		return this.state.getIn(['nav', 'level'])
	}	
	get maxLevel(){
		return this.state.getIn(['nav', 'maxLevel'])
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
				this.state = this.state.setIn( ['data', index], this.makeNode(value) )
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
				value = this.state.getIn( ['data', index, 'value'] );
		return  value;
	}
	get nodeItem(){
		let level=this._level, 
				node=this._node,
				index = this.locate( level, node );
		return this.state.getIn( ['data', index] ) || undefined
	}	
	get nodeAddress(){
		return fromJS({__l: this._level, __n: this._node})
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
		return this._children('node')
	}
	get childrenItems(){
		return this._children('nodeItem')	
	}
	get childrenAddresses(){
		return this._children('nodeAddress')
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
	_children(prop){
		let children = List();
		for(let i = 0; i< this.branches; i++){
			this.toNth( i )
			children = children.push(this[prop])
			this.toParent()
		}
		return children;		
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
		let l = this.state.getIn(['nav', 'level']) + 1
		let n = this.firstChildNode
		this.setNav({level: l, node: n })
	}	
	toLast(){
		let l = this.state.getIn(['nav', 'level']) + 1
		let n = this.lastChildNode
		this.setNav({level: l, node: n })		
	}
	toNth( index ){
		let l = this.state.getIn(['nav', 'level']) + 1
		let n = this.firstChildNode + index
		this.setNav({level: l, node: n })
	}
	toParent(){
		let l = this.state.getIn(['nav', 'level']) - 1
		let n = Math.floor( this._node / this.branches )
		this.setNav({level: l, node: n })
	}
	toParentAtLevel(level=0){
		while(this._level > level){
			this.toParent()
		}
	}
	goTo( node, level ){
		let l = level !== undefined ? level : this.state.getIn(['nav', 'level']);
		let n = node !== undefined ? node : this.state.getIn(['nav', 'node']);
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
	preOrderBreadth(callback, ctx=this){
		var q = List(), current, count=0;
				if( !this.node ){ return }
				q = q.push(this.nodeAddress)

				while( q.size > 0){
					current = q.first();
					q = q.shift();
					if( this.getIndex(current.get('__l'), current.get('__n')) < this.state.get('data').size ){ 
						this.goToNode(current)					
						callback.call(ctx, this.node, this._node, this._level)					
						q = q.concat(this.childrenAddresses)
					}
				}
	}	
	breadthTraverse( callback, ctx, index ){
		let node = this.state.getIn(['data', index]);		
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
		this.preOrderBreadth((item, n, l)=>{
			returned = returned.push(this.nodeItem)
			if(l == level && n == node){
				returnToIndex = returned.size -1;
			}		
		})
		this.state = this.state.set('data', this.state.get('data').clear())
		this.setData( returned )
		this.goToNode( this.state.getIn(['data', returnToIndex]) )
		return 
	}
	toJS(retrieved = false ){
		let returned = List();
		this.state.get('data').forEach((item)=> {
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