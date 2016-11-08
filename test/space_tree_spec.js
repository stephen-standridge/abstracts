import {expect, assert} from 'chai';
import SpaceTree from '../source/spacetree';
import BoundingBox from '../source/bounding_box';

describe('SpaceTree', ()=>{
	let space_tree, control, min = [0,100,0], max =[100,0,100]
	describe('#new SpaceTree', ()=>{
		before(function(){
			space_tree = new SpaceTree({ region:[min, max], minSize: 5 })					
		})
		it('should create a bounding box with the given dimensions', ()=>{
			expect(space_tree.node.constructor).to.equal(BoundingBox)
			expect(space_tree.node.max).to.have.members([100,100,100])
			expect(space_tree.node.min).to.have.members([0,0,0])
		})
		it('should have traversal properties', ()=>{
			expect(space_tree.node.constructor).to.equal(BoundingBox)
			expect(space_tree.nodeItem.__l).to.equal(0)
			expect(space_tree.nodeItem.__n).to.equal(0)
		})	
		it('should have leaf/branch data', ()=>{
			expect(space_tree.node.constructor).to.equal(BoundingBox)
			expect(space_tree.nodeItem.leaf).to.equal(true)
			expect(space_tree.nodeItem.branch).to.equal(false)
		})			
	})
	describe('#divide', ()=>{
		before(function(){
			space_tree = new SpaceTree({ region:[min, max], minSize: 5 })	
			space_tree.divide()		
		})
		it('should create the appropriate number of children', ()=>{
			expect(space_tree.getChildren('nodeItem').map((item)=> item['__l'] )).to.have.members([1,1,1,1,1,1,1,1])
			expect(space_tree.getChildren('nodeItem').map((item)=> item['__n'] )).to.have.members([0,1,2,3,4,5,6,7])
		})
		it('should evenly divide its bounding box between its children', ()=>{
			let children_max = space_tree.children.map((item)=> item['max']);
			let children_min = space_tree.children.map((item)=> item['min']);
			let children_leaves = space_tree.getChildren('nodeItem').map((item)=> item['leaf'])
			let center = space_tree.root.center(), min = space_tree.root.min, max = space_tree.root.max;

			expect(children_max[0]).to.have.members(center)
			expect(children_max[1]).to.have.members([ max[0], center[1], center[2] ])
			expect(children_max[2]).to.have.members([ max[0], center[1], max[2] ])
			expect(children_max[3]).to.have.members([ center[0], center[1], max[2] ])
			expect(children_max[4]).to.have.members([ center[0], max[1], center[2] ])
			expect(children_max[5]).to.have.members([ max[0], max[1], center[2] ])
			expect(children_max[6]).to.have.members( max )
			expect(children_max[7]).to.have.members([ center[0], max[1], max[2] ])			

			expect(children_min[0]).to.have.members( min )
			expect(children_min[1]).to.have.members([ center[0], min[1], min[2] ])
			expect(children_min[2]).to.have.members([ center[0], min[1], center[2] ])
			expect(children_min[3]).to.have.members([ min[0], min[1], center[2] ])
			expect(children_min[4]).to.have.members([ min[0], center[1], min[2] ])
			expect(children_min[5]).to.have.members([ center[0], center[1], min[2] ])
			expect(children_min[6]).to.have.members( center )
			expect(children_min[7]).to.have.members([ min[0], center[1], center[2] ])

			expect(children_leaves).to.have.members([true,true,true,true,true,true,true,true])

		})
		it('should sort its children into its child nodes', ()=>{

		})
		it('should set its branch to true and leaf to false', ()=>{
			expect(space_tree.rootItem.branch).to.equal(true)
			expect(space_tree.rootItem.leaf).to.equal(false)
		})
	})
	describe('#insert', ()=>{
		it('should insert a given value at the coordinate', ()=>{

		})
		it('should warn about coordinates that dont match', ()=>{

		})
	})
})