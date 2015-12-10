import {expect, assert} from 'chai';
import {List, Map, fromJS, is} from 'immutable';
import Tree from '../dist/bundle';
// var Tree = require('../dist/bundle')
console.log(Tree)

describe('tree', ()=>{
	var test, control;
	describe('#new Tree', ()=>{
		it('should default to its initial state', ()=>{
			test = new Tree()
			control = fromJS({
					level: 0,
					node: 0,
					maxLevel: 0					
				});
			expect(is(test._nav, control)).to.equal(true)
			control = fromJS([])
			expect(is(test._data, control)).to.equal(true)
			control = fromJS({
						branches: 2,
						depth: false
					})
			expect(is(test._config, control)).to.equal(true)
		})
		it('should allow overriding its defaults', ()=>{
			test = new Tree({
				config:{
					branches: 3,
					depth: 2
				},
				nav: {
					level: 1,
					node: 1, 
					maxLevel: 5
				}})
			control = fromJS({
					level: 1,
					node: 1,
					maxLevel: 5
				});
			expect(is(test._nav, control) ).to.equal(true)
			control = fromJS({
						branches: 3,
						depth: 2
					});
			expect(is(test._config, control) ).to.equal(true)
		})
		it('should take immutable structures for overrides', ()=>{
			test = new Tree(Map({
				config:Map({
					branches: 3,
					depth: 2
				}),
				nav: Map({
					level: 1,
					node: 1, 
					maxLevel: 5
				})}) )
			control = fromJS({
					level: 1,
					node: 1,
					maxLevel: 5
				});
			expect(is(test._nav, control) ).to.equal(true)
			control = fromJS({
						branches: 3,
						depth: 2
					});
			expect(is(test._config, control) ).to.equal(true)			
		})
	})
	describe('#setNav', ()=>{
		it('should set the nav state', ()=>{
			test = new Tree()
			test.setNav({ level: 2, node: 1, maxLevel: 3})
			control = fromJS({
					level: 2,
					node: 1,
					maxLevel: 3					
				});
			expect(is(test._nav, control) ).to.equal(true)
		})				
	})
	describe('#setDataFromJS', ()=>{
		it('should set the data state', ()=>{
			test = new Tree()
			test.setDataFromJS([{value: true}, {value: true}, {value: true}	])
			control = fromJS([{value: true, __l: 0, __n: 0}, 
								{value: true, __l: 1, __n: 0}, 
								{value: true, __l: 1, __n: 1}]);
			expect(is(test._data, control) ).to.equal(true)
		})	
	})
	describe('#setData', ()=>{
		it('should set the data state', ()=>{
			test = new Tree()
			test.setData(fromJS([{value: true}, {value: true}, {value: true}	]))
			control = fromJS([{value: true, __l: 0, __n: 0}, 
								{value: true, __l: 1, __n: 0}, 
								{value: true, __l: 1, __n: 1}])
			expect(is(test._data, control) ).to.equal(true)
		})	
	})	
	it('should allow a node to be set', ()=>{
		const tree = new Tree()
		tree.node = 'test'
		expect(tree.node).to.equal('test')
		expect(tree.length).to.equal(1)
	})
	it('should mark the node with an internal node and level value', ()=>{
		const tree = new Tree(2);
		control = fromJS({value: 'test', __n: 0, __l: 0});
		tree.node = 'test';
		expect(is( tree.nodeItem, control) ).to.equal(true)
		expect(tree.length).to.equal(1)		
	})	
	it('should allow a root to be set', ()=>{
		const tree = new Tree(2);
		tree.root = 'test'
		control = fromJS({value: 'test', __n: 0, __l: 0});
		expect(tree.root).to.equal('test')
		expect(tree.length).to.equal(1)

		expect(is(tree.rootItem, control)).to.equal(true)		
	})
	it('should allow traversal to the first child', ()=>{
		const tree = new Tree();
		tree.toFirst()
		expect(tree._node).to.equal(0)
		expect(tree._level).to.equal(1)
	})
	it('should allow traversal to the last child', ()=>{
		const tree = new Tree({config:{branches: 3}});
		tree.toLast()
		expect(tree._node).to.equal(2)
		expect(tree._level).to.equal(1)
	})	
	it('should allow traversal to an nth child', ()=>{
		const tree = new Tree({config:{branches: 3}});
		tree.toNth(1)
		expect(tree._node).to.equal(1)
		expect(tree._level).to.equal(1)

		tree.parent
		tree.toNth(2)
		expect(tree._node).to.equal(2)
		expect(tree._level).to.equal(1)		
	})

	it('should allow traversal to the parent', ()=>{
		const tree = new Tree({config:{branches: 3}});
		tree.root = 'test'
		control = fromJS({value: 'test', __n: 0, __l: 0});
		tree.toLast();
		expect(tree._node).to.equal(2)
		expect(tree._level).to.equal(1)

		expect(tree.parent).to.equal('test')
		expect(tree._node).to.equal(0)
		expect(tree._level).to.equal(0)

		tree.toLast();
		expect(is(tree.parentItem, control)).to.equal(true)
	})
	it('should get and set multiple children', ()=>{
		const tree = new Tree({config:{branches: 3}});
		tree.children = ['testvalue1', 'testvalue2', 'testvalue3'];
		expect(tree.children[2]).to.equal('testvalue3')
		expect(tree.children[1]).to.equal('testvalue2')
		expect(tree.children[0]).to.equal('testvalue1')
	})
	it('should be able to handle undefined values', ()=>{
		const tree = new Tree({config:{branches: 3}});
		expect(String(tree.children) ).to.equal(String([undefined, undefined, undefined]))
	})
	describe('a structured tree', ()=>{
	let tree;	
		beforeEach(()=>{
			tree = new Tree({config: {branches: 3,depth: 2}});
			tree.root = 1
			tree.children = [2, 3, 4]
			tree.toNth(0)
			expect(tree.node).to.equal(2)						

			tree.children = [5, 6, 7]
			tree.toParent()
			tree.toNth(1)
			expect(tree.node).to.equal(3)		

			tree.children = [8, 9, 10]
			tree.toParent()
			tree.toNth(2)
			expect(tree.node).to.equal(4)		
			tree.children = [11, 12, 13]

			tree.root
		})
		it('should allow a 1-dimensional view', ()=>{
			expect(String(tree.toJS('value'))).to.equal(String([1,2,3,4,5,6,7,8,9,10,11,12,13]))	
			expect(String(tree.toJS())).to.equal(String([
				{ value:1, __n:0, __l:0 },
				{ value:2, __n:0, __l:1 },
				{ value:3, __n:1, __l:1 },
				{	value:4, __n:2, __l:1 },
				{ value:5, __n:0, __l:2 },
				{ value:6, __n:1, __l:2 },
				{ value:7, __n:2, __l:2 },
				{ value:8, __n:3, __l:2 },
				{ value:9, __n:4, __l:2 },
				{ value:10, __n:5, __l:2 },
				{	value:11, __n:6, __l:2 },
				{ value:12, __n:7, __l:2 },
				{ value:13, __n:8, __l:2 } ]))		
		})
		it('should allow for pre-order depth-first traversal', ()=>{
			let testArray = [],
					callback = function(value, node, item){
						testArray.push( this.node )
					}
					tree.preOrderDepth( callback )
					expect(String(testArray)).to.equal(String([1, 2, 5, 6, 7, 3, 8, 9, 10, 4, 11, 12, 13]))
		})
		it('should allow for post-order depth-first traversal', ()=>{
			let testArray = [],
					callback = function(value, node, item){
						testArray.push( this.node )
					}
					tree.postOrderDepth( callback )
					expect(String(testArray)).to.equal(String([5,6,7,2,8,9,10,3,11,12,13,4,1]))
		})		
		it('should allow for pre-order breadth-first traversal', ()=>{
			let testArray = [],
					callback = function(value, node, item){
						testArray.push( this.node )
					}

					tree.preOrderBreadth( callback )
					expect(String(testArray)).to.equal(String([1,2,3,4,5,6,7,8,9,10,11,12,13]))
		})
		it('should allow for post-order breadth-first traversal', ()=>{
			let testArray = [],

					callback = function(value, node, level){
						testArray.push( value )
					}

					tree.postOrderBreadth( callback )
					expect(String(testArray)).to.equal(String([13,12,11,10,9,8,7,6,5,4,3,2,1]))
		})
		it('should allow replacement of nodes', ()=>{
			tree.toFirst();
			tree.children = [false, false, false]
			expect(String(tree.toJS('value'))).to.equal(String([1,2,3,4,false,false,false,8,9,10,11,12,13]))	
		})	
		it('should allow for automatic rerooting when assigning a deep node', ()=>{
			tree.toLast()
			tree.toLast()
			expect(tree.node).to.equal(13)
			expect(tree._node).to.equal(8)
			expect(tree._level).to.equal(2)
			tree.toLast()
			tree.node = 'test'

			expect(tree.node).to.equal('test')			
			expect(tree._node).to.equal(8)			
			expect(tree._level).to.equal(2)
			expect(String(tree.toJS('value')) ).to.equal(String([4,11,12,13,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'test']))	
		})
		it('should allow for automatic rerooting when assigning deep children', ()=>{
			tree.toLast()
			tree.toFirst()
			expect(tree.node).to.equal(11)
			expect(tree._node).to.equal(6)
			expect(tree._level).to.equal(2)
			tree.children = ['test1', 'test2', 'test3']

			expect(tree.node).to.equal(11)			
			expect(tree._node).to.equal(0)			
			expect(tree._level).to.equal(1)
			expect(String(tree.toJS('value')) ).to.equal(String([4,11,12,13,'test1','test2','test3',undefined,undefined,undefined,undefined,undefined,undefined])) })

		it('should reindex properly', ()=>{
			tree._data = tree._data.reverse()
			expect( String(tree.toJS('value')) ).to.equal( String([13,12,11,10,9,8,7,6,5,4,3,2,1]) )
			tree.reIndex();
			control = fromJS([
				{ value:13, __n:0, __l:0 },
				{ value:12, __n:0, __l:1 },
				{ value:11, __n:1, __l:1 },
				{	value:10, __n:2, __l:1 },
				{ value:9, __n:0, __l:2 },
				{ value:8, __n:1, __l:2 },
				{ value:7, __n:2, __l:2 },
				{ value:6, __n:3, __l:2 },
				{ value:5, __n:4, __l:2 },
				{ value:4, __n:5, __l:2 },
				{	value:3, __n:6, __l:2 },
				{ value:2, __n:7, __l:2 },
				{ value:1, __n:8, __l:2 } ]);
			expect(is(tree._data, control) ).to.equal(true)		
		})	
	})

})