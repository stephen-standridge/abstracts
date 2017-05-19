import {expect} from 'chai';
import { CubeGrid } from '../../../source/structures/grids';

describe('FaceNode', ()=>{
	let face, grid, value;
	beforeEach(()=>{
		grid = new CubeGrid([2,2,3], [0,0,0], 1)
		grid.build()

		face = grid.__children[0]
	})
	it('should set the density to be the count of the planes vertices', ()=>{
		expect(face.density).to.equal(2)
	})
	describe('#direction', ()=>{
		it('should return the direction of the face', ()=>{
			expect(face.direction).to.equal(1)
		})
	})

	describe('#edgeUp', ()=>{
		it('should get the upper edge', ()=>{
			face = grid.__children[0]
			expect(face.edgeUp).to.deep.equal([1,1,-1,1,1,1])

			face = grid.__children[1]
			expect(face.edgeUp).to.deep.equal([-1,-1,1,-1,-1,-1])

			face = grid.__children[2]
			expect(face.edgeUp).to.deep.equal([1, -1, 1, 1, 1, 1])

			face = grid.__children[3]
			expect(face.edgeUp).to.deep.equal([-1, 1, -1, -1, -1, -1])

			face = grid.__children[4]
			expect(face.edgeUp).to.deep.equal([-1, 1, 1, 1, 1, 1])

			face = grid.__children[5]
			expect(face.edgeUp).to.deep.equal([1,-1,-1,-1,-1,-1])
		})
	})
	describe('#edgeLeft', ()=>{
		it('should get the left edge', ()=>{
			face = grid.__children[0]
			expect(face.edgeLeft).to.deep.equal([1,-1,-1,1,1,-1])

			face = grid.__children[1]
			expect(face.edgeLeft).to.deep.equal([1,-1,1,-1,-1,1])

			face = grid.__children[2]
			expect(face.edgeLeft).to.deep.equal([-1, -1, 1, 1, -1, 1])

			face = grid.__children[3]
			expect(face.edgeLeft).to.deep.equal([-1, 1, 1, -1, 1, -1])

			face = grid.__children[4]
			expect(face.edgeLeft).to.deep.equal([-1, 1, -1, -1, 1, 1])

			face = grid.__children[5]
			expect(face.edgeLeft).to.deep.equal([1, 1, -1, 1, -1, -1])

		})
	})
	describe('#edgeRight', ()=>{
		it('should get the right edge', ()=>{
			face = grid.__children[0]
			expect(face.edgeRight).to.deep.equal([1,-1,1,1,1,1])

			face = grid.__children[1]
			expect(face.edgeRight).to.deep.equal([1,-1,-1,-1,-1,-1])

			face = grid.__children[2]
			expect(face.edgeRight).to.deep.equal([-1,1,1,1,1,1])

			face = grid.__children[3]
			expect(face.edgeRight).to.deep.equal([-1,-1,1,-1,-1,-1])

			face = grid.__children[4]
			expect(face.edgeRight).to.deep.equal([1, 1, -1, 1, 1, 1])

			face = grid.__children[5]
			expect(face.edgeRight).to.deep.equal([-1, 1, -1, -1, -1, -1])


		})
	})
	describe('#edgeDown', ()=>{
		it('should get the bottom edge', ()=>{
			face = grid.__children[0]
			expect(face.edgeDown).to.deep.equal([1,-1,-1,1,-1,1])

			face = grid.__children[1]
			expect(face.edgeDown).to.deep.equal([1,-1,1,1,-1,-1])

			face = grid.__children[2]
			expect(face.edgeDown).to.deep.equal([-1,-1,1,-1,1,1])

			face = grid.__children[3]
			expect(face.edgeDown).to.deep.equal([-1, 1, 1, -1, -1, 1])

			face = grid.__children[4]
			expect(face.edgeDown).to.deep.equal([-1, 1, -1, 1, 1, -1])

			face = grid.__children[5]
			expect(face.edgeDown).to.deep.equal([1, 1, -1, -1, 1, -1])

		})
	})
	describe('#nextEdgeUp', ()=>{
		it('should return the edge up from this face', ()=>{
			face = grid.__children[0]
			expect(face.nextEdgeUp).to.deep.equal(grid.__children[4].edgeRight)
		})
	})
	describe('#nextEdgeLeft', ()=>{
		it('should return the face left from this face', ()=>{
			face = grid.__children[0]
			expect(face.nextEdgeLeft).to.deep.equal([1, -1, -1, 1, 1, -1])
		})
	})
	describe('#nextEdgeRight', ()=>{
		it('should return the face left from this face', ()=>{
			face = grid.__children[0]
			expect(face.nextEdgeRight).to.deep.equal(grid.__children[2].edgeUp)
		})
	})
	describe('#nextEdgeDown', ()=>{
		it('should return the face left from this face', ()=>{
			face = grid.__children[0]
			expect(face.nextEdgeDown).to.deep.equal([ 1, -1, -1, 1, -1, 1])
		})
	})
	describe('#getNextEdge', ()=>{
		it('should be an alias for the next edge direction', ()=>{
			face = grid.__children[0]
			expect(face.getNextEdge(0)).to.deep.equal([ 1, -1, -1, 1, -1, 1])
			expect(face.getNextEdge(1)).to.deep.equal([1, -1, -1, 1, 1, -1])
			expect(face.getNextEdge(2)).to.deep.equal(grid.__children[4].edgeRight)
			expect(face.getNextEdge(3)).to.deep.equal(grid.__children[2].edgeUp)
		})
	})
	describe('#faceUp', ()=>{
		it('should return the face up from this face', ()=>{
			face = grid.__children[0]
			expect(face.faceUp.length).to.equal(12)
			expect(face.faceUp.__n).to.equal(4)

			face = grid.__children[1]
			expect(face.faceUp.length).to.equal(12)
			expect(face.faceUp.__n).to.equal(5)

			face = grid.__children[2]
			expect(face.faceUp.length).to.equal(12)
			expect(face.faceUp.__n).to.equal(0)

			face = grid.__children[3]
			expect(face.faceUp.length).to.equal(12)
			expect(face.faceUp.__n).to.equal(1)

			face = grid.__children[4]
			expect(face.faceUp.length).to.equal(12)
			expect(face.faceUp.__n).to.equal(2)

			face = grid.__children[5]
			expect(face.faceUp.length).to.equal(12)
			expect(face.faceUp.__n).to.equal(3)
		})
	})
	describe('#faceLeft', ()=>{
		it('should return the face left from this face', ()=>{
			face = grid.__children[0]
			expect(face.faceLeft.length).to.equal(12)
			expect(face.faceLeft.__n).to.equal(5)

			face = grid.__children[1]
			expect(face.faceLeft.length).to.equal(12)
			expect(face.faceLeft.__n).to.equal(3)

			face = grid.__children[2]
			expect(face.faceLeft.length).to.equal(12)
			expect(face.faceLeft.__n).to.equal(1)

			face = grid.__children[3]
			expect(face.faceLeft.length).to.equal(12)
			expect(face.faceLeft.__n).to.equal(5)

			face = grid.__children[4]
			expect(face.faceLeft.length).to.equal(12)
			expect(face.faceLeft.__n).to.equal(3)

			face = grid.__children[5]
			expect(face.faceLeft.length).to.equal(12)
			expect(face.faceLeft.__n).to.equal(1)
		})
	})
	describe('#faceRight', ()=>{
		it('should return the face right from this face', ()=>{
			face = grid.__children[0]
			expect(face.faceRight.length).to.equal(12)
			expect(face.faceRight.__n).to.equal(2)

			face = grid.__children[1]
			expect(face.faceRight.length).to.equal(12)
			expect(face.faceRight.__n).to.equal(0)

			face = grid.__children[2]
			expect(face.faceRight.length).to.equal(12)
			expect(face.faceRight.__n).to.equal(4)

			face = grid.__children[3]
			expect(face.faceRight.length).to.equal(12)
			expect(face.faceRight.__n).to.equal(2)

			face = grid.__children[4]
			expect(face.faceRight.length).to.equal(12)
			expect(face.faceRight.__n).to.equal(0)

			face = grid.__children[5]
			expect(face.faceRight.length).to.equal(12)
			expect(face.faceRight.__n).to.equal(4)
		})
	})
	describe('#faceDown', ()=>{
		it('should return the face right from this face', ()=>{
			face = grid.__children[0]
			expect(face.faceDown.length).to.equal(12)
			expect(face.faceDown.__n).to.equal(1)

			face = grid.__children[1]
			expect(face.faceDown.length).to.equal(12)
			expect(face.faceDown.__n).to.equal(2)

			face = grid.__children[2]
			expect(face.faceDown.length).to.equal(12)
			expect(face.faceDown.__n).to.equal(3)

			face = grid.__children[3]
			expect(face.faceDown.length).to.equal(12)
			expect(face.faceDown.__n).to.equal(4)

			face = grid.__children[4]
			expect(face.faceDown.length).to.equal(12)
			expect(face.faceDown.__n).to.equal(5)

			face = grid.__children[5]
			expect(face.faceDown.length).to.equal(12)
			expect(face.faceDown.__n).to.equal(0)
		})
	})
	describe('#eachEdge', ()=>{
		it('should call a callback on each edge', ()=>{
			face = grid.__children[0]
			let edges = [], indices = [];
			face.eachEdge((edge, index)=>{
				edges.push(edge)
				indices.push(index)
			})
			expect(indices).to.deep.equal([0,1,2,3])
			expect(edges).to.deep.equal([face.edgeDown, face.edgeLeft, face.edgeUp, face.edgeRight])
		})
	})
})
