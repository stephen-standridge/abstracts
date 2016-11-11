import {expect, assert} from 'chai';
import BoundingBox from '../../../source/structures/bounds/bounding_box';


describe('BoundingBox', ()=>{
	let test, control, bounding_box;
	describe('#new BoundingBox', ()=>{
		it('should infer the dimensions from the min point', ()=>{
			bounding_box = new BoundingBox([1,2],[3,4,5])
			expect(bounding_box.dimensions).to.equal(2)
			expect(bounding_box.min).to.have.members([1,2])
			expect(bounding_box.max).to.have.members([3,4])
		})
		it('should organize the max and min values correctly', ()=>{
			bounding_box = new BoundingBox([1,7],[3,4,5])
			expect(bounding_box.dimensions).to.equal(2)
			expect(bounding_box.min).to.have.members([1,4])
			expect(bounding_box.max).to.have.members([3,7])			
		})
	})
	describe('#center', ()=>{
		it('should calculate the center point for the bounding box', ()=>{
			bounding_box = new BoundingBox([-2, 0, 3], [4, -2, 2])
			expect(bounding_box.center()).to.have.members([1, -1, 2.5])
		})
		describe('with a dimension', ()=>{
			before(()=>{
				bounding_box = new BoundingBox([-2, 1], [-5, 5])
			})
			it('should return the center for the given dimension', ()=>{
				expect(bounding_box.center(1)).to.equal(3)
			})
			it('should be undefined for greater dimensions', ()=>{
				expect(bounding_box.center(2)).to.equal(undefined)
			})
		})
	})
	describe('#measurement', ()=>{
		it('should calculate the measurements of the bounding box', ()=>{
			bounding_box = new BoundingBox([-2, 0, 3], [4, -2, 2])
			expect(bounding_box.measurement()).to.have.members([6, 2, 1])
		})
		describe('with a dimension', ()=>{
			before(()=>{
				bounding_box = new BoundingBox([-2, 1], [-5, 5])
			})
			it('should return the measurement for the given dimension', ()=>{
				expect(bounding_box.measurement(1)).to.equal(4)
			})
			it('should be undefined for greater dimensions', ()=>{
				expect(bounding_box.measurement(2)).to.equal(undefined)
			})
		})		
	})
	describe('#extent', ()=>{
		it('should calculate the half length of the bounding box', ()=>{
			bounding_box = new BoundingBox([-2, 0, 3], [4, -2, 2])
			expect(bounding_box.extent()).to.have.members([3, 1, 0.5])
		})
		describe('with a dimension', ()=>{
			before(()=>{
				bounding_box = new BoundingBox([-2, 1], [-5, 5])
			})
			it('should return the half length for the given dimension', ()=>{
				expect(bounding_box.extent(1)).to.equal(2)
			})
			it('should be undefined for greater dimensions', ()=>{
				expect(bounding_box.extent(2)).to.equal(undefined)
			})
		})		
	})	
	describe('#toParams', ()=>{
		it('should return its center and extents', ()=>{
			bounding_box = new BoundingBox([1,2],[3,4])
			expect(bounding_box.toParams()[0]).to.have.members([2,3])
			expect(bounding_box.toParams()[1]).to.have.members([1,1])
		})
	})

})