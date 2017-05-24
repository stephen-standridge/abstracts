import {FaceNode} from '../trees/nodes/face_node'
import {scale, add, descale} from '../../math/vector'

class SquareMap extends FaceNode {
  getUV([u,v]) {
  	let axes = this.minorAxes
  	let maxX = this.dimensions()[0] - 1
  	let maxY = this.dimensions()[1] - 1

    //convert XY to UV
    let x1 = Math.floor(maxX * u);
    let x2 = Math.ceil(maxX * u);
    let y1 = Math.floor(maxY * v);
    let y2 = Math.ceil(maxY * v);

    //average the 4 nearest points.
    return descale( add([
    	scale(this.get([x1, y1]), (1.0 - ((u + v)/2))),
      scale(this.get([x2, y1]), (1.0 - ((1.0 - u + v)/2))),
      scale(this.get([x2, y2]), (1.0 - (((1.0 - u) + (1.0 - v))/2))),
      scale(this.get([x1, y2]), (1.0 - ((u + (1.0 - v))/2)) )
  	]), 4)
  }
}

export { SquareMap }
