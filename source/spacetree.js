import Tree from './tree';
import BoundingBox from './bounding_box';
import BoundingSphere from './bounding_sphere';

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
	divide(){
		if(this.branch){ return }

		let currentNode = this.node;
		this.eachChild(function(item, index){
			this.node = this.division(index, currentNode)
		})
		this.nodeItem.leaf = false;
		this.nodeItem.branch = true;
	}
	insert(coordinates, item){
		// {
		// 	/*make sure we're not inserting an object any deeper into the tree than we have to.
		// 		-if the current node is an empty leaf node, just insert and leave it.*/
		// 	if (m_objects.Count <= 1 && m_activeNodes == 0)
		// 	{
		// 		m_objects.Add(Item);
		// 		return;
		// 	}

		// 	Vector3 dimensions = m_region.Max - m_region.Min;
		// 	//Check to see if the dimensions of the box are greater than the minimum dimensions
		// 	if (dimensions.X <= MIN_SIZE && dimensions.Y <= MIN_SIZE && dimensions.Z <= MIN_SIZE)
		// 	{
		// 		m_objects.Add(Item);
		// 		return;
		// 	}
		// 	Vector3 half = dimensions / 2.0f;
		// 	Vector3 center = m_region.Min + half;
		if( coordinates.length !==  this.node.dimensions ) ){
			console.warn('the given coordinates are not in the right dimension')
			return false			
		}
		if( !this.node.contains(item.toParams()) ) {
			console.warn('point not in the defined space')
			return false
		}

		this.eachChild(function(item, index){
			if(item.contains(item.toParams())){

			}
		})

		// 	//First, is the item completely contained within the root bounding box?
		// 	//note2: I shouldn't actually have to compensate for this. If an object is out of our predefined bounds, then we have a problem/error.
		// 	//          Wrong. Our initial bounding box for the terrain is constricting its height to the highest peak. Flying units will be above that.
		// 	//             Fix: I resized the enclosing box to 256x256x256. This should be sufficient.
		// 		bool found = false;
		// 		//we will try to place the object into a child node. If we can't fit it in a child node, then we insert it into the current node object list.
		// 		for(int a=0;a<8;a++)
		// 		{
		// 			//is the object fully contained within a quadrant?
		// 			if (childOctant[a].Contains(Item.BoundingBox) == ContainmentType.Contains)
		// 			{
		// 				if (m_childNode[a] != null)
		// 					m_childNode[a].Insert(Item);   //Add the item into that tree and let the child tree figure out what to do with it
		// 				else
		// 				{
		// 					m_childNode[a] = CreateNode(childOctant[a], Item);   //create a new tree node with the item
		// 					m_activeNodes |= (byte)(1 << a);
		// 				}
		// 				found = true;
		// 			}
		// 		}
		// 		if(!found) m_objects.Add(Item);

		// 	else if (Item.BoundingSphere.Radius != 0 && m_region.Contains(Item.BoundingSphere) == ContainmentType.Contains)
		// 	{
		// 		bool found = false;
		// 		//we will try to place the object into a child node. If we can't fit it in a child node, then we insert it into the current node object list.
		// 		for (int a = 0; a < 8; a++)
		// 		{
		// 			//is the object contained within a child quadrant?
		// 			if (childOctant[a].Contains(Item.BoundingSphere) == ContainmentType.Contains)
		// 			{
		// 				if (m_childNode[a] != null)
		// 					m_childNode[a].Insert(Item);   //Add the item into that tree and let the child tree figure out what to do with it
		// 				else
		// 				{
		// 					m_childNode[a] = CreateNode(childOctant[a], Item);   //create a new tree node with the item
		// 					m_activeNodes |= (byte)(1 << a);
		// 				}
		// 				found = true;
		// 			}
		// 		}
		// 		if (!found) m_objects.Add(Item);
		// 	}
		// 	else
		// 	{
		// 		//either the item lies outside of the enclosed bounding box or it is intersecting it. Either way, we need to rebuild
		// 		//the entire tree by enlarging the containing bounding box
		// 		//BoundingBox enclosingArea = FindBox();
		// 		BuildTree();
		// 	}
	}
	build(){
		// //terminate the recursion if we're a leaf node
		// if (m_objects.Count <= 1)
		// 	return;

		// Vector3 dimensions = m_region.Max - m_region.Min;

		// if (dimensions == Vector3.Zero)
		// {
		// 	FindEnclosingCube();
		// 	dimensions = m_region.Max - m_region.Min;
		// }

		// //Check to see if the dimensions of the box are greater than the minimum dimensions
		// if (dimensions.X <= MIN_SIZE && dimensions.Y <= MIN_SIZE && dimensions.Z <= MIN_SIZE)
		// {
		// 	return;
		// }

		// Vector3 half = dimensions / 2.0f;
		// Vector3 center = m_region.Min + half;		

		// //This will contain all of our objects which fit within each respective octant.
		// List<Physical>[] octList = new List<Physical>[8];
		// for (int i = 0; i < 8; i++) octList[i] = new List<Physical>();

		// //this list contains all of the objects which got moved down the tree and can be delisted from this node.
		// List<Physical> delist = new List<Physical>();

		// foreach (Physical obj in m_objects)
		// {
		// 	if (obj.BoundingBox.Min != obj.BoundingBox.Max)
		// 	{
		// 		for (int a = 0; a < 8; a++)
		// 		{
		// 			if (octant[a].Contains(obj.BoundingBox) == ContainmentType.Contains)
		// 			{
		// 				octList[a].Add(obj);
		// 				delist.Add(obj);
		// 				break;
		// 			}
		// 		}
		// 	}
		// 	else if (obj.BoundingSphere.Radius != 0)
		// 	{
		// 		for (int a = 0; a < 8; a++)
		// 		{
		// 			if (octant[a].Contains(obj.BoundingSphere) == ContainmentType.Contains)
		// 			{
		// 				octList[a].Add(obj);
		// 				delist.Add(obj);
		// 				break;
		// 			}
		// 		}
		// 	}
		// }

		// //delist every moved object from this node.
		// foreach (Physical obj in delist)
		// 	m_objects.Remove(obj);

		// //Create child nodes where there are items contained in the bounding region
		// for (int a = 0; a < 8; a++)
		// {
		// 	if (octList[a].Count != 0)
		// 	{
		// 		m_childNode[a] = CreateNode(octant[a], octList[a]);
		// 		m_activeNodes |= (byte)(1 << a);
		// 		m_childNode[a].BuildTree();
		// 	}
		// }

		// m_treeBuilt = true;
		// m_treeReady = true;		
	}
	update(){
		//processes the insertList
	}
	insert(point){

	}
	makeNode(value) {
		return Object.assign(super.makeNode(value), { branch: false, leaf: true })
	}
}

export default SpaceTree