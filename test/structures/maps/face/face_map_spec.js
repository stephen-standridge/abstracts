import {expect} from 'chai';
import {uniqBy} from 'lodash';
const CubeMap = abstracts.maps.CubeMap;

describe('FaceMap', ()=>{
	let cube, value, face;
	beforeEach(()=>{
		cube = new CubeMap([2,2,3], [0,0,0], 1)	
		cube.build()
	})
	describe('#getUV', ()=>{
		it('should return the average of the closest points orientated in the direction the face stores it', (done)=>{
			face = cube.__children[0]
			value = face.getUV([0.2,0.1])
			expect(value).to.deep.equal([0.49999999999999994, -0.15, -0.2])

			face = cube.__children[1]
			value = face.getUV([0.2,0.1])
			expect(value).to.deep.equal([0.15, -0.49999999999999994, 0.2])

			face = cube.__children[2]
			value = face.getUV([0.2,0.1])
			expect(value).to.deep.equal([-0.15, -0.2, 0.49999999999999994])	

			face = cube.__children[3]
			value = face.getUV([0.2,0.1])
			expect(value).to.deep.equal([-0.49999999999999994, 0.2, 0.15])	

			face = cube.__children[4]
			value = face.getUV([0.2,0.1])
			expect(value).to.deep.equal([-0.2, 0.49999999999999994, -0.15])		

			face = cube.__children[5]
			value = face.getUV([0.2,0.1])
			expect(value).to.deep.equal([0.2, 0.15, -0.49999999999999994])		

			done('need to check the math on uv returned values')					
		})
	})	
})