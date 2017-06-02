import { expect, assert } from 'chai';
import { RoseTree } from '../../../source/structures/trees'

describe('RoseTree', () => {
	var test, control;
	describe('#new RoseTree', ()=>{
		it('should default to its initial state', ()=>{
			test = new RoseTree()
			expect(test.state.currentIndex).to.equal(0)
			expect(test.state.rootIndex).to.equal(0)
			expect(test.state.parentIndex).to.equal(null)
			expect(test.state.prevIndex).to.equal(null)
			expect(test.data.length).to.equal(0)
			expect(test.__tree).to.equal(test)
		})
		it('should allow overriding its defaults', ()=>{
			test = new RoseTree({
				currentIndex: 3,
				rootIndex: 2,
				prevIndex: 1,
				parentIndex: 1,
				value: 'yes!'
			})
			expect(test.state.currentIndex).to.equal(3)
			expect(test.state.rootIndex).to.equal(2)
			expect(test.state.prevIndex).to.equal(1)
			expect(test.state.parentIndex).to.equal(1)
		})
	})
	describe('#setNav', () => {
		beforeEach(() => {
			test = new RoseTree()
		})
		it('should set the currentIndex', ()=>{
			test.setNav(2)
			expect(test.state.currentIndex).to.equal(2)
		})
		it('should set the prevIndex', () => {
			test.setNav(2, 0)
			expect(test.state.prevIndex).to.equal(0)
			test.setNav(0, 2)
			expect(test.state.prevIndex).to.equal(2)
		})
		it('should default to null when no previous index is given', () => {
			test.setNav(0)
			expect(test.state.prevIndex).to.equal(null)
		})
	})
	describe('#setState', ()=>{
		beforeEach(() => {
			test = new RoseTree()
		})
		it('should allow re-setting of the state', () => {
			test.setState({
				currentIndex: 3,
				rootIndex: 2,
				prevIndex: 1,
				parentIndex: 1,
				value: 'yes!'
			})
			expect(test.state.currentIndex).to.equal(3)
			expect(test.state.rootIndex).to.equal(2)
			expect(test.state.prevIndex).to.equal(1)
			expect(test.state.parentIndex).to.equal(1)
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
	describe('#addChild', () => {
		let tree;
		beforeEach(()=>{
			tree = new RoseTree();
			tree.root = 'root node'
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

	describe('Contextual Navigation', () => {
		let tree;
		beforeEach(() => {
			tree = new RoseTree();
		})
		it('should allow a node to be set', ()=>{
			tree.node = 'test'
			expect(tree.nodeValue).to.equal('test')
			expect(tree.length).to.equal(1)
		})
		it('should mark the node with an internal node and level value', ()=>{
			tree.node = 'test';
			expect(tree.nodeState.rootIndex).to.equal(0)
			expect(tree.nodeState.parentIndex).to.equal(null)
			expect(tree.nodeState.value).to.equal('test')
		})
		it('should allow a root to be set', ()=>{
			tree.root = 'test'
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
		describe('with children', () => {
			it('should allow traversal to the first child')
			it('should allow traversal to the last child')
			it('should allow traversal to an nth child')
			it('should allow traversal to the parent')
			it('should get and set multiple children')
		})
	})

	describe('a structured tree', ()=>{
		let tree;
		it('should allow a 1-dimensional view')
		it('should allow for pre-order depth-first traversal')
		it('should allow for post-order depth-first traversal')
		it('should allow for pre-order breadth-first traversal')
		it('should allow replacement of nodes')
		it('should allow for automatic rerooting when assigning a deep node')
		it('should allow for automatic rerooting when assigning deep children')

		it('should reindex properly')
	})
})
