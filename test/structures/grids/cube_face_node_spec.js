import {expect} from 'chai';
const SphereGrid = abstracts.grids.SphereGrid;

describe('CubeFaceNode', ()=>{
	let face, grid;
	beforeEach(()=>{
		grid = new SphereGrid([2,2], [0,0,0], 1)	
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
	describe('#axes', ()=>{
		it('should return the direction of the face', ()=>{
			expect(face.axes).to.deep.equal([1,0,0])
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
})