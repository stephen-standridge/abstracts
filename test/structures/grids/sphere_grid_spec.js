import {expect} from 'chai';
import {length} from '../../../source/math/vector';
import {uniqBy} from 'lodash';
const SphereGrid = abstracts.grids.SphereGrid;

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
		it('should allow setting each face')
	})	
	describe('#getFace', ()=>{
		it('should return the face at index')
	})
	describe('#setFace', ()=>{
		it('should set the face at index')
	})	
	describe('CubeFaceNode', ()=>{
		beforeEach(()=>{
			grid = new SphereGrid([2,2], [0,0,0], 1)			
		})
		describe('#direction', ()=>{
			it('should return the direction of the face', ()=>{
				expect(grid.__children[0].direction).to.equal(1)
				expect(grid.__children[2].direction).to.equal(1)
				expect(grid.__children[4].direction).to.equal(1)
				expect(grid.__children[1].direction).to.equal(-1)
				expect(grid.__children[3].direction).to.equal(-1)
				expect(grid.__children[5].direction).to.equal(-1)
			})
		})
		describe('#axes', ()=>{
			it('should return the direction of the face', ()=>{
				expect(grid.__children[0].axes).to.deep.equal([0,2,1])
				expect(grid.__children[2].axes).to.deep.equal([2,1,0])
				expect(grid.__children[4].axes).to.deep.equal([1,0,2])
				expect(grid.__children[1].axes).to.deep.equal([1,0,2])
				expect(grid.__children[3].axes).to.deep.equal([0,2,1])
				expect(grid.__children[5].axes).to.deep.equal([2,1,0])
			})
		})
		describe('#faceUp', ()=>{
			it('should return the face up from this face orientated towards this face', ()=>{
				// expect(grid.__children[0].faceUp.length).to.equal(16)
			})
		})	
		describe('#faceLeft', ()=>{
			it('should return the face left of this face orientated towards this face')
		})		
		describe('#faceRight', ()=>{
			it('should return the face right of this face orientated towards this face')
		})	
		describe('#faceDown', ()=>{
			it('should return the face down from this face orientated towards this face')
		})							
	})
})