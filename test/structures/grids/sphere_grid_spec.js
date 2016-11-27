import {expect} from 'chai';
import {length} from '../../../source/math/vector';
import {uniqBy} from 'lodash';
const SphereGrid = abstracts.grids.SphereGrid;

describe('SphereGrid', ()=>{
	let grid, test, edge;
	describe('#new SphereGrid', ()=>{
		it('should make a new grid')
		it('should have a bounds')
	})
	describe('#buildGrid', ()=>{
		before(()=>{
			grid = new SphereGrid([5,5], [0,0,0], 1)
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
	describe('#eachFace', ()=>{
		before(()=>{
			grid = new SphereGrid([2,2], [0,0,0], 1)
			grid.buildGrid()				
		})
		it('should iterate over each face', ()=>{
			let callCount = 0;
			let callItems = [];
			let callIndices = [];

			grid.eachFace((face, index)=>{
				callCount += 1;
				callItems.push(face)
				callIndices.push(index)
			})

			expect(callCount).to.equal(6)
			expect(callIndices).to.have.members([0,1,2,3,4,5])
		})
	})	
	describe('#getFace', ()=>{
		before(()=>{
			grid = new SphereGrid([2,2], [0,0,0], 1)
			grid.buildGrid()			
		})		
		it('should return the face at index', ()=>{
			let face = grid.getFace(0)
			expect(face.children.length).to.equal(12)		
			expect(face.get([0,0])).to.deep.equal([1,-1,-1])
			expect(face.get([0,1])).to.deep.equal([1,1,-1])
			expect(face.get([1,0])).to.deep.equal([1,-1,1])
			expect(face.get([1,1])).to.deep.equal([1,1,1])
		})
	})
	describe('#getEdge', ()=>{
		before(()=>{
			grid = new SphereGrid([2,2], [0,0,0], 1)
			grid.buildGrid()			
		})		
		it('should return the face at index', ()=>{
			edge = grid.getEdge(0,0)
			expect(edge.length).to.equal(6)		
			expect(edge).to.deep.equal([1,-1,-1,1,1,-1])			
			edge = grid.getEdge(1,1)
			expect(edge.length).to.equal(6)		
			expect(edge).to.deep.equal([1,-1,1,1,-1,-1])
			edge = grid.getEdge(2,2)
			expect(edge.length).to.equal(6)		
			expect(edge).to.deep.equal([-1,1,1,1,1,1])
			edge = grid.getEdge(3,3)
			expect(edge.length).to.equal(6)		
			expect(edge).to.deep.equal([-1,-1,1,-1,-1,-1])			
		})
		it('should allow reversal', ()=>{
			edge = grid.getEdge(0,0,-1)
			expect(edge.length).to.equal(6)		
			expect(edge).to.deep.equal([1,1,-1, 1,-1,-1])			
			edge = grid.getEdge(1,1,-1)
			expect(edge.length).to.equal(6)		
			expect(edge).to.deep.equal([1,-1,-1, 1,-1,1])
			edge = grid.getEdge(2,2,-1)
			expect(edge.length).to.equal(6)		
			expect(edge).to.deep.equal([1,1,1, -1,1,1])
			edge = grid.getEdge(3,3,-1)
			expect(edge.length).to.equal(6)		
			expect(edge).to.deep.equal([-1,-1,-1,-1,-1,1])			
		})		
	})	
})