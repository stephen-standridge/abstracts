import { DiamondSquareHeightMap } from '../../structures/maps';
import { DiamondSquareHeightCubeMap } from '../../structures/maps';

export function generateDiamondSquareHeightMap({ width, height, detail, height_range, roughness }){
  //needs to iterate over width/height and getHeight
  // let HM = new DiamondSquareHeightMap(detail, height_range, roughness );
  let returned = [], iPercent, jPercent;
  // HM.generate()
  // for (let i = 0; i< width; i++) {
  //   iPercent = i/width;
  //   for (let j=0; j<height; j++) {
  //     jPercent = j/height;
  //     returned.push(null,null,null,HM.getHeight(iPercent, jPercent))
  //   }
  // }
  // return returned
  const DiamondSquareHeightCubeMap = abstracts.maps.DiamondSquareHeightCubeMap;
  let height_map = new DiamondSquareHeightCubeMap(4,[0.1,1]);
  height_map.build();  
  for (let i = 0; i< width; i++) {
    iPercent = i/width;
    for (let j=0; j<height; j++) {
      jPercent = j/height;
      returned.push(getUV(height_map, iPercent, jPercent))
    }
  }  

  return returned
}

export function generateDiamondSquareCubeHeightMap(properties) {
  let returned = [
    expandSide(properties, 0), expandSide(properties, 3), 
    expandSide(properties, 4), expandSide(properties, 1), 
    expandSide(properties, 2), expandSide(properties, 5)
  ]
  return returned
}

function expandSide({ height_map, width, height, detail }, index) {
  let returned = [], iPercent, jPercent;  
  for (let i = 0; i< width; i++) {
    iPercent = i/width;
    for (let j=0; j<height; j++) {
      jPercent = j/height;
      returned.push(0.0,0.0,0.0,getSTR(height_map, index, iPercent, jPercent))
    }
  }    
  return returned
}

function getSTR(grid,i,u,v) {
    //confvert XY to UV
    let x1 = Math.floor((grid.root.dimensions()[1] - 1) * u);
    let x2 = Math.ceil((grid.root.dimensions()[1] - 1) * u);
    let y1 = Math.floor((grid.root.dimensions()[2] - 1) * v);
    let y2 = Math.ceil((grid.root.dimensions()[2] - 1) * v);
    //each of these are modified by the distance the uvs are from grid point
    return (grid.get([i,x1, y1]) * (1.0 - ((u + v)/2)) + 
      grid.get([i,x2, y1]) * (1.0 - ((1.0 - u + v)/2)) +
      grid.get([i,x2, y2]) * (1.0 - (((1.0 - u) + (1.0 - v))/2)) +
      grid.get([i,x1, y2]) * (1.0 - ((u + (1.0 - v))/2)) ) / 4
}

function getUV(grid,u,v) {
    //confvert XY to UV
    let x1 = Math.floor((grid.root.dimensions()[1] - 1) * u);
    let x2 = Math.ceil((grid.root.dimensions()[1] - 1) * u);
    let y1 = Math.floor((grid.root.dimensions()[2] - 1) * v);
    let y2 = Math.ceil((grid.root.dimensions()[2] - 1) * v);
    //each of these are modified by the distance the uvs are from grid point
    return (grid.get([0,x1, y1]) * (1.0 - ((u + v)/2)) + 
      grid.get([0,x2, y1]) * (1.0 - ((1.0 - u + v)/2)) +
      grid.get([0,x2, y2]) * (1.0 - (((1.0 - u) + (1.0 - v))/2)) +
      grid.get([0,x1, y2]) * (1.0 - ((u + (1.0 - v))/2)) ) / 4
}

export function testGenerator({ width, height }){
  let returned = [], iPercent, jPercent;  
  for (let i = 0; i< width; i++) {
    iPercent = i/width;
    for (let j=0; j<height; j++) {
      jPercent = j/height;
      returned.push(iPercent*255, jPercent*255, 1.0*255, 255)
    }
  }
  return returned
}