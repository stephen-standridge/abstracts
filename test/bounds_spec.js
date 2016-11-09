import {expect, assert} from 'chai';
import BoundingSphere from '../source/bounding_sphere';
import BoundingBox from '../source/bounding_box';


describe('Bounds', ()=>{
	let bounding_box;
	describe('#intersects', ()=>{
		before(()=>{
			bounding_box = new BoundingBox([2,2,2], [-2,-2,-2])
		})		
		describe('with a center and array of extents', ()=>{
			it('should take a bounding box as params', ()=>{
				let bBox = new BoundingBox([3,4,5],[1,2,1]);
				expect(bounding_box.intersects(bBox)).to.equal(true)			
			})			
			it('should return false if the volume of one set of points is contained in the other', ()=>{
				expect(bounding_box.intersects([1.0,1.0,1.0],[0.9,0.9,0.9])).to.equal(false)				
			})
			it('should return false if the volume of one set of points contains the other', ()=>{
				expect(bounding_box.intersects([1.0,1.0,1.0],[5.0,5.0,5.0])).to.equal(false)				
			})
			it('should return true if the volume of one intersects the other', ()=>{
				expect(bounding_box.intersects([2.0,2.0,2.0],[1.0,1.0,1.0])).to.equal(true)				
				expect(bounding_box.intersects([-2.0,-2.0,-2.0],[1.0,1.0,1.0])).to.equal(true)				
			})			
			it('should return false if the volume of one doesnt intersect the other', ()=>{
				expect(bounding_box.intersects([4,5,6],[1,1,1])).to.equal(false)
			})
		})
		describe('with one set of points and a distance', ()=>{
			it('should take a bounding sphere as params', ()=>{
				let bBox = new BoundingSphere([1,1,1],1.5);
				expect(bounding_box.intersects(bBox)).to.equal(true)			
			})			
			it('should return false if the volume of one set of points is contained in the other', ()=>{
				expect(bounding_box.intersects([1.0,1.0,1.0],0.9)).to.equal(false)
			})
			it('should return false if the volume of one set of points contains the other', ()=>{
				expect(bounding_box.intersects([1.0,1.0,1.0],5.0)).to.equal(false)				
			})						
			it('should return true if the volume of one intersects the other', ()=>{
				expect(bounding_box.intersects([1.0,1.0,1.0],1.5)).to.equal(true)
			})
			it('should coerce uneven dimensions', ()=>{
				expect(bounding_box.intersects([3,4],1)).to.equal(false)
				expect(bounding_box.intersects([3,4],2)).to.equal(true)
			})
		})
	})
	describe('#contains', ()=>{
		before(()=>{
			bounding_box = new BoundingBox([2,2,2], [-2,-2,-2])
		})		
		describe('with a center and array of extents', ()=>{
			it('should take a bounding box as params', ()=>{
				let bBox = new BoundingBox([1,1,1],[0.5,1.2,0.9]);
				expect(bounding_box.contains(bBox)).to.equal(true)			
			})			
			it('should return true if the volume of one set of points is contained in the other', ()=>{
				expect(bounding_box.contains([1.0,1.0,1.0],[0.9,0.9,0.9])).to.equal(true)				
			})
			it('should return false if the volume of one set of points contains the other', ()=>{
				expect(bounding_box.contains([1.0,1.0,1.0],[5.0,5.0,5.0])).to.equal(false)				
			})
			it('should return false if the volume of one intersects the other', ()=>{
				expect(bounding_box.contains([2.0,2.0,2.0],[1.0,1.0,1.0])).to.equal(false)				
				expect(bounding_box.contains([-2.0,-2.0,-2.0],[1.0,1.0,1.0])).to.equal(false)				
			})			
			it('should return false if the volume of one doesnt intersect the other', ()=>{
				expect(bounding_box.contains([4,5,6],[1,1,1])).to.equal(false)
			})
		})
		describe('with one set of points and a distance', ()=>{
			it('should take a bounding sphere as params', ()=>{
				let bSphere = new BoundingSphere([1,1,1],0.5);
				expect(bounding_box.contains(bSphere)).to.equal(true)			
			})				
			it('should return true if the volume of one set of points is contained in the other', ()=>{
				expect(bounding_box.contains([1.0,1.0,1.0],0.9)).to.equal(true)
			})
			it('should return false if the volume of one intersects the other', ()=>{
				expect(bounding_box.contains([1.0,1.0,1.0],1.5)).to.equal(false)
			})
			it('should return false if the volume of one set of points contains the other', ()=>{
				expect(bounding_box.contains([1.0,1.0,1.0],5.0)).to.equal(false)				
			})			
		})
	})	
})