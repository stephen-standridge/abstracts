import {surface} from '../curves/nurbs'
import {planeUVGenerator} from './plane';

export function nurbsPropertiesGenerator(){
  return {
    xVerticeCount: 5,
    zVerticeCount: 5,
    degree: 3,
    width: 10,
    depth: 10 
  }
}

export function nurbsControlGenerator(){
  let points = [ -1.0, 1.0,  -2.0, 1.0, -1.0, 1.0, -1.0, 1.0,  -1.0, 1.0, 0.0, 1.0,  -1.0, 1.0, 1.0, 1.0,  -1.0, 1.0, 2.0, 1.0,
                 -0.5, 0.25, -2.0, 1.0, -0.5, 0.25,-1.0, 1.0,  -0.5, 0.25,0.0, 1.0,  -0.5, 0.25,1.0, 1.0,  -0.5, 0.25,2.0, 1.0,
                 0.0,  0.0,  -2.0, 1.0,  0.0, 0.0, -1.0, 1.0,  0.0,  0.0, 0.0, 1.0,  0.0,  0.0, 1.0, 1.0,  0.0,  0.0, 2.0, 1.0,
                 0.5,  0.25, -2.0, 1.0,  0.5, 0.25,-1.0, 1.0,  0.5,  0.25,0.0, 1.0,  0.5,  0.25,1.0, 1.0,  0.5,  0.25,2.0, 1.0,
                 1.0,  1.0,  -2.0, 1.0,  1.0, 1.0, -1.0, 1.0,  1.0,  1.0, 0.0, 1.0,  1.0,  1.0, 1.0, 1.0,  1.0,  1.0, 2.0, 1.0,];
  return points;
}

export function nurbsDataGenerator() {
    var controls = [
      [ [-1.0, -1.0, 0.0, 1.0],
        [-0.5,  0.5, 0.0, 1.0],
        [ 0.5,  0.0, 0.0, 1.0],
        [ 1.0, -0.5, 0.0, 1.0], 
      ],[
        [-1.0,  0.0, 1.0, 1.0],
        [-0.5, -0.5, 1.0, 1.0],
        [ 0.5, -1.0, 1.0, 1.0],
        [ 1.0, -0.5, 1.0, 1.0],
      ],[
        [-1.0, 0.0, 2.0, 1.0],
        [-0.5, 0.5, 2.0, 1.0],
        [ 0.5, 0.0, 2.0, 1.0],
        [ 1.0, 0.5, 2.0, 1.0]
      ]
    ];
    let knots = [
      [0, 0, 0, 1, 1, 1],
      [0, 0, 0, 0, 1, 1, 1, 1]
    ]
    let degrees = [2, 3]
    return { controls, knots, degrees }
}

export function nurbsSurfaceGenerator({ xVerticeCount: x, zVerticeCount: z, degree: d }) {
  let { controls, knots, degrees } = nurbsDataGenerator()
  let currentRow, nextRow, current, across, diagonal, next, u, v;
  let position = [], index = [], uv = [], point;
  let nurb = surface(degrees, knots, controls)
  let resolutionX = x*10;
  let resolutionZ = z*10;

  for( let i = 0; i< resolutionX; i++ ){
    currentRow = i*resolutionX, nextRow = (i+1) *resolutionX;
    u = i/(resolutionX-1);
    for( let j = 0; j< resolutionZ; j++) {
      v = j/(resolutionZ-1);
      point = nurb(u, v);        
      position = position.concat(point)     
      uv.push(u,v)
      if(j < resolutionZ - 1 && i < resolutionX - 1){
        current = j+currentRow,
        next = current + 1,
        across = j+nextRow,
        diagonal = across + 1;
        index.push(current, next, across)
        index.push(next, diagonal, across)          
      }
    }
  }
  //position = [0,0,0, 0,0,1, 0,0,2, 0,0,3, 0,0,4,
           // 1,0,0, 1,0,1, 1,0,2, 1,0,3, 1,0,4,
           // 2,0,0, 2,0,1, 2,0,2, 2,0,3, 2,0,4,
           // 3,0,0, 3,0,1, 3,0,2, 3,0,3, 3,0,4,
           // 4,0,0, 4,0,1, 4,0,2, 4,0,3, 4,0,4 ]
  return { position, index, uv }
}

export function nurbPositionGenerator({edge_ranges, center_ranges, control_counts, degree},{plane_detail: [width, height]}){
  let NS = new RandomNurbSurface( control_counts, degree,  edge_ranges, center_ranges );
  NS.generate()
  let returned = [], iPercent, jPercent;  
  for (let i = 0; i< width; i++) {
    iPercent = i/width;
    for (let j=0; j<height; j++) {
      jPercent = j/height;
      returned = returned.concat(NS.getPoint(iPercent, jPercent))
    }
  }
  return returned  
}
export const nurbsSurfaceUVGenerator = planeUVGenerator;
