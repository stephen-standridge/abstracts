import {filter} from 'lodash';
import {Tree, Node} from './tree';
import guid from './guid';
import BoundingBox from './bounding_box';
import BoundingSphere from './bounding_sphere';

class SpaceTreeNode extends Node {
	constructor(args){
		super(args)
		this.leaf = true;
		this.branch = false;
		this.objects = [];
		this.built = false;
		this.ready = false;
		this.__id = guid()
	}
	add(item){
		this.objects.__id = guid()
		this.objects.push(item)
	}
	remove(item){
		this.objects = this.objects.filter((obj, index)=> obj.__id == item.__id )
	}
}

class SpaceTree extends Tree {
	constructor(args={}){
		args.config = { branches: 8 }
		super(args)
		this.objects = args.objects || [];
		this.root = new BoundingBox(...args.region);
		this.minSize = args.minSize;
	}
	division(index, bBox) {
		let center = bBox ? bBox.center() : this.node.center(),
				min = bBox ? bBox.min : this.node.min,
				max = bBox ? bBox.max : this.node.max, coordinates;
		switch(index){
			case 0:
				coordinates = [min, center]
				break;
			case 1:
				coordinates = [[center[0], min[1], min[2]], [max[0], center[1], center[2]]]
				break;
			case 2:
				coordinates = [[center[0], min[1], center[2]], [max[0], center[1], max[2]]]
				break;
			case 3:
				coordinates = [[min[0], min[1], center[2]], [center[0], center[1], max[2]]]
				break;
			case 4:
				coordinates = [[min[0], center[1], min[2]], [center[0], max[1], center[2]]]
				break;
			case 5:
				coordinates = [[center[0], center[1], min[2]], [max[0], max[1], center[2]]]
				break;
			case 6:
				coordinates = [center, max]
				break;
			case 7:
				coordinates = [[min[0], center[1], center[2]], [center[0], max[1], max[2]]]
				break;

		}
		if(coordinates) return new BoundingBox(...coordinates)
		return 
	}
	insert(inserted, method){	
		let nodeSmallerThanMin = this.node.measurement().reduce((bool, m)=>{ 
			return bool || m <= this.minSize 
		}, false)

		if(nodeSmallerThanMin){ return method ? method(inserted) : this.nodeItem.add(inserted) }

		let bBox, found = false, parent = this.node;

		this.eachChild(function(item, index){
			bBox = this.node || this.division(index, parent)
			if(bBox.contains(inserted)){
				if (!item){ 
					this.node = bBox;					
				}
				found = true								
				return this.insert(inserted, method)			
			}
		})

		if(!found){ 
			return method ? method(inserted) : this.nodeItem.add(inserted) 
		} 
	}
	getClosest(queried){
		if(!this.nodeItem){ return }
		let closest, closestDistance, distance;
		this.nodeItem.objects.forEach((obj,i)=>{
			if(!obj.distance){ return }
			distance = obj.distance(queried)
			if(!closestDistance || distance < closestDistance){
				closestDistance = distance;
				closest = obj;
			}
		})
		return closest;
	}
	closest(queried, method) {
		let nodeSmallerThanMin = this.node.measurement().reduce((bool, m)=>{ 
			return bool || m <= this.minSize 
		}, false)

		if(nodeSmallerThanMin){ 
			return this.getClosest(queried)
		}

		let bBox, found = false, parent = this.node, close;

		this.eachChild(function(item, index){
			bBox = this.node || this.division(index, parent)
			if(bBox.contains(queried)){
				if(!this.node){ return }
				close = this.closest(queried, method)	
				if(close){
					found = true
				}		
			}
		})

		if(!found){ 
			return this.getClosest(queried)
		}
		return close
	}
	makeNode(value) {
		let val = value == undefined? false : value;
		return new SpaceTreeNode({ value: value, node: this.attribute('node'), level: this.attribute('level') })
	}
}

export {SpaceTree, SpaceTreeNode}