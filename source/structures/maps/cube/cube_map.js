import { CubeGrid } from '../../grids/cube_grid'
import { FaceMap } from '../face/face_map'
import { TAU, PI } from '../../../math/constants'
import * as vector from '../../../math/vector'
  //  major axis
  //   direction     target                             sc     tc    ma
  //   ----------    -------------------------------    ---    ---   ---
      //    +rx      TEXTURE_CUBE_MAP_POSITIVE_X_ARB    -rz    -ry   rx
      //    -rx      TEXTURE_CUBE_MAP_NEGATIVE_X_ARB    +rz    -ry   rx
      //    +ry      TEXTURE_CUBE_MAP_POSITIVE_Y_ARB    +rx    +rz   ry
      //    -ry      TEXTURE_CUBE_MAP_NEGATIVE_Y_ARB    +rx    -rz   ry
      //    +rz      TEXTURE_CUBE_MAP_POSITIVE_Z_ARB    +rx    -ry   rz
      //    -rz      TEXTURE_CUBE_MAP_NEGATIVE_Z_ARB    -rx    -ry   rz

  // s   = ( sc/|ma| + 1 ) / 2
  // t   = ( tc/|ma| + 1 ) / 2


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