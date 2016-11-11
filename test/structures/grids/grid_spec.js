import {expect} from 'chai';
import Grid from '../../../source/structures/grids/grid';

describe('Grid', ()=>{
	let grid, control, test;
	describe('#new Grid', ()=>{
		it('should set the length correctly', ()=>{
			grid = new Grid([3,3,3])
			expect(grid.length).to.equal(27)
		})
		it('should handle multiple dimensions', ()=>{
			grid = new Grid([2,2])
			expect(grid.length).to.equal(4)
			grid = new Grid([2,2,2,2])
			expect(grid.length).to.equal(16)			
		})
		it('should handle arbitrary dimensions', ()=>{
			grid = new Grid([2,4,3])
			expect(grid.length).to.equal(24)
			grid = new Grid([2,5,2,1])
			expect(grid.length).to.equal(20)
		})
	})
	describe('#index', ()=>{
		describe('with a full address', ()=>{
			it('should return the index of the address', ()=>{
				grid = new Grid([3,3])
				expect(grid.index([0,0])).to.equal(0)
				expect(grid.index([2,1])).to.equal(5)
				expect(grid.index([1,1])).to.equal(4)
				expect(grid.index([2,2])).to.equal(8)	
			})
			it('should work in three dimensions', ()=>{
				grid = new Grid([3,3,3])
				expect(grid.index([0,0,0])).to.equal(0)
				expect(grid.index([2,1,2])).to.equal(23)
				expect(grid.index([1,2,0])).to.equal(7)
				expect(grid.index([1,2,1])).to.equal(16)
				expect(grid.index([2,2,2])).to.equal(26)				
			})
			it('should handle arbitrary dimensions', ()=>{
				grid = new Grid([1,2,3])
				expect(grid.index([0,0,0])).to.equal(0)
				expect(grid.index([0,1,0])).to.equal(1)
				expect(grid.index([0,0,1])).to.equal(2)				
				expect(grid.index([0,1,1])).to.equal(3)
				expect(grid.index([0,0,2])).to.equal(4)					
				expect(grid.index([0,1,2])).to.equal(5)					
			})
			it('should handle higher dimensions', ()=>{
				grid = new Grid([3,3,3,3])
				expect(grid.index([0,0,0,0])).to.equal(0)
				expect(grid.index([2,2,2,2])).to.equal(80)
				expect(grid.index([2,2,2,1])).to.equal(53)
				expect(grid.index([2,2,2,0])).to.equal(26)
			})
		})
		describe('an address with null values', ()=>{
			it('should return a list of cells')			
		})
	})
	describe('#set', ()=>{
		describe('with a full address', ()=>{
			describe('with a value', ()=>{
				it('should set the value of the node')
			})
			describe('with an array of values', ()=>{
				it('should warn if the array doesnt match the dimension')
				it('should set the value to the nodes')
			})
			it('should work in odd dimensions')
			it('should work in higher dimensions')
		})
		describe('an address with null values', ()=>{
			it('should warn if the array doesnt match the dimension')			
			it('should set a list of cells')			
		})
	})
	describe('#get', ()=>{
		describe('with a full address', ()=>{
			describe('with a value', ()=>{
				it('should set the value of the node')
			})
			describe('with an array of values', ()=>{
				it('should warn if the array doesnt match the dimension')
				it('should set the value to the nodes')
			})
			it('should work in odd dimensions')
			it('should work in higher dimensions')
		})
		describe('an address with null values', ()=>{
			it('should return a list of cells')
		})
	})	
})