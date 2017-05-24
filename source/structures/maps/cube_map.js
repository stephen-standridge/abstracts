import { CubeGrid } from '../../space/grids/cube_grid'
import { SquareMap } from './square_map'
import { TAU, PI } from '../../math/constants'
import * as vector from '../../math/vector'

class CubeMap extends CubeGrid {
  get NodeType() {
    return SquareMap
  }
  getSTR(str) {
    const [axis, index] = vector.majorAxis(str);
    let majorAxis = [0,0,0], u, v, face;
    majorAxis[index] = -(axis / -Math.abs(axis) )

    face = this.getAxis(majorAxis);
    u = (str[face.minorAxes[0]]* face.direction / Math.abs(axis)+1) * 0.5
    v = (str[face.minorAxes[1]]* face.direction / Math.abs(axis)+1) * 0.5

    return face.getUV([u,v])
  }
  getUV(u,v) {
    //confvert XY to UV
    let x1 = Math.floor(this.this.root.dimensions()[0] * u);
    let x2 = Math.ceil(this.this.root.dimensions()[0] * u);
    let y1 = Math.floor(this.this.root.dimensions()[1] * v);
    let y2 = Math.ceil(this.this.root.dimensions()[1] * v);

    //each of these are modified by the distance the uvs are from this point
    return (this.get([x1, y1]) * (1.0 - ((u + v)/2)) +
      this.get([x2, y1]) * (1.0 - ((1.0 - u + v)/2)) +
      this.get([x2, y2]) * (1.0 - (((1.0 - u) + (1.0 - v))/2)) +
      this.get([x1, y2]) * (1.0 - ((u + (1.0 - v))/2)) ) / 4
  }
}

export { CubeMap }
