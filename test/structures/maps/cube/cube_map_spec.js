import {expect} from 'chai';
import {uniqBy} from 'lodash';
import { CubeMap } from '../../../../source/structures/maps';

describe('CubeMap', ()=>{
	let cube, value;
	beforeEach(()=>{
		cube = new CubeMap([2,2,3], [0,0,0], 1)
		cube.build()
	})
	describe('#getUV', ()=>{
		it('should get the point at the given Vec2')
		it('should average the nearest points')
	})
	// describe('#getSTR', ()=>{
	// 	it('should get the point at the given Vec3', (done)=>{
	// 		value = cube.getSTR([1,0.5,0])
	// 		expect(value).to.deep.equal([ 0.5, 0.125, 0])

	// 		value = cube.getSTR([-1,-0.5,0])
	// 		expect(value).to.deep.equal([-0.5, -0.125, 0])

	// 		value = cube.getSTR([0,1,-0.5])
	// 		expect(value).to.deep.equal([0, 0.5, -0.125])

	// 		value = cube.getSTR([0,-1,-0.5])
	// 		expect(value).to.deep.equal([0, -0.5, -0.125])

	// 		value = cube.getSTR([0,0.5,-1])
	// 		expect(value).to.deep.equal([0, 0.125, -0.5])

	// 		value = cube.getSTR([0,-0.5,-1])
	// 		expect(value).to.deep.equal([0, -0.125, -0.5])
	// 		done('need to check the math on uv returned values')
	// 	})
	// })
})
