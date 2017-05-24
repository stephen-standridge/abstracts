import {expect} from 'chai';
import {uniqBy} from 'lodash';
import { CubeGrid } from '../../../source/space/grids';

describe('CubeGrid', ()=>{
	let grid, test, edge;
	describe('#build', ()=>{
		before(()=>{
			grid = new CubeGrid([5,5,3], [0,0,0], 1)
			grid.build()
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
	describe('#eachFace', ()=>{
		before(()=>{
			grid = new CubeGrid([2,2,3], [0,0,0], 1)
			grid.build()
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
			grid = new CubeGrid([2,2,3], [0,0,0], 1)
			grid.build()
		})
		it('should return the face at index', ()=>{
			let face = grid.getFace(0)
			expect(face.children.length).to.equal(12)
			expect(face.get([0,0])).to.deep.equal([1,-1,-1])
			expect(face.get([0,1])).to.deep.equal([1,-1,1])
			expect(face.get([1,0])).to.deep.equal([1,1,-1])
			expect(face.get([1,1])).to.deep.equal([1,1,1])
		})
	})
	describe('#getAxis', ()=>{
		before(()=>{
			grid = new CubeGrid([2,2,3], [0,0,0], 1)
			grid.build()
		})
		it('should return the face thats major axis aligns with the given axis', ()=>{
			expect(grid.getAxis([0,1,0]).__n).to.equal(4)
			expect(grid.getAxis([0,-1,0]).__n).to.equal(1)
			expect(grid.getAxis([0,0,-1]).__n).to.equal(5)
		})
	})
})
