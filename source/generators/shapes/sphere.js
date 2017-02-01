import {vector} from '../../math';

export function generateSphereAttributes(config, properties){
  // let grid = new SphereGrid(properties.resolution, properties.center, properties.radius)
  let grid = properties.grid;
  let indices = [], uvs= [], colors=[], normals=[];
  let current, next, across, diagonal, currentRow, nextRow, currentFace;  
  grid.traverse(function(item, address){
    normals.push(...vector.unit(vector.subtract(this.root.center, item)))
    colors.push(address[0]/this.root.dimensions()[0], address[1]/this.root.dimensions()[1], address[2]/this.root.dimensions()[2])    
    if(address[0] > this.root.dimensions()[0] - 1) return
    if(address[1] >= this.root.dimensions()[1] - 1) return
    if(address[2] >= this.root.dimensions()[2] - 1) return
    currentFace =  address[0] * this.root.dimensions()[1] * this.root.dimensions()[2];
    currentRow =  address[1] * this.root.dimensions()[1];
    nextRow =  (address[1] + 1) * this.root.dimensions()[1];
    current = address[2] + currentRow + currentFace;
    next = current + 1;
    across = address[2] + nextRow + currentFace;
    diagonal = across + 1;
    indices.push(current, next, across)
    indices.push(next, diagonal, across)
  })
  // console.log(indices.length)
  // console.log(grid.grid.length)
  // console.log(colors.length)
  // console.warn(normals)
  return {
    position:{ arrayType:"Float32Array", array: grid.grid, itemSize:3 },
    index:{ arrayType:"Uint16Array", array: indices, itemSize:1 },
    colors:{ arrayType:"Float32Array", array: colors, itemSize:3 },
    normal: { arrayType:"Float32Array", array: normals, itemSize:3 }
    // uv:{ arrayType:"Float32Array", array: uvs, itemSize:2 }
  }
}