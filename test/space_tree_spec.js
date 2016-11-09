import {expect, assert} from 'chai';
import {SpaceTree, SpaceTreeNode} from '../source/spacetree';
import BoundingBox from '../source/bounding_box';

describe('SpaceTree', ()=>{
	let space_tree, control, min = [0,40,0], max =[40,0,40], nodes;
	describe('#new SpaceTree', ()=>{
		before(function(){
			space_tree = new SpaceTree({ region:[min, max], minSize: 5 })					
		})
		it('should create a bounding box with the given dimensions', ()=>{
			expect(space_tree.node.constructor).to.equal(BoundingBox)
			expect(space_tree.node.max).to.have.members([40,40,40])
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
	describe('#insert', ()=>{
		beforeEach(()=>{
			space_tree = new SpaceTree({ region:[min, max], minSize: 20 })				
		})
		it('should insert the item as far down the tree as possible', ()=>{
			space_tree = new SpaceTree({ region:[min, max], minSize: 10 })			
			space_tree.insert([8,38,38])
			expect(space_tree.data.length).to.equal(73)

			space_tree.toNth(7)
			nodes = space_tree.children.filter((item)=> item !== undefined )		
			expect(nodes.length).to.equal(1)	

			space_tree.toNth(7)
			expect(space_tree.nodeItem.objects.length).to.equal(1)
		})
		it('should handle objects with a bounds', ()=>{
			let item = new BoundingBox([8,38,38],[11, 38,30])
			space_tree = new SpaceTree({ region:[min, max], minSize: 10 })			
			space_tree.insert(item)
			expect(space_tree.data.length).to.equal(73)

			space_tree.toNth(7)
			nodes = space_tree.children.filter((item)=> item !== undefined )
			console.log(space_tree.data)		
			expect(nodes.length).to.equal(2)	

			space_tree.toNth(7)
			expect(space_tree.nodeItem.objects.length).to.equal(1)		
			console.log(space_tree.nodeItem)	
		})
		it('should handle objects that are not entirely contained', ()=>{

		})		
	})
})