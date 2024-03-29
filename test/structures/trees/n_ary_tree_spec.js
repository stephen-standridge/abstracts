import { expect, assert } from 'chai';
import { NAryTree } from '../../../source/structures/trees'

describe('NAryTree', () => {
	var test, control;
	describe('#new NAryTree', () => {
		it('should default to its initial state', () => {
			test = new NAryTree()
			expect(test.state.level).to.equal(0)
			expect(test.state.node).to.equal(0)
			expect(test.state.maxLevel).to.equal(0)
			expect(test.state.maxNode).to.equal(0)

			expect(test.state.data.length).to.equal(0)
			expect(test.state.branches).to.equal(2)
			expect(test.state.maxDepth).to.equal(false)
		})
		it('should allow overriding its defaults', () => {
			test = new NAryTree({
				branches: 3,
				maxDepth: 2,
				level: 1,
				node: 1,
				maxLevel: 5,
				maxNode: 3,
			})
			expect(test.state.level).to.equal(1)
			expect(test.state.node).to.equal(1)
			expect(test.state.maxLevel).to.equal(5)
			expect(test.state.maxNode).to.equal(3)
			expect(test.state.branches).to.equal(3)
			expect(test.state.maxDepth).to.equal(2)
		})
	})
	describe('#setNav', () => {
		beforeEach(() => {
			test = new NAryTree()
		})
		it('should set the nav state', () => {
			test.setNav({ level: 2, node: 1 })
			expect(test.state.level).to.equal(2)
			expect(test.state.node).to.equal(1)
		})
	})
	describe('#setState', () => {
		beforeEach(() => {
			test = new NAryTree({ branches: 2 })
		})
		it('should set the ranges', () => {
			test.setState({ maxDepth: 3, branches: 1, maxLevel: 3, maxNode: 4 })
			expect(test.state.maxLevel).to.equal(3)
			expect(test.state.maxDepth).to.equal(3)
			expect(test.state.branches).to.equal(1)
			expect(test.state.maxNode).to.equal(4)
		})
		it('should set the data state', () => {
			test.setData([{ value: true }, { value: true }, { value: true }])
			control = [{ value: true, __l: 0, __n: 0 },
			{ value: true, __l: 1, __n: 0 },
			{ value: true, __l: 1, __n: 1 }];
			expect(test.state.data[0].__l).to.equal(control[0].__l)
			expect(test.state.data[0].__n).to.equal(control[0].__n)
			expect(test.state.data[1].__l).to.equal(control[1].__l)
			expect(test.state.data[1].__n).to.equal(control[1].__n)
			expect(test.state.data[2].__l).to.equal(control[2].__l)
			expect(test.state.data[2].__n).to.equal(control[2].__n)
		})
	})

	describe('#eachChild', () => {
		before(() => {
			test = new NAryTree({ branches: 3, maxDepth: 2 })
		})
		it('should call function for each child', () => {
			control = [];
			test.eachChild((item, index) => {
				control.push(index)
			})
			expect(control).to.have.members([0, 1, 2])
		})
		it('should return an array of returned items', () => {
			control = [];
			control = test.eachChild((item, index) => {
				return index
			})
			expect(control).to.have.members([0, 1, 2])
		})
		it('should be bound to the tree', () => {
			test.test = 'si'
			control = [];
			control = test.eachChild(function (item, index) {
				return this.test
			})
			expect(control).to.have.members(['si', 'si', 'si'])
		})
		it('should have the appropriate children', () => {
			test.setState({ data: [{ value: true }, { value: true }, { value: true }, { value: true }] })
			control = [];
			control = test.eachChild(function (item, index) {
				return item
			})
			expect(control[0]['__l']).to.eq(1)
			expect(control[0]['__n']).to.eq(0)
			expect(control[1]['__l']).to.eq(1)
			expect(control[1]['__n']).to.eq(1)
			expect(control[2]['__l']).to.eq(1)
			expect(control[2]['__n']).to.eq(2)
		})
	})

	describe('Contextual Navigation', () => {
		let tree;
		describe('with two children', () => {
			beforeEach(() => {
				tree = new NAryTree({ branches: 2 });
			})
			it('should allow a node to be set', () => {
				tree.node = 'test'
				expect(tree.node).to.equal('test')
				expect(tree.length).to.equal(1)
			})
			it('should mark the node with an internal node and level value', () => {
				tree.node = 'test';
				expect(tree.nodeItem.__l).to.equal(0)
				expect(tree.nodeItem.__n).to.equal(0)
				expect(tree.nodeItem.value).to.equal('test')
				expect(tree.length).to.equal(1)
			})
			it('should allow a root to be set', () => {
				tree.root = 'test'
				expect(tree.root).to.equal('test')
				expect(tree.rootItem.__l).to.equal(0)
				expect(tree.rootItem.__n).to.equal(0)
				expect(tree.length).to.equal(1)
			})
			it('should allow traversal to the first child', () => {
				tree.toFirst()
				expect(tree.state.node).to.equal(0)
				expect(tree.state.level).to.equal(1)
			})
		})

		describe('with more than 2 branches', () => {
			beforeEach(() => {
				tree = new NAryTree({ branches: 3 });
			})
			it('should allow traversal to the last child', () => {
				tree.toLast()
				expect(tree.state.node).to.equal(2)
				expect(tree.state.level).to.equal(1)
			})
			it('should allow traversal to an nth child', () => {
				tree.toNth(1)
				expect(tree.state.node).to.equal(1)
				expect(tree.state.level).to.equal(1)

				tree.toParent()
				tree.toNth(2)
				expect(tree.state.node).to.equal(2)
				expect(tree.state.level).to.equal(1)
			})

			it('should allow traversal to the parent', () => {
				tree.root = 'test'
				control = { value: 'test', __n: 0, __l: 0 };
				tree.toLast();
				expect(tree.state.node).to.equal(2)
				expect(tree.state.level).to.equal(1)

				tree.toParent()
				expect(tree.node).to.equal('test')
				expect(tree.state.node).to.equal(0)
				expect(tree.state.level).to.equal(0)

				tree.toLast();
				let parent = tree.parentItem;
				expect(parent.__l).to.equal(0)
				expect(parent.__n).to.equal(0)
				expect(parent.value).to.equal('test')
				expect(tree.parent).to.equal('test')
			})
			it('should get and set multiple children', () => {
				tree.children = ['testvalue1', 'testvalue2', 'testvalue3'];
				expect(tree.children[2]).to.equal('testvalue3')
				expect(tree.children[1]).to.equal('testvalue2')
				expect(tree.children[0]).to.equal('testvalue1')
			})
			it('should be able to handle undefined values', () => {
				expect(String(tree.children)).to.equal(String([undefined, undefined, undefined]))
			})
			it('should allow getting the address', () => {
				expect(tree.nodeAddress.__l).to.equal(0)
				expect(tree.nodeAddress.__n).to.equal(0)
				expect(tree.getChildren('nodeAddress')[0].__l).to.equal(1)
				expect(tree.getChildren('nodeAddress')[0].__n).to.equal(0)
				expect(tree.getChildren('nodeAddress')[1].__l).to.equal(1)
				expect(tree.getChildren('nodeAddress')[1].__n).to.equal(1)
				expect(tree.getChildren('nodeAddress')[2].__l).to.equal(1)
				expect(tree.getChildren('nodeAddress')[2].__n).to.equal(2)
			})
		})

	})

	describe('a structured tree', () => {
		let tree;
		beforeEach(() => {
			tree = new NAryTree({ branches: 3, maxDepth: 3 });
			tree.root = 1
			tree.children = [2, 3, 4]
			tree.toNth(0)
			expect(tree.node).to.equal(2)

			tree.children = [5, 6, 7]
			tree.toNth(0)
			tree.children = [14, 15, 16]
			tree.toParent()
			tree.toNth(1)
			tree.children = [17, 18, 19]
			tree.toParent()
			tree.toNth(2)
			tree.children = [20, 21, 22]
			tree.toParent()

			tree.toParent()
			tree.toNth(1)
			expect(tree.node).to.equal(3)

			tree.children = [8, 9, 10]
			tree.toNth(0)
			tree.children = [23, 24, 25]
			tree.toParent()
			tree.toNth(1)
			tree.children = [26, 27, 28]
			tree.toParent()
			tree.toNth(2)
			tree.children = [29, 30, 31]
			tree.toParent()

			tree.toParent()
			tree.toNth(2)
			expect(tree.node).to.equal(4)
			tree.children = [11, 12, 13]
			tree.toNth(0)
			tree.children = [32, 33, 34]
			tree.toParent()
			tree.toNth(1)
			tree.children = [35, 36, 37]
			tree.toParent()
			tree.toNth(2)
			tree.children = [38, 39, 40]
			tree.toParent()

			tree.root
		})
		it('should allow a 1-dimensional view', () => {
			expect(String(tree.toJS('value'))).to.equal(String([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]))
			expect(String(tree.toJS())).to.equal(String([
				{ value: 1, __n: 0, __l: 0 },
				{ value: 2, __n: 0, __l: 1 },
				{ value: 3, __n: 1, __l: 1 },
				{ value: 4, __n: 2, __l: 1 },
				{ value: 5, __n: 0, __l: 2 },
				{ value: 6, __n: 1, __l: 2 },
				{ value: 7, __n: 2, __l: 2 },
				{ value: 8, __n: 3, __l: 2 },
				{ value: 9, __n: 4, __l: 2 },
				{ value: 10, __n: 5, __l: 2 },
				{ value: 11, __n: 6, __l: 2 },
				{ value: 12, __n: 7, __l: 2 },
				{ value: 13, __n: 8, __l: 2 },
				{ value: 14, __n: 0, __l: 3 },
				{ value: 15, __n: 1, __l: 3 },
				{ value: 16, __n: 2, __l: 3 },
				{ value: 17, __n: 3, __l: 3 },
				{ value: 18, __n: 4, __l: 3 },
				{ value: 19, __n: 5, __l: 3 },
				{ value: 20, __n: 6, __l: 3 },
				{ value: 21, __n: 7, __l: 3 },
				{ value: 22, __n: 8, __l: 3 },
				{ value: 23, __n: 9, __l: 3 },
				{ value: 24, __n: 10, __l: 3 },
				{ value: 25, __n: 11, __l: 3 },
				{ value: 26, __n: 12, __l: 3 },
				{ value: 27, __n: 13, __l: 3 },
				{ value: 28, __n: 14, __l: 3 },
				{ value: 29, __n: 15, __l: 3 },
				{ value: 30, __n: 16, __l: 3 },
				{ value: 31, __n: 17, __l: 3 },
				{ value: 32, __n: 18, __l: 3 },
				{ value: 33, __n: 19, __l: 3 },
				{ value: 34, __n: 20, __l: 3 },
				{ value: 35, __n: 21, __l: 3 },
				{ value: 36, __n: 22, __l: 3 },
				{ value: 37, __n: 23, __l: 3 },
				{ value: 38, __n: 24, __l: 3 },
				{ value: 39, __n: 25, __l: 3 },
				{ value: 40, __n: 26, __l: 3 }
			]))
		})
		it('should allow for pre-order depth-first traversal', () => {
			let testArray = [],
				callback = function (value, node, item) {
					testArray.push(this.node)
				}.bind(tree)
			tree.preOrderDepth(callback)
			expect(String(testArray)).to.equal(String([1, 2, 5, 14, 15, 16, 6, 17, 18, 19, 7, 20, 21, 22, 3, 8, 23, 24, 25, 9, 26, 27, 28, 10, 29, 30, 31, 4, 11, 32, 33, 34, 12, 35, 36, 37, 13, 38, 39, 40]))
		})
		it('should allow for post-order depth-first traversal', () => {
			let testArray = [],
				callback = function (value, node, item) {
					testArray.push(this.node)
				}.bind(tree)
			tree.postOrderDepth(callback)
			expect(String(testArray)).to.equal(String([14, 15, 16, 5, 17, 18, 19, 6, 20, 21, 22, 7, 2, 23, 24, 25, 8, 26, 27, 28, 9, 29, 30, 31, 10, 3, 32, 33, 34, 11, 35, 36, 37, 12, 38, 39, 40, 13, 4, 1]))
		})
		it('should allow for pre-order breadth-first traversal', () => {
			let testArray = [],
				callback = function (value, node, item) {
					testArray.push(this.node)
				}.bind(tree)

			tree.preOrderBreadth(callback)
			expect(String(testArray)).to.equal(String([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]))
		})
		it('should allow replacement of nodes', () => {
			tree.toFirst();
			tree.children = [false, false, false]
			expect(String(tree.toJS('value'))).to.equal(String([1, 2, 3, 4, false, false, false, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]))
		})
		it('should allow for automatic rerooting when assigning a deep node', () => {
			tree.toLast()
			tree.toLast()
			expect(tree.node).to.equal(13)
			expect(tree.state.node).to.equal(8)
			expect(tree.state.level).to.equal(2)
			tree.toLast()
			tree.toLast()
			tree.node = 'test'

			// expect(tree.node).to.equal('test')
			// expect(tree.state.node).to.equal(8)
			// expect(tree.state.level).to.equal(2)
			expect(String(tree.toJS('value'))).to.equal(String([4, 11, 12, 13, 32, 33, 34, 35, 36, 37, 38, 39, 40, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'test']))
		})
		it('should allow for automatic rerooting when assigning deep children', () => {
			tree.toLast()
			tree.toFirst()
			tree.toFirst()
			expect(tree.node).to.equal(32)
			expect(tree.state.node).to.equal(18)
			expect(tree.state.level).to.equal(3)
			tree.children = ['test1', 'test2', 'test3']

			// expect(tree.node).to.equal(11)
			// expect(tree.state.node).to.equal(0)
			// expect(tree.state.level).to.equal(1)
			expect(String(tree.toJS('value'))).to.equal(String([4, 11, 12, 13, 32, 33, 34, 35, 36, 37, 38, 39, 40, 'test1', 'test2', 'test3']))
		})

		it('should reindex properly', () => {
			tree.state.data = tree.state.data.reverse()
			expect(String(tree.toJS('value'))).to.equal(String([40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]))
			tree.reIndex();
			control = [
				{ value: 40, __n: 0, __l: 0 },
				{ value: 39, __n: 0, __l: 1 },
				{ value: 38, __n: 1, __l: 1 },
				{ value: 37, __n: 2, __l: 1 },
				{ value: 36, __n: 0, __l: 2 },
				{ value: 35, __n: 1, __l: 2 },
				{ value: 34, __n: 2, __l: 2 },
				{ value: 33, __n: 3, __l: 2 },
				{ value: 32, __n: 4, __l: 2 },
				{ value: 31, __n: 5, __l: 2 },
				{ value: 30, __n: 6, __l: 2 },
				{ value: 29, __n: 7, __l: 2 },
				{ value: 28, __n: 8, __l: 2 },
				{ value: 27, __n: 0, __l: 3 },
				{ value: 26, __n: 1, __l: 3 },
				{ value: 25, __n: 2, __l: 3 },
				{ value: 24, __n: 3, __l: 3 },
				{ value: 23, __n: 4, __l: 3 },
				{ value: 22, __n: 5, __l: 3 },
				{ value: 21, __n: 6, __l: 3 },
				{ value: 20, __n: 7, __l: 3 },
				{ value: 19, __n: 8, __l: 3 },
				{ value: 18, __n: 9, __l: 3 },
				{ value: 17, __n: 10, __l: 3 },
				{ value: 16, __n: 11, __l: 3 },
				{ value: 15, __n: 12, __l: 3 },
				{ value: 14, __n: 13, __l: 3 },
				{ value: 13, __n: 14, __l: 3 },
				{ value: 12, __n: 15, __l: 3 },
				{ value: 11, __n: 16, __l: 3 },
				{ value: 10, __n: 17, __l: 3 },
				{ value: 9, __n: 18, __l: 3 },
				{ value: 8, __n: 19, __l: 3 },
				{ value: 7, __n: 20, __l: 3 },
				{ value: 6, __n: 21, __l: 3 },
				{ value: 5, __n: 22, __l: 3 },
				{ value: 4, __n: 23, __l: 3 },
				{ value: 3, __n: 24, __l: 3 },
				{ value: 2, __n: 25, __l: 3 },
				{ value: 1, __n: 26, __l: 3 }
			];
			tree.state.data.map(function (item, index) {
				expect(item.value).to.equal(control[index].value)
				expect(item.__l).to.equal(control[index].__l)
				expect(item.__n).to.equal(control[index].__n)
			})
		})
	})
})
