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
			it('should work with lower dimensions')	
			it('should work with arbitrary dimensions')									
		})
	})
	describe('#set', ()=>{
		describe('with a full address', ()=>{
			describe('with a value', ()=>{
				before(()=>{
					grid = new Grid([3,3,3])
				})
				it('should set the value of the node if its within range', ()=>{
					expect(grid.set([2,2,2], 'hello')).to.eq(true)
					expect(grid.nodes[26]).to.eq('hello')
				})
				it('should return false if the value is outside of range', ()=>{
					expect(grid.set([2,3,2], 'hello')).to.eq(false)
					expect(grid.set([3,2,2], 'hello')).to.eq(false)
					expect(grid.set([2,2,3], 'hello')).to.eq(false)
				})
			})
			describe('with an array of values', ()=>{
				describe('and an indice is specified for the final dimension', ()=>{
					it('should warn if the array length doesnt match the dimension plus index', ()=>{
						expect(grid.set([2,2,1], [true, true, true])).to.equal(false)
					})
					it('should set the value to the nodes', ()=>{
						expect(grid.set([2,2,1], [true, true])).to.equal(true)						
						expect(grid.nodes[25]).to.equal(true)						
						expect(grid.nodes[26]).to.equal(true)						
					})
				})
				describe('and an indice is not specified for the final dimension', ()=>{
					it('should warn if the array length doesnt match the dimension size', ()=>{
						expect(grid.set([2,2], [true, true])).to.equal(false)
					})
					it('should set the value to the nodes', ()=>{
						expect(grid.set([2,1], [true, true, true])).to.equal(true)
						expect(grid.nodes[15]).to.equal(true)
						expect(grid.nodes[16]).to.equal(true)
						expect(grid.nodes[17]).to.equal(true)
					})					
				})
				describe('with null dimensions', ()=>{
					it('should warn if the array length doesnt match the total cell count')
					it('should set the value to the nodes')					
				})				
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