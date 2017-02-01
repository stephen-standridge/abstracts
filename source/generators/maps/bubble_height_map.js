import { SpaceTree } from '../../structures/trees';
import { BoundingSphere } from '../../structures/bounds';

export function generateBubbleHeightMap({ min, max, minSize, radius_range, count, detail, roughness }){
  //needs to iterate over width/height and getHeight
  let Octree = new SpaceTree({ region:[min, max], minSize }), best, radius, i = 0, result, sphere;
  while(i < count){
    best = Octree.bestCandidate(i+1);
    radius = (Math.random() * (radius_range[1] - radius_range[0])) + radius_range[0]
    sphere = new BoundingSphere(best, radius);
    result = Octree.insert(sphere);
    if(result){ i++ }
  }
  console.warn('should insert spheres with height map grids')
  console.warn('spacetree should have cube grid')
  console.warn('spheres should project onto spacetree cube')  
  console.warn('spacetree cube grid should normalize to sphere')
}