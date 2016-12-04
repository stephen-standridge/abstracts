import { CubeGrid } from '../../grids/cube_grid'
import { FaceMap } from '../face/face_map'
import { TAU, PI } from '../../../math/constants'
import * as vector from '../../../math/vector'

class CubeMap extends CubeGrid {
  get NodeType() {
    return FaceMap   
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
}

export { CubeMap }