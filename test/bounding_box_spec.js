import {expect, assert} from 'chai';
import BoundingBox from '../source/bounding_box';


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
	describe('#contains', ()=>{
		before(()=>{
			bounding_box = new BoundingBox([2,2,2], [-2,-2,-2])
		})
		describe('with a dimension', ()=>{
			it('should return true if a point intersects with the bounding box in the given dimension', ()=>{
				expect(bounding_box.contains([1,3,7], 0)).to.equal(true)
			})
			it('should return false if a point isnt contained within the bounding box in the given dimension', ()=>{
				expect(bounding_box.contains([1,3,7], 1)).to.equal(false)
				expect(bounding_box.contains([1,3,7], 2)).to.equal(false)
			})			
		})
		describe('without a dimension', ()=>{
			it('should return true if the point intersects in every dimension', ()=>{
				expect(bounding_box.contains([1,1,1])).to.equal(true)
			})
			it('should return false if the point isnt contained in every dimension', ()=>{
				expect(bounding_box.contains([1,1,3])).to.equal(false)				
			})			
		})
	})
	describe('#intersects', ()=>{
		before(()=>{
			bounding_box = new BoundingBox([2,2,2], [-2,-2,-2])
		})		
		describe('with a center and array of extents', ()=>{
			it('should return true if the volume of each set of points intersect', ()=>{
				expect(bounding_box.intersects([3,4,5],[1,2,3])).to.equal(true)				
				expect(bounding_box.intersects([-3,-4,-5],[1,2,3])).to.equal(true)				
			})
			it('should return false for partial intersection', ()=>{
				expect(bounding_box.intersects([3,4,5],[1,1,3])).to.equal(false)				
				expect(bounding_box.intersects([-3,-4,-5],[1,2,2])).to.equal(false)				
			})			
			it('should return false if the volume of each set of points dont intersect', ()=>{
				expect(bounding_box.intersects([4,5,6],[1,2,3])).to.equal(false)
			})
			it('should coerce uneven dimensions', ()=>{
				expect(bounding_box.intersects([4,5],[1,2])).to.equal(false)
				expect(bounding_box.intersects([3,4],[1,2])).to.equal(true)
			})
		})
		describe('with one set of points and a distance', ()=>{
			it('should return true if the volume of each area intersect in every dimension', ()=>{
				expect(bounding_box.intersects([3,4,5],3)).to.equal(true)
			})
			it('should return false if the volume of each area dont intersect in every dimension', ()=>{
				expect(bounding_box.intersects([3,4,5],0.9)).to.equal(false)
			})
			it('should coerce uneven dimensions', ()=>{
				expect(bounding_box.intersects([3,4],1)).to.equal(false)
				expect(bounding_box.intersects([3,4],2)).to.equal(true)
			})
		})
	})
})