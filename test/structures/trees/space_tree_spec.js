import { expect, assert } from 'chai';
import { SpaceTree } from '../../../source/structures/trees'
import { BoundingBox, BoundingSphere } from '../../../source/space/bounds'

describe('SpaceTree', () => {
	let space_tree, control, min = [0, 40, 0], max = [40, 0, 40], nodes;
	describe('#new SpaceTree', () => {
		before(function () {
			space_tree = new SpaceTree({ region: [min, max], minSize: 5 })
		})
		it('should create a bounding box with the given dimensions', () => {
			expect(space_tree.node.constructor).to.equal(BoundingBox)
			expect(space_tree.node.max).to.have.members([40, 40, 40])
			expect(space_tree.node.min).to.have.members([0, 0, 0])
		})
		it('should have traversal properties', () => {
			expect(space_tree.node.constructor).to.equal(BoundingBox)
			expect(space_tree.nodeItem.__l).to.equal(0)
			expect(space_tree.nodeItem.__n).to.equal(0)
		})
		it('should have leaf/branch data', () => {
			expect(space_tree.node.constructor).to.equal(BoundingBox)
			expect(space_tree.nodeItem.leaf).to.equal(true)
			expect(space_tree.nodeItem.branch).to.equal(false)
		})
	})
	describe('#insert', () => {
		beforeEach(() => {
			space_tree = new SpaceTree({ region: [min, max], minSize: 20 })
		})
		it('should return false when not inserted', () => {
			const inserted = space_tree.insert([51, 52, 53]);
			console.log(space_tree.data[0].objects)
			expect(inserted).to.equal(false)
		})
		it('should insert the item as far down the tree as possible', () => {
			space_tree = new SpaceTree({ region: [min, max], minSize: 10 })
			space_tree.insert([8, 38, 38])
			expect(space_tree.data.length).to.equal(73)
			space_tree.toNth(7)
			nodes = space_tree.children.filter((item) => item !== undefined)
			expect(nodes.length).to.equal(1)

			space_tree.toNth(7)

			expect(space_tree.nodeItem.objects.length).to.equal(1)
			expect(space_tree.node.constructor).to.equal(BoundingBox)
		})
		it('should handle objects with a bounds', () => {
			let item = new BoundingSphere([8, 38, 38], 1)
			space_tree = new SpaceTree({ region: [min, max], minSize: 10 })
			space_tree.insert(item)
			expect(space_tree.data.length).to.equal(73)

			space_tree.toNth(7)
			nodes = space_tree.children.filter((item) => item !== undefined)
			expect(nodes.length).to.equal(1)

			space_tree.toNth(7)
			expect(space_tree.nodeItem.objects.length).to.equal(1)
		})
		it('should handle objects that are not entirely contained', () => {
			let item = new BoundingSphere([8, 33, 33], 6)
			space_tree = new SpaceTree({ region: [min, max], minSize: 10 })
			space_tree.insert(item)
			expect(space_tree.data.length).to.equal(73)
			space_tree.toNth(7)
			space_tree.toNth(7)
			expect(space_tree.nodeItem.objects.length).to.equal(1)
		})
		it('should handle an insertion method', () => {
			let item = new BoundingSphere([8, 33, 33], 6), test = [];
			space_tree = new SpaceTree({ region: [min, max], minSize: 10 })
			space_tree.insert(item, function (item) {
				test.push(item)
			})
			expect(test.length).to.equal(1)
			expect(space_tree.data.length).to.equal(73)
			space_tree.toNth(7)
			space_tree.toNth(7)
			expect(space_tree.nodeItem.objects.length).to.equal(1)
		})
		it('should resize itself when resize is set', () => {
			space_tree = new SpaceTree({ region: [min, max], minSize: 10, resize: true, maxSize: [100, 100, 100] })
			space_tree.insert(new BoundingSphere([8, 38, 38], 1))

			space_tree.insert(new BoundingSphere([20, 0, 13], 1))

			space_tree.insert(new BoundingSphere([20, 10, 13], 1))

			space_tree.insert(new BoundingSphere([40, 10, 20], 1))
			// space_tree.insert([0, 41, 0]);
			// expect(space_tree.node.min).to.have.all.members([0, 0, 0])
			// expect(space_tree.node.max).to.have.all.members([40, 41, 40])

		})
		it('should divide into an octree', () => {
			space_tree.insert([10, 10, 10])
			space_tree.insert([30, 30, 30])
			space_tree.insert([10, 10, 30])
			space_tree.insert([10, 30, 10])
			space_tree.insert([30, 10, 10])
			space_tree.insert([10, 30, 30])
			space_tree.insert([30, 30, 10])
			space_tree.insert([30, 10, 30])
			expect(space_tree.data.length).to.equal(9)
			const levels = [];
			const nodes = [];
			space_tree.preOrderDepth(function (node, nodeAddress, levelAddress) {
				levels.push(levelAddress);
				nodes.push(nodeAddress)
			}.bind(space_tree));
			expect(levels.length).to.equal(9)
			expect(nodes.length).to.equal(9)
		})
	})
	describe('#closest', () => {
		let closest;
		beforeEach(() => {
			space_tree = new SpaceTree({ region: [min, max], minSize: 10 })
			space_tree.insert(new BoundingSphere([8, 38, 38], 1))
			space_tree.insert(new BoundingSphere([20, 0, 13], 1))
			space_tree.insert(new BoundingSphere([20, 10, 13], 1))
			space_tree.insert(new BoundingSphere([40, 10, 20], 1))
			// console.log(space_tree.flatten())
			expect(space_tree.data.length).to.equal(73)
		})
		describe('with a point', () => {
			it('should return the closest leaf object', () => {

				closest = space_tree.closest([11, 33, 38]);
				expect(closest).not.to.equal(undefined)
				expect(closest.center()).to.have.members([8, 38, 38])

				closest = space_tree.closest([19, 1, 12]);
				expect(closest).not.to.equal(undefined)
				expect(closest.center()).to.have.members([20, 0, 13])

				closest = space_tree.closest([19, 10, 11]);
				expect(closest).not.to.equal(undefined)
				expect(closest.center()).to.have.members([20, 10, 13])

				closest = space_tree.closest([38, 8, 19]);
				expect(closest).not.to.equal(undefined)
				expect(closest.center()).to.have.members([40, 10, 20])

			})
		})
		describe('with a bounding object', () => {
			it('should return the closest leaf object', () => {
				closest = space_tree.closest(new BoundingSphere([11, 33, 38], 1));
				expect(closest).not.to.equal(undefined)
				expect(closest.center()).to.have.members([8, 38, 38])

				closest = space_tree.closest(new BoundingSphere([9, 33, 38]));
				expect(closest).not.to.equal(undefined)
				expect(closest.center()).to.have.members([8, 38, 38])

				closest = space_tree.closest(new BoundingSphere([19, 0, 11]));
				expect(closest).not.to.equal(undefined)
				expect(closest.center()).to.have.members([20, 0, 13])

				closest = space_tree.closest(new BoundingSphere([38, 8, 19]));
				expect(closest).not.to.equal(undefined)
				expect(closest.center()).to.have.members([40, 10, 20])
			})
		})
	})
	describe('#closestByColor', () => {
		let closest;
		beforeEach(() => {
			space_tree = new SpaceTree({ region: [min, max], minSize: 10 })
			space_tree.insert(new BoundingSphere([8, 38, 38], 1))
			space_tree.insert(new BoundingSphere([20, 0, 13], 1))
			space_tree.insert(new BoundingSphere([20, 10, 13], 1))
			space_tree.insert(new BoundingSphere([40, 10, 20], 1))
			expect(space_tree.data.length).to.equal(73)
		})
		describe('with a color', () => {
			it('should return the closest leaf object', () => {

				closest = space_tree.closestByColor([0.275, 0.825, 0.95]);
				expect(closest).not.to.equal(undefined)
				expect(closest.center()).to.have.members([8, 38, 38])

				closest = space_tree.closestByColor([0.475, 0.025, 0.3]);
				expect(closest).not.to.equal(undefined)
				expect(closest.center()).to.have.members([20, 0, 13])

				closest = space_tree.closestByColor([0.475, 0.25, 0.275]);
				expect(closest).not.to.equal(undefined)
				expect(closest.center()).to.have.members([20, 10, 13])

				closest = space_tree.closestByColor([0.95, 0.2, 0.475]);
				expect(closest).not.to.equal(undefined)
				expect(closest.center()).to.have.members([40, 10, 20])

			})
		})
	});
	// describe("#getValues", () => {
	// 	beforeEach(() => {
	// 		space_tree = new SpaceTree({ region: [min, max], minSize: 1 })
	// 		space_tree.insert([1, 0, 0])
	// 		space_tree.insert([2, 0, 0])
	// 		space_tree.insert([21, 21, 0])
	// 		space_tree.insert([0, 21, 0])
	// 		space_tree.insert([21, 0, 0])
	// 	})
	// 	it('should return only the leaves, not the structure', () => {
	// 		const results = space_tree.getValues({ positions: true, indices: true });
	// 		expect(results.positions.length).to.equal(5);
	// 		expect(results.indices.length).to.equal(5);
	// 	})
	// 	it('should returned a color buffer if requested', () => {
	// 		const results = space_tree.getValues({ colors: true });
	// 		expect(results.colors.length).to.equal(5);
	// 		expect(results.colors[0]).to.have.members([0.025, 0, 0])
	// 		expect(results.colors[4]).to.have.members([.525, 0, 0])
	// 		expect(results.positions.length).to.equal(0);
	// 		expect(results.indices.length).to.equal(5);
	// 	})
	// 	it('should return values as buffers if requested', () => {
	// 		const results = space_tree.getValues({ positions: true, indices: true, colors: true, buffer: true });

	// 		expect(results.positions.length).to.equal(15);
	// 		expect(results.colors.length).to.equal(15);
	// 		expect(results.indices.length).to.equal(5);
	// 	})
	// 	it('should sort by index if buffer', () => {
	// 		const results = space_tree.getValues({ positions: true, indices: true, colors: true, buffer: true });
	// 		expect(results.positions.length).to.equal(15);
	// 		expect(results.colors.length).to.equal(15);
	// 		expect(results.indices.length).to.equal(5);
	// 		expect(results.indices[0]).to.equal(0)
	// 		expect(results.indices[4]).to.equal(4)
	// 		expect(results.positions[0]).to.equal(1)
	// 		expect(results.positions[1]).to.equal(0)
	// 		expect(results.positions[2]).to.equal(0)
	// 		expect(results.positions[12]).to.equal(21)
	// 		expect(results.positions[13]).to.equal(0)
	// 		expect(results.positions[14]).to.equal(0)

	// 		expect(results.colors[0]).to.equal(0.025)
	// 		expect(results.colors[1]).to.equal(0)
	// 		expect(results.colors[2]).to.equal(0)
	// 		expect(results.colors[12]).to.equal(0.525)
	// 		expect(results.colors[13]).to.equal(0)
	// 		expect(results.colors[14]).to.equal(0)
	// 	})
	// })
})
