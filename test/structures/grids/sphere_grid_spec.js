import {expect} from 'chai';
import {length} from '../../../source/math/vector';
import {uniqBy} from 'lodash';
import {SphereGrid} from '../../../source/structures/grids/sphere_grid';

describe('SphereGrid', ()=>{
	let grid, test;
	describe('#new SphereGrid', ()=>{
		it('should make a new grid')
		it('should have a bounds')
	})
	describe('#buildGrid', ()=>{
		before(function(){
			grid = new SphereGrid([5,5], [0,0,0], 1)
			grid.buildGrid()			
		})
		it('should populate with the right number of points', ()=>{
			expect(grid.grid.length).to.equal(450)
		})
		it('should make right first', ()=>{
			expect(grid.get([0,0,0,0])).to.equal(1)
			expect(grid.get([0,2,2,0])).to.equal(1)
		})
		it('should make bottom second', ()=>{
			expect(grid.get([1,0,0,1])).to.equal(-1)
			expect(grid.get([1,2,2,1])).to.equal(-1)					
		})
		it('should make front third', ()=>{
			expect(grid.get([2,0,0,2])).to.equal(1)
			expect(grid.get([2,2,2,2])).to.equal(1)				
		})
		it('should make left fourth', ()=>{
			expect(grid.get([3,0,0,0])).to.equal(-1)
			expect(grid.get([3,2,2,0])).to.equal(-1)				
		})
		it('should make top fifth', ()=>{
			expect(grid.get([4,0,0,1])).to.equal(1)
			expect(grid.get([4,2,2,1])).to.equal(1)				
		})
		it('should make back sixth', ()=>{
			expect(grid.get([5,0,0,2])).to.equal(-1)
			expect(grid.get([5,2,2,2])).to.equal(-1)				
		})
	})
	describe('#toSphere', ()=>{
		before(function(){
			grid = new SphereGrid([5,5], [0,0,0], 3)
			grid.buildGrid()			
			grid.toSphere()
		})
		it('should make all points the length of the radius away from center', ()=>{
			let passed = [];
			grid.traverse(function(item){
				passed.push(3 - length(item) < 0.00001)
			})
			expect(uniqBy( passed, v => v)).to.have.members([true])
		})
	})
})