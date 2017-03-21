  import {NurbsSurface} from './nurbs_surface';
import * as vector from '../../math/vector';

class RandomNurbSurface extends NurbsSurface {
  max(dimension, type='edge'){
    return this[`_${type}_ranges`][dimension][1]
  }
  min(dimension, type='edge'){
    return this[`_${type}_ranges`][dimension][0]
  }
  randomPointInRange(limit = 1){
    let maxX = this.max('x', 'center'), minX = this.min('x', 'center');
    let maxY = this.max('y', 'center'), minY = this.min('y', 'center');
    let maxZ = this.max('z', 'center'), minZ = this.min('z', 'center');
    let rangeX = (maxX - minX), rangeY = (maxY - minY), rangeZ = (maxZ - minZ);
    return [
      Math.random() * ( rangeX * limit) + minX + ((rangeX * (1.0 - limit) ) / 2),
      Math.random() * ( rangeY * limit) + minY + ((rangeY * (1.0 - limit) ) / 2),
      Math.random() * ( rangeZ * limit) + minZ + ((rangeZ * (1.0 - limit) ) / 2),
    ]
  }
  percentFromCenter([x,y]){
    let half_percent_1 = Math.abs(1.0 - (x/((this.dimensions[0] - 1)/2) )),
        half_percent_2 = Math.abs(1.0 - (y/((this.dimensions[1] - 1)/2)));
    return 1.0 - ((half_percent_1 + half_percent_2) / 2.0 )
  }
	generate(){
    this.set(
      [ 0, 0 ],
      [ this.min('x'), this.min('y'), this.max('z'),1 ])
    this.set(
      [ 0, this.dimensions[1] - 1 ],
      [this.max('x'), this.min('y'), this.max('z'),1])
    this.set(
      [ this.dimensions[0] - 1 ,0 ],
      [this.min('x'), this.max('y'), this.min('z'),1])
    this.set(
      [ this.dimensions[0] - 1, this.dimensions[1] - 1 ],
      [this.max('x'), this.max('y'), this.min('z'),1])
    this.generatePoints()
	}
  getOrCreateEdges(coordinates,direction) {
    let opposite = 1.0 - direction;
    //gets or creates the edge points in either an x or y direction
    let edgeIndices = [], cornerIndices = [], closeEdge, farEdge;
    let percent = coordinates[opposite]/(this.dimensions[opposite] -1),
      distance, dir;
    edgeIndices[direction] = coordinates[direction]
    // x == 0
    // y == 1
    // y orientation = when y is locked to edges
    // x orientation = when x is locked to edges
    edgeIndices[direction] = 0
    edgeIndices[opposite] = coordinates[opposite];
    closeEdge = this.get(edgeIndices).filter((e)=>e !== undefined)
    if(closeEdge.length <= 0){
      cornerIndices[direction] = 0
      cornerIndices[opposite] = 0;
      let closeCornerClose = this.get(cornerIndices)

      cornerIndices[opposite] = this.dimensions[opposite] - 1;
      let closeCornerFar = this.get(cornerIndices)
      distance = vector.distance(closeCornerClose, closeCornerFar);
      dir = vector.direction( closeCornerClose, closeCornerFar )

      closeEdge = vector.add( closeCornerClose, vector.multiply( vector.scale( distance, percent), dir ) )
      closeEdge = vector.add( closeEdge, this.randomPointInRange(this.percentFromCenter(edgeIndices)) )
      closeEdge[3] = 1
      this.set(edgeIndices, closeEdge)
    }

    edgeIndices[direction] = this.dimensions[opposite] - 1
    edgeIndices[opposite] = coordinates[opposite];

    farEdge = this.get(edgeIndices).filter((e)=>e !== undefined)
    if(farEdge.length <= 0){
      cornerIndices[direction] = this.dimensions[direction] - 1;
      cornerIndices[opposite] = 0;
      let farCornerClose = this.get(cornerIndices)

      cornerIndices[opposite] = this.dimensions[opposite] - 1;
      let farCornerFar = this.get(cornerIndices)

      distance = vector.distance(farCornerClose, farCornerFar);
      dir = vector.direction( farCornerClose, farCornerFar )

      farEdge = vector.add( farCornerClose, vector.multiply( vector.scale( distance, percent), dir ) )
      farEdge = vector.add( farEdge, this.randomPointInRange(this.percentFromCenter(edgeIndices)) )
      farEdge[3] = 1
      this.set(edgeIndices, farEdge)
    }
    let returned = [closeEdge, farEdge]
    return returned;
  }
  generateControlPoints() {
    let x = this.dimensions[0] - 1;
    let y = this.dimensions[1] - 1
    for(let i = 1; i<=x-1; i++) {
      let xPercent = i/(x-1)
      for(let j = 1; j<=y-1; j++){
        let yPercent = i/(y-1)
        let [closeEdgeX, farEdgeX] = this.getOrCreateEdges([i,j], 0)
        let [closeEdgeY, farEdgeY] = this.getOrCreateEdges([i,j], 1)
        let distanceX = vector.scale( vector.distance(closeEdgeX, farEdgeX), xPercent)
        let distanceY = vector.scale( vector.distance(closeEdgeY, farEdgeY), yPercent)
        let xVal = vector.add( closeEdgeX, vector.multiply( distanceX, vector.direction(closeEdgeX, farEdgeX) ) )
        let yVal = vector.add( closeEdgeY, vector.multiply( distanceY, vector.direction(closeEdgeY, farEdgeY) ) )
        let point = vector.average([ xVal, yVal ])

        point = vector.add( point, this.randomPointInRange( this.percentFromCenter([i,j]) ) )
        point[3] = 1

        this.set([i,j], point)
      }
    }
  }
}

export {RandomNurbSurface}
