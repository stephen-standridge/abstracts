import {expect} from 'chai';
import {uniqBy} from 'lodash';
import { NurbsSurface } from '../../../source/space/surfaces'

describe('NurbsSurface', ()=>{
	describe("#generateUniformKnotVector", ()=>{
		let knotVector, otherKnotVector, otherNurbs, nurbs;
		before(()=>{
			nurbs = new NurbsSurface([5,5], [3,3]);
			knotVector = nurbs.generateUniformKnotVector();
			otherNurbs = new NurbsSurface([3,3], [2,2]);
			otherKnotVector = otherNurbs.generateUniformKnotVector();
		})

		it('should generate a uniform knot vector of the correct size', ()=>{
			expect(knotVector.length).to.equal(2);
			expect(knotVector[0].length).to.equal(8)
			expect(knotVector[1].length).to.equal(8)

			expect(otherKnotVector.length).to.equal(2);
			expect(otherKnotVector[0].length).to.equal(5)
			expect(otherKnotVector[1].length).to.equal(5)
		})
		it('should generate a uniform knot vector with the correct entries', ()=>{
			expect(knotVector[0]).to.deep.equal([0,0,0,1.6666666666666665,3.333333333333333,5,5,5])
			expect(knotVector[1]).to.deep.equal([0,0,0,1.6666666666666665,3.333333333333333,5,5,5])

			expect(otherKnotVector[0]).to.deep.equal([0,0,1.5,3,3])
			expect(otherKnotVector[1]).to.deep.equal([0,0,1.5,3,3])
		})
	})
	describe("#generateControlPoints", ()=>{
		let otherNurbs, nurbs;

		before(()=>{
			nurbs = new NurbsSurface([5,5], [3,3], [[-1, 1], [-10, 0],[1,1]]);
			nurbs.generateControlPoints();
			otherNurbs = new NurbsSurface([3,3], [2,2], [[-1, 1], [0, 10],[0,0]]);
			otherNurbs.generateControlPoints();
		})

		it('should generate the correct number of points', ()=>{
			expect(nurbs.length).to.equal(100);
			expect(otherNurbs.length).to.equal(36);
		})

		it('should generate points within the value ranges', ()=>{
			nurbs.iterate((value, indices)=>{
				expect(value[0]).to.be.at.most(1)
				expect(value[0]).to.be.at.least(-1)
				expect(value[1]).to.be.at.most(0)
				expect(value[1]).to.be.at.least(-10)
				expect(value[2]).to.equal(1)
			})
			otherNurbs.iterate((value, indices)=>{
				expect(value[0]).to.be.at.most(1)
				expect(value[0]).to.be.at.least(-1)
				expect(value[1]).to.be.at.most(10)
				expect(value[1]).to.be.at.least(0)
				expect(value[2]).to.equal(0)
			})
		})
		it('should include the minimum range', ()=>{
			let nurbsHasMinX, nurbsHasMinY;

			nurbs.iterate((value, indices)=>{
				if (value[0] == -1) nurbsHasMinX = true;
				if (value[1] == -10) nurbsHasMinY = true;
			});

			expect(nurbsHasMinX).to.equal(true);
			expect(nurbsHasMinY).to.equal(true);

			nurbsHasMinX = false;
			nurbsHasMinY = false;

			otherNurbs.iterate((value, indices)=>{
				if (value[0] == -1) nurbsHasMinX = true;
				if (value[1] == 0) nurbsHasMinY = true;
			});
			expect(nurbsHasMinX).to.equal(true);
			expect(nurbsHasMinY).to.equal(true);
		})
		it('should include the maxiumum range', ()=>{
			let nurbsHasMaxX, nurbsHasMaxY;

			nurbs.iterate((value, indices)=>{
				if (value[0] == 1) nurbsHasMaxX = true;
				if (value[1] == 0) nurbsHasMaxY = true;
			});

			expect(nurbsHasMaxX).to.equal(true);
			expect(nurbsHasMaxY).to.equal(true);

			nurbsHasMaxX = false;
			nurbsHasMaxY = false;

			otherNurbs.iterate((value, indices)=>{
				if (value[0] == 1) nurbsHasMaxX = true;
				if (value[1] == 10) nurbsHasMaxY = true;
			});
			expect(nurbsHasMaxX).to.equal(true);
			expect(nurbsHasMaxY).to.equal(true);
		})
	})
})
