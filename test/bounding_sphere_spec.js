import {expect, assert} from 'chai';
import BoundingSphere from '../source/bounding_sphere';

describe('BoundingSphere', ()=>{
	let test, control, bounding_sphere;
	describe('#new BoundingSphere', ()=>{
		it('should infer the dimensions from the center point', ()=>{
			bounding_sphere = new BoundingSphere([1,2],4)
			expect(bounding_sphere.dimensions).to.equal(2)
			bounding_sphere = new BoundingSphere([1,2,3],4)
			expect(bounding_sphere.dimensions).to.equal(3)
		})
	})
	describe('#center', ()=>{
		it('should return the center point for the bounding sphere', ()=>{
			bounding_sphere = new BoundingSphere([-2, 0, 3], 7)
			expect(bounding_sphere.center()).to.have.members([-2,0,3])
		})
		describe('with a dimension', ()=>{
			before(()=>{
				bounding_sphere = new BoundingSphere([-2, 1], 4)
			})
			it('should return the center for the given dimension', ()=>{
				expect(bounding_sphere.center(1)).to.equal(1)
			})
			it('should be undefined for greater dimensions', ()=>{
				expect(bounding_sphere.center(2)).to.equal(undefined)
			})
		})
	})
	describe('#measurement', ()=>{
		it('should calculate the measurements of the bounding box', ()=>{
			bounding_sphere = new BoundingSphere([-2, 0, 3], 2)
			expect(bounding_sphere.measurement()).to.have.members([4, 4, 4])
		})
		describe('with a dimension', ()=>{
			before(()=>{
				bounding_sphere = new BoundingSphere([-2, 1], 5)
			})
			it('should return the measurement for the given dimension', ()=>{
				expect(bounding_sphere.measurement(1)).to.equal(10)
			})
			it('should be undefined for greater dimensions', ()=>{
				expect(bounding_sphere.measurement(2)).to.equal(undefined)
			})
		})		
	})
	describe('#extent', ()=>{
		it('should calculate the half length of the bounding box', ()=>{
			bounding_sphere = new BoundingSphere([-2, 0, 3], 4)
			expect(bounding_sphere.extent()).to.have.members([4,4,4])
		})
		describe('with a dimension', ()=>{
			before(()=>{
				bounding_sphere = new BoundingSphere([-2, 1], 5)
			})
			it('should return the half length for the given dimension', ()=>{
				expect(bounding_sphere.extent(1)).to.equal(5)
			})
			it('should be undefined for greater dimensions', ()=>{
				expect(bounding_sphere.extent(2)).to.equal(undefined)
			})
		})		
	})	
	describe('#toParams', ()=>{
		it('should return its center and radius', ()=>{
			bounding_sphere = new BoundingSphere([1,2],3)
			expect(bounding_sphere.toParams()[0]).to.have.members([1,2])
			expect(bounding_sphere.toParams()[1]).to.equal(3)
		})
	})
	describe('#contains', ()=>{
		before(()=>{
			bounding_sphere = new BoundingSphere([2,2,2], 2)
		})
		describe('with a dimension', ()=>{
			it('should return true if a point intersects with the bounding box in the given dimension', ()=>{
				expect(bounding_sphere.contains([1,3,7], 0)).to.equal(true)
			})
			it('should return false if a point isnt contained within the bounding box in the given dimension', ()=>{
				expect(bounding_sphere.contains([1,5,7], 1)).to.equal(false)
				expect(bounding_sphere.contains([1,3,7], 2)).to.equal(false)
			})			
		})
		describe('without a dimension', ()=>{
			it('should return true if the point intersects in every dimension', ()=>{
				expect(bounding_sphere.contains([1,1,1])).to.equal(true)
			})
			it('should return false if the point isnt contained in every dimension', ()=>{
				expect(bounding_sphere.contains([1,4.1,4.1])).to.equal(false)				
			})			
		})
	})
	describe('#intersects', ()=>{
		before(()=>{
			bounding_sphere = new BoundingSphere([2,2,2], 2)
		})		
		describe('with a center and array of extents', ()=>{
			it('should return true if the volume of each set of points intersect', ()=>{
				expect(bounding_sphere.intersects([1,3,5],[2,2,4])).to.equal(true)				
			})
			it('should return false for partial intersection', ()=>{
				expect(bounding_sphere.intersects([5,5,6],[0.9,1,2])).to.equal(false)				
				expect(bounding_sphere.intersects([-1,-1,6],[0.9,1,2])).to.equal(false)				
			})			
			it('should return false if the volume of each set of points dont intersect', ()=>{
				expect(bounding_sphere.intersects([5,5,6],[0.9,0.9,1.9])).to.equal(false)
			})
			it('should coerce uneven dimensions', ()=>{
				expect(bounding_sphere.intersects([5,5],[0.9,0.6])).to.equal(false)
				expect(bounding_sphere.intersects([5,5],[1,1.1])).to.equal(true)
			})
		})
		describe('with one set of points and a distance', ()=>{
			it('should return true if the volume of each area intersect in every dimension', ()=>{
				expect(bounding_sphere.intersects([3,4,5],3)).to.equal(true)
			})
			it('should return false if the volume of each area dont intersect in every dimension', ()=>{
				expect(bounding_sphere.intersects([3,4,5],0.9)).to.equal(false)
			})
			it('should coerce uneven dimensions', ()=>{
				expect(bounding_sphere.intersects([5,5],0.9)).to.equal(false)
				expect(bounding_sphere.intersects([3,4],2)).to.equal(true)
			})
		})
	})
})