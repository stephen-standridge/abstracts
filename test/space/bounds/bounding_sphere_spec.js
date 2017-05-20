import {expect, assert} from 'chai';
import { BoundingSphere } from '../../../source/space/bounds';

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
})
