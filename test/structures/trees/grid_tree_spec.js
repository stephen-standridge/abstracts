import {expect} from 'chai';
import GridTree from '../../../source/structures/trees/grid_tree';

describe('Grid', ()=>{
	let grid, control, test;
	describe('#new GridTree', ()=>{
		it('should set the length correctly', ()=>{
			grid = new GridTree([3,3,3])
			expect(grid.length).to.equal(27)
			expect(grid.grid.length).to.equal(27)
		})
		it('should handle multiple dimensions', ()=>{
			grid = new GridTree([2,2])
			expect(grid.length).to.equal(4)
			grid = new GridTree([2,2,2,2])
			expect(grid.length).to.equal(16)			
		})
		it('should handle arbitrary dimensions', ()=>{
			grid = new GridTree([2,4,3])
			expect(grid.length).to.equal(24)
			grid = new GridTree([2,5,2,1])
			expect(grid.length).to.equal(20)
		})
	})
	describe('#index', ()=>{
		describe('with a full address', ()=>{
			it('should return the index of the address', ()=>{
				grid = new GridTree([3,3])
				expect(grid.index([0,0])).to.equal(0)
				expect(grid.index([0,1])).to.equal(1)
				expect(grid.index([0,2])).to.equal(2)
				expect(grid.index([2,1])).to.equal(7)
				expect(grid.index([1,1])).to.equal(4)
				expect(grid.index([2,2])).to.equal(8)	
			})
			it('should work in three dimensions', ()=>{
				grid = new GridTree([3,3,3])
				expect(grid.index([0,0,0])).to.equal(0)
				expect(grid.index([2,1,2])).to.equal(23)
				expect(grid.index([1,2,0])).to.equal(15)
				expect(grid.index([1,2,1])).to.equal(16)
				expect(grid.index([2,2,2])).to.equal(26)				
			})
			it('should handle arbitrary dimensions', ()=>{
				grid = new GridTree([1,2,3])
				expect(grid.index([0,0,0])).to.equal(0)
				expect(grid.index([0,1,0])).to.equal(3)
				expect(grid.index([0,0,1])).to.equal(1)				
				expect(grid.index([0,1,1])).to.equal(4)
				expect(grid.index([0,0,2])).to.equal(2)					
				expect(grid.index([0,1,2])).to.equal(5)					
			})
			it('should handle higher dimensions', ()=>{
				grid = new GridTree([3,3,3,3])
				expect(grid.index([0,0,0,0])).to.equal(0)
				expect(grid.index([2,2,2,2])).to.equal(80)
				expect(grid.index([2,2,2,1])).to.equal(79)
				expect(grid.index([2,2,2,0])).to.equal(78)
			})
		})
		describe('an address with null values', ()=>{
			it('should return a list of cells', ()=>{
				grid = new GridTree([3,3,3])
				expect(grid.index([2,2])).to.equal(24)				
				expect(grid.index([1])).to.equal(9)				
			})
			it('should work with higher dimensions')	
			it('should work with arbitrary dimensions')									
		})
	})
	describe('#set', ()=>{
		describe('with a full address', ()=>{
			describe('with a value', ()=>{
				before(()=>{
					grid = new GridTree([3,3,3])
				})
				it('should set the value of the node if its within range', ()=>{
					expect(grid.set([2,2,2], 'hello')).to.eq(true)
					expect(grid.grid[26]).to.eq('hello')
				})
				it('should return false if the value is outside of range', ()=>{
					expect(grid.set([2,3,2], 'hello')).to.eq(false)
					expect(grid.set([3,2,2], 'hello')).to.eq(false)
					expect(grid.set([2,2,3], 'hello')).to.eq(false)
				})
				it('should work in odd dimensions',()=>{
					grid = new GridTree([2,1,3])
					expect(grid.set([0,0,0],'first')).to.equal(true)
					expect(grid.set([0,0,2],'second')).to.equal(true)
					expect(grid.set([1,0,2],'third')).to.equal(true)
					expect(grid.grid[0]).to.equal('first')
					expect(grid.grid[2]).to.equal('second')
					expect(grid.grid[5]).to.equal('third')
				})				
				it('should work in higher dimensions', ()=>{
					grid = new GridTree([3,3,3,3])	
					expect(grid.set([2,2,2,2], 'hello')).to.eq(true)
					expect(grid.grid[80]).to.eq('hello')							
				})
			})
		})
	})
	describe('#get', ()=>{
		describe('with a full address', ()=>{
			before(()=>{
				grid = new GridTree([3,3,3])
			})
			it('should get the value of the node if its within range', ()=>{
				expect(grid.set([2,2,2], 'hello')).to.eq(true)
				expect(grid.get([2,2,2])).to.eq('hello')
			})
			it('should return undefined if the value is outside of range', ()=>{
				expect(grid.get([2,3,2])).to.eq(undefined)
				expect(grid.get([3,2,2])).to.eq(undefined)
				expect(grid.get([2,2,3])).to.eq(undefined)
			})
			it('should work in odd dimensions',()=>{
				grid = new GridTree([2,1,3])
				expect(grid.set([0,0,0],'first')).to.equal(true)
				expect(grid.set([0,0,2],'second')).to.equal(true)
				expect(grid.set([1,0,2],'third')).to.equal(true)
				expect(grid.get([0,0,0])).to.equal('first')
				expect(grid.get([0,0,2])).to.equal('second')
				expect(grid.get([1,0,2])).to.equal('third')
			})				
			it('should work in higher dimensions', ()=>{
				grid = new GridTree([3,3,3,3])	
				expect(grid.set([2,2,2,2], 'hello')).to.eq(true)
				expect(grid.get([2,2,2,2])).to.eq('hello')	
			})
		})
		describe('an address with null values', ()=>{
			it('should return a list of cells')
		})
	})	
})