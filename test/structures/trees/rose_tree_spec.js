import { expect, assert } from 'chai';
import { RoseTree } from '../../../source/structures/trees'

describe('RoseTree', () => {
	var control, tree;
	describe('#new RoseTree', ()=>{
		it('should default to its initial state', ()=>{
			tree = new RoseTree()
			expect(tree.state.currentIndex).to.equal(0)
			expect(tree.state.rootIndex).to.equal(0)
			expect(tree.state.parentIndex).to.equal(null)
			expect(tree.state.prevIndex).to.equal(null)
			expect(tree.data.length).to.equal(0)
			expect(tree.__tree).to.equal(tree)
		})
		it('should allow overriding its defaults', ()=>{
			tree = new RoseTree({
				currentIndex: 3,
				rootIndex: 2,
				prevIndex: 1,
				parentIndex: 1,
				value: 'yes!'
			})
			expect(tree.state.currentIndex).to.equal(3)
			expect(tree.state.rootIndex).to.equal(2)
			expect(tree.state.prevIndex).to.equal(1)
			expect(tree.state.parentIndex).to.equal(1)
		})
	})
	describe('#setNav', () => {
		beforeEach(() => {
			tree = new RoseTree()
		})
		it('should set the currentIndex', ()=>{
			tree.setNav(2)
			expect(tree.state.currentIndex).to.equal(2)
		})
		it('should set the prevIndex', () => {
			tree.setNav(2, 0)
			expect(tree.state.prevIndex).to.equal(0)
			tree.setNav(0, 2)
			expect(tree.state.prevIndex).to.equal(2)
		})
		it('should default to null when no previous index is given', () => {
			tree.setNav(0)
			expect(tree.state.prevIndex).to.equal(null)
		})
	})
	describe('#setState', ()=>{
		beforeEach(() => {
			tree = new RoseTree()
		})
		it('should allow re-setting of the state', () => {
			tree.setState({
				currentIndex: 3,
				rootIndex: 2,
				prevIndex: 1,
				parentIndex: 1,
				value: 'yes!'
			})
			expect(tree.state.currentIndex).to.equal(3)
			expect(tree.state.rootIndex).to.equal(2)
			expect(tree.state.prevIndex).to.equal(1)
			expect(tree.state.parentIndex).to.equal(1)
		})
	})
	describe('#setData', () => {
		it('should set the data state')
		it('should initialize the nodes as RoseTreeNodes')
	})

	// describe('#eachChild', ()=>{
	// 	before(()=>{
	// 		test = new RoseTree({ maxBranches: 3, maxDepth: 2 })
	// 	})
	// 	it('should call function for each child', ()=>{
	// 		control = [];
	// 		test.eachChild((item, index)=>{
	// 			control.push(index)
	// 		})
	// 		expect(control).to.have.members([0,1,2])
	// 	})
	// 	it('should return an array of returned items', ()=>{
	// 		control = [];
	// 		control = test.eachChild((item, index)=>{
	// 			return index
	// 		})
	// 		expect(control).to.have.members([0,1,2])
	// 	})
	// 	it('should be bound to the tree', ()=>{
	// 		test.test = 'si'
	// 		control = [];
	// 		control = test.eachChild(function(item, index){
	// 			return this.test
	// 		})
	// 		expect(control).to.have.members(['si', 'si', 'si'])
	// 	})
	// 	it('should have the appropriate children', ()=>{
	// 		test.setState({ data: [ {value:true}, {value: true}, {value: true}, {value: true}] })
	// 		control = [];
	// 		control = test.eachChild(function(item, index){
	// 			return item
	// 		})
	// 		expect(control[0]['__l']).to.eq(1)
	// 		expect(control[0]['__n']).to.eq(0)
	// 		expect(control[1]['__l']).to.eq(1)
	// 		expect(control[1]['__n']).to.eq(1)
	// 		expect(control[2]['__l']).to.eq(1)
	// 		expect(control[2]['__n']).to.eq(2)
	// 	})
	// })

	describe('#remove', () => {
		beforeEach(() => {
			tree = new RoseTree();
			tree.setRoot( 'root node');
			tree.addChild('first child')
			tree.addChild('second child')
			tree.toLast()
			tree.addChild('second child first')
			tree.addChild('second child second')
			tree.toParent()
			tree.toFirst()
			tree.addChild('first child first')
			tree.addChild('first child second')
			tree.toParent();
			expect(tree.length).to.equal(7)
		})
		it('should remove the node at the current index by default', () => {
			tree.toFirst();
			tree.toFirst();
			tree.remove();
			tree.root
			expect(tree.data.filter((d)=>d).length).to.equal(6)
		})
		it('should remove the node from the parents children', () => {
			tree.remove(3)
			expect(tree.data.filter((d)=>d).length).to.equal(6)
			tree.toLast()
			expect(tree.nodeState.children).to.deep.equal([4])
		})
		it('should remove the node at the given index', () => {
			tree.remove(3)
			expect(tree.data.filter((d)=>d).length).to.equal(6)
			tree.toLast()
			expect(tree.getChildren('index')).to.deep.equal([4])
		})
		it('should move to the parent if possible', () => {
			tree.toFirst();
			tree.toFirst();
			tree.remove();
			expect(tree.state.currentIndex).to.equal(1)
		})
		it('should remove all children of the node', () => {
			tree.remove(2)
			expect(tree.data.filter((d) => d).length).to.equal(4)
		})
	})
	describe('#removeChild', () => {
		beforeEach(() => {
			tree = new RoseTree();
			tree.setRoot( 'root node');
			tree.addChild('first child')
			tree.addChild('second child')
			tree.toLast()
			tree.addChild('second child first')
			tree.addChild('second child second')
			tree.toParent()
			tree.toFirst()
			tree.addChild('first child first')
			tree.addChild('first child second')
			tree.toParent();
			expect(tree.length).to.equal(7)
		})
		it('should remove the child at the given index', () => {
			tree.toFirst();
			tree.removeChild(1);
			expect(tree.data.filter((d) => d).length).to.equal(6)
			expect(tree.getChildren('index')).to.deep.equal([5])
		})
		it('should do nothing if no index is given', () => {
			tree.toFirst();
			tree.removeChild();
			expect(tree.data.filter((d) => d).length).to.equal(7)
			expect(tree.getChildren('index')).to.deep.equal([5,6])
		})
		it('should remove all children of the child', () => {
			tree.removeChild(0);
			expect(tree.data.filter((d) => d).length).to.equal(4)
			expect(tree.getChildren('index')).to.deep.equal([2])
		})
	})
	describe('#removeChildren', () => {
		beforeEach(() => {
			tree = new RoseTree();
			tree.setRoot( 'root node');
			tree.addChild('first child')
			tree.addChild('second child')
			tree.toLast()
			tree.addChild('second child first')
			tree.addChild('second child second')
			tree.toParent()
			tree.toFirst()
			tree.addChild('first child first')
			tree.addChild('first child second')
			tree.toFirst()
			tree.addChild('first grandchild first')
			tree.addChild('first grandchild second')
			tree.toParent();
			tree.toParent();
			expect(tree.length).to.equal(9)
		})
		it('should remove all children of the node', () => {
			tree.toFirst()
			tree.toFirst()
			tree.removeChildren()
			expect(tree.data.filter((item) => item).length).to.equal(7);
		})
		it('should remove all children of children', () => {
			tree.toFirst()
			tree.removeChildren()
			expect(tree.data.filter((item) => item).length).to.equal(5);
		})
		it('should not remove other children', () => {
			tree.toFirst()
			tree.removeChildren()
			tree.toParent()
			tree.toLast()
			expect(tree.length).to.equal(3)
			expect(tree.getChildren('index')).to.deep.equal([3, 4])
		})
	})

	describe('#addChild', () => {
		beforeEach(() => {
			tree = new RoseTree();
			tree.setRoot( 'root node');
			tree.addChild('test first child')
		})
		it('should add the child index to the children array', () => {
			expect(tree.rootState.children[0]).to.equal(1)
			expect(tree.rootObject.state.children[0]).to.equal(1)
		})
		it('should not move the current index', () => {
			expect(tree.state.currentIndex).to.equal(0)
		})
		it('should add the child to the end of the data array', () => {
			expect(tree.data[1].nodeValue).to.equal('test first child')
		})
		it('should mark the child with the parent address', () => {
			expect(tree.data[1].nodeState.parentIndex).to.equal(0)
			expect(tree.data[1].nodeState.rootIndex).to.equal(1)
			expect(tree.data[1].nodeState.currentIndex).to.equal(1)
		})
		it('should allow getting the child contextually', () => {
			expect(tree.children).to.deep.equal(['test first child'])
		})
		describe('contextually', () => {
			beforeEach(()=> {
				tree.toNth(0)
				tree.addChild('second child')
			})
			it('should add the child index to the children array', () => {
				expect(tree.nodeState.children[0]).to.equal(2)
				expect(tree.nodeObject.state.children[0]).to.equal(2)
				expect(tree.data.length).to.equal(3)

				expect(tree.rootState.children[0]).to.equal(1)
				expect(tree.rootObject.state.children[0]).to.equal(1)
			})
			it('should not move the current index', () => {
				expect(tree.state.currentIndex).to.equal(1)
			})
			it('should add the child to the end of the data array', () => {
				expect(tree.data[2].nodeValue).to.equal('second child')
			})
			it('should mark the child with the parent address', () => {
				expect(tree.data[2].nodeState.parentIndex).to.equal(1)
				expect(tree.data[2].nodeState.rootIndex).to.equal(2)
				expect(tree.data[2].nodeState.currentIndex).to.equal(2)
			})
			it('should allow getting the child contextually', () => {
				expect(tree.children).to.deep.equal(['second child'])
			})
		})
	})

	describe('#setters', () => {
		beforeEach(() => {
			tree = new RoseTree();
			tree.setRoot( 'root node');
			tree.addChild('first child')
			tree.addChild('second child')
			tree.toLast()
			tree.addChild('second child first')
			tree.addChild('second child second')
			tree.toParent()
			tree.toFirst()
			tree.addChild('first child first')
			tree.addChild('first child second')
			tree.toFirst()
			tree.addChild('first grandchild first')
			tree.addChild('first grandchild second')
			tree.toRoot();
			expect(tree.length).to.equal(9)
		})
		describe('#setRoot', () => {
			beforeEach(()=>{
				tree.toFirst()
				tree.setRoot('new root node')
			})
			it('should set the node value at the root index', () => {
				expect(tree.root).to.equal('new root node')
			})
			it('should not change children', () => {
				expect(tree.rootState.children).to.deep.equal([1,2])
			})
		})

		describe('#setNode', () => {
			beforeEach(()=>{
				tree.toFirst()
				tree.setNode('new first node')
			})
			it('should set the node value at the current index', () => {
				expect(tree.node).to.equal('new first node')
			})
			it('should not change children', () => {
				expect(tree.nodeState.children).to.deep.equal([5,6])
			})
		})

		describe('#setChild', () => {
			it('should set the child at the index to the value', () => {
				tree.setChild(0, 'new first node')
				tree.toNth(0);
				expect(tree.node).to.equal('new first node')
			})
			it('should add nothing if the node does not exist', () => {
				expect(tree.setChild(2, 'new third node')).to.equal(false)
			})
			it('should not change children', () => {
				tree.setChild(0, 'new first node')
				tree.toNth(0);
				expect(tree.nodeState.children).to.deep.equal([5,6])
			})
			it('should not work if no index is given', () => {
				expect(tree.setChild(null, 'new first node')).to.equal(false)
			})
		})

		describe('#setParent', () => {
			describe('with a parent', () => {
				beforeEach(()=>{
					tree.toFirst()
					tree.setParent('new root node')
				})
				it('should set the parent value', () => {
					expect(tree.parent).to.equal('new root node')
					expect(tree.root).to.equal('new root node')
				})

				it('should not change children', () => {
					expect(tree.parentState.children).to.deep.equal([1,2])
					expect(tree.rootState.children).to.deep.equal([1,2])
				})
			})
			describe('without a parent', () => {
				beforeEach(()=>{
					tree.toRoot()
					tree.setParent('new root node')
				})
				it('should add a new item', () => {
					expect(tree.parent).to.equal('new root node')
				})

				it('should add the child to the parent', () => {
					expect(tree.parentState.children).to.deep.equal([0])
				})

				it('should change the root if applicable', () => {
					expect(tree.root).to.equal('new root node')
					expect(tree.rootState.parentIndex).to.equal(null)
					expect(tree.rootState.children).to.deep.equal([0])
				})
			})
		})
	})

	describe('Contextual Navigation', () => {
		beforeEach(() => {
			tree = new RoseTree();
			tree.setRoot( 'root node');
			tree.addChild('first child')
			tree.addChild('second child')
			tree.toLast()
			tree.addChild('second child first')
			tree.addChild('second child second')
			tree.toParent()
			tree.toFirst()
			tree.addChild('first child first')
			tree.addChild('first child second')
			tree.toFirst()
			tree.addChild('first grandchild first')
			tree.addChild('first grandchild second')
			tree.toRoot();
			expect(tree.length).to.equal(9)
		})
		describe('#toNth', () => {
			it('should allow traversal to an nth child', () => {
				tree.toNth(0)
				expect(tree.state.currentIndex).to.equal(1)
				tree.toNth(1)
				expect(tree.state.currentIndex).to.equal(6)
			})
		})
		describe('#toFirst', () => {
			it('should allow traversal to the first child', () => {
				tree.toFirst()
				expect(tree.state.currentIndex).to.equal(1)
				tree.toFirst()
				expect(tree.state.currentIndex).to.equal(5)
			})
		})
		describe('#toLast', () => {
			it('should allow traversal to the last child', () => {
				tree.toLast()
				expect(tree.state.currentIndex).to.equal(2)
			})
		})

		describe('#toParent', () => {
			it('should allow traversal to the parent', () => {
				tree.toFirst()
				tree.toLast()
				tree.toParent()
				expect(tree.state.currentIndex).to.equal(1)
				tree.toParent()
				expect(tree.state.currentIndex).to.equal(0)
			})
			it('should stay at the current node if no parent exists', () => {
				tree.toParent()
				expect(tree.state.currentIndex).to.equal(0)
			})
		})

		describe('#toRoot', () => {
			it('should return to the root index', () => {
				tree.toFirst()
				tree.toFirst();
				tree.toRoot();
				expect(tree.state.currentIndex).to.equal(0)
			})
		})
	})

	describe('Contextual Getters', () => {
		describe('#root', () => {
			beforeEach(() => {
				tree = new RoseTree();
			})
			it('should allow a node to be set', ()=>{
				tree.setNode('test');
				expect(tree.nodeValue).to.equal('test')
				expect(tree.length).to.equal(1)
			})
			it('should mark the node with an internal node and level value', ()=>{
				tree.setNode('test');
				expect(tree.nodeState.rootIndex).to.equal(0)
				expect(tree.nodeState.parentIndex).to.equal(null)
				expect(tree.nodeState.value).to.equal('test')
			})
			it('should allow a root to be set', ()=>{
				tree.setRoot( 'test');
				expect(tree.root).to.equal('test')
				expect(tree.rootState.rootIndex).to.equal(0)
				expect(tree.rootState.parentIndex).to.equal(null)
				expect(tree.rootState.value).to.equal('test')
			})
			it('should set the currentIndex to 0', () => {
				tree.root
				expect(tree.state.currentIndex).to.equal(0)
				expect(tree.node).to.equal(tree.root)
			})
		})
	})
})
