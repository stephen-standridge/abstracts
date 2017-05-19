import {expect, assert} from 'chai';
import * as vector from '../../source/math/vector';

describe('vectors', ()=>{
	describe('#cross', ()=>{
		it('should return a vector that is the cross product of two given vectors', ()=>{
			let crossProduct = vector.cross([1,-7,1], [5,2,4]) ;
			expect(crossProduct[0]).to.eq(-30)
			expect(crossProduct[1]).to.eq(1)
			expect(crossProduct[2]).to.eq(37)
		})
	})

	describe('#dot', ()=>{
		it('should return a scalar that is the dot product of two given vectors', ()=>{
			let dotProduct = vector.dot([1,2,3], [-2,0,5])
			expect(dotProduct).to.eq(13)
		})
	})

	describe('#length', ()=>{
		it('should return a scalar that is the length of a given vetor', ()=>{
			let v = [3,4]
			expect(vector.length(v)).to.equal(5)
		})
	})

	describe('#perpendicular', ()=>{
		it('should return a vector perpendicular to the given vector', ()=>{
			let v = [1,1,1];
			let perpendicular = vector.perpendicular(v, 0.5)
			expect(perpendicular[0]).to.equal(0.5)
			expect(perpendicular[1]).to.equal(0.5)
			expect(perpendicular[2]).to.equal(-1)
			expect(vector.dot( perpendicular, v ) ).to.equal(0)

			v = [0,3,1];
			perpendicular = vector.perpendicular(v, 2)
			expect(perpendicular[0]).to.equal(2)
			expect(perpendicular[1]).to.equal(2)
			expect(perpendicular[2]).to.equal(-6)
			expect( vector.dot( perpendicular, v ) ).to.equal(0)

		})
	})

	describe('#unit', ()=>{
		it('should make the given vector a unit vector', ()=>{
			let v = [2,3,4];
			let unit = vector.unit( v )
			expect(vector.length(v)).not.to.equal(1)
			expect(vector.length(unit)).to.equal(1)
		})
	})

	describe('#add', ()=>{
		it('should return a vector that is an addition of every given vector', ()=>{
			let v = [3,4,5]
			let v2 = [0,-1,2]
			let v3 = [2,-2,-1]
			let added = vector.add([v,v2,v3])
			expect(added[0]).to.equal(5)
			expect(added[1]).to.equal(1)
			expect(added[2]).to.equal(6)
		})
	})


	describe('#descale', ()=>{
		it('should return a vector that is the given vector divided by the given scalar', ()=>{
			let v = [3,4,5]
			let divided = vector.descale( v, 2 )
			expect(divided[0]).to.equal(1.5)
			expect(divided[1]).to.equal(2)
			expect(divided[2]).to.equal(2.5)
		})
	})

	describe('#scale', ()=>{
		it('should return a vector that is the given vector scaled by the given scalar', ()=>{
			let v = [3,4,5];
			let scaled = vector.scale( v, 3 )
			expect(scaled[0]).to.equal(9)
			expect(scaled[1]).to.equal(12)
			expect(scaled[2]).to.equal(15)
			expect(vector.length(scaled)).to.equal(3 * vector.length(v))
		})
	})

	describe('#direction', ()=>{
		it('should return a unit vector that is the direction between two vectors', ()=>{
			let v1 = [-50, 50, 0]
			let v2 = [50, -50, 0]
			let dir = vector.direction(v1,v2)
			expect(1.0 - vector.length(dir) < 0.001).to.equal(true)
			expect(dir[0].toFixed(1)).to.equal('-0.7')
			expect(dir[1].toFixed(1)).to.equal('0.7')
			expect(dir[2]).to.equal(0)
		})
	})

	describe('#toLength', ()=>{
		it('should return a vector that is the given vector scaled to the length of the given scalar', ()=>{
			let v = [3,4,5];
			expect(vector.length(v)).not.to.equal(3)
			let scaled = vector.toLength( v, 3 )
			expect(vector.length(scaled)).to.equal(3)
		})
	})

	describe('#createAxes', ()=>{
		// it('should return two axes vectors that are perpendicular to the given vector',()=>{
		// 	let v = [3,4,5]
		// 	let [a, b] = vector.createAxes(v);
		// 	let cross = vector.cross(a, v)
		// 	expect(vector.dot( a, v )).to.equal(0)
		// 	expect(cross[0]).to.equal(b[0])
		// 	expect(cross[1]).to.equal(b[1])
		// 	expect(cross[2]).to.equal(b[2])
		// })
	})

	describe('#majorAxis', ()=>{
		it('should return the largest absolute value of the given vector with the axis index', ()=>{
			let v = [2,14,0];
			expect(vector.majorAxis(v)).to.deep.equal([14,1])
			v = [2, -2.4, 1];
			expect(vector.majorAxis(v)).to.deep.equal([-2.4, 1])
		})
	})

})
