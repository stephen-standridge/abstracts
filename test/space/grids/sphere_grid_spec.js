import { expect } from 'chai';
import { uniqBy } from 'lodash';
import { WarpedSphereGrid, SphereGrid } from '../../../source/space/grids';
import * as vector from '../../../source/math/vector';

describe('WarpedSphereGrid', () => {
	let grid, test, edge;
	describe('#build', () => {
		before(() => {
			grid = new WarpedSphereGrid([5, 5, 3], [0, 0, 0], 3)
			grid.build()
		})
		it('should populate with the right number of points', () => {
			expect(grid.grid.length).to.equal(450)
		})
		it('should make all points the length of the radius away from center', () => {
			let passed = [];
			grid.traverse(function (item) {
				passed.push(3 - vector.length(item) < 0.00000001)
			})
			expect(uniqBy(passed, v => v)).to.have.members([true])
		})
	})
});

describe('SphereGrid', () => {
	let grid, test, edge;
	describe('#build', () => {
		before(() => {
			grid = new SphereGrid([5, 5, 3], [0, 0, 0], 3)
			grid.build()
		})
		it('should populate with the right number of points', () => {
			expect(grid.grid.length).to.equal(450)
		})
		it('should make all points the length of the radius away from center', () => {
			let passed = [];
			grid.traverse(function (item) {
				passed.push(3 - vector.length(item) < 0.00000001)
			})
			expect(uniqBy(passed, v => v)).to.have.members([true])
		})
	})
});
