import {expect} from 'chai';
import {uniqBy} from 'lodash';
const DiamondSquareHeightCubeMap = abstracts.maps.DiamondSquareHeightCubeMap;

describe('DiamondSquareHeightCubeMap', ()=>{
	let cubeMap, value;
	describe('#new DiamondSquareHeightCubeMap', ()=>{
		before(()=>{
			cubeMap = new DiamondSquareHeightCubeMap(3,[-5,5])	
		})			
		it('should make the resolution a power of 2 + 1', ()=>{
			expect(cubeMap.grid.length).to.equal(486)
		})
		it('should have the right max/min getters', ()=>{
			expect(cubeMap.minHeight).to.equal(-5)
			expect(cubeMap.maxHeight).to.equal(5)
		})
	})
	describe('#build', ()=>{
		beforeEach(()=>{
			cubeMap = new DiamondSquareHeightCubeMap(3,[-5,5])	
			cubeMap.build()
		})		
		it('should fill each face with one number per resolution', ()=>{
			let value = true;
			cubeMap.traverse((height) => {
				value = value && !isNaN(Number(height));
			})
			expect(value).to.equal(true)	
		})
		it('should only generate numbers within the defined range', ()=>{
			let value = true;
			cubeMap.traverse((height) => {
				value = value && cubeMap.minHeight <= height && cubeMap.maxHeight >= height;
			})
			expect(value).to.equal(true)	
		})
	})
})