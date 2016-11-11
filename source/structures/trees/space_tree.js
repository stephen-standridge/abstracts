import {filter} from 'lodash';
import Tree from './tree';
import SpaceTreeNode from '../nodes/space_tree_node';
import guid from '../../generators/guid';
import BoundingBox from '../bounds/bounding_box';
import BoundingSphere from '../bounds/bounding_sphere';

class SpaceTree extends Tree {
	constructor(args={}){
		args.config = { branches: 8 }
		super(args)
		this.objects = args.objects || [];
		this.root = new BoundingBox(...args.region);
		this.minSize = args.minSize || 10;
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

		if(nodeSmallerThanMin){ 
			return method ? method(inserted) : this.nodeItem.add(inserted) 
		}

		let bBox, found = false, parent = this.node;

		this.eachChild(function(item, index){
			bBox = this.node || this.division(index, parent)
			if(bBox.contains(inserted)){
				if (!item){ 
					this.node = bBox;					
				}
				found = true								
				this.insert(inserted, method)			
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
	randomPoint(){
		return this.node.measurement().map((m, i)=> (Math.random() * m)  + this.node.min[i] )
	}
	bestCandidate(numCandidates = 10) {
	  let bestCandidate, bestDistance = 0, p, c, d;
	  for (let i = 0; i < numCandidates; ++i) {
	    p = this.randomPoint(),
  		c = this.closest(p),
  		d = c && c.distance ? c.distance(p) : undefined;
	    if (d == undefined || d > bestDistance) {  	
	      bestDistance = d;
	      bestCandidate = p;
	    }
	  }
	  return bestCandidate;
	}		
	makeNode(value) {
		let val = value == undefined? false : value;
		return new SpaceTreeNode({ value: value, node: this.attribute('node'), level: this.attribute('level') })
	}
}
export default SpaceTree