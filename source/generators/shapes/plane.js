export function planePositionGenerator({ plane_ranges, plane_detail }){
  let array = []; 
  let xMin=0,xMax=0,
      zMin=0,zMax=0,
      w,d,x,y,z;
  if(plane_ranges.x.length){
    xMin = plane_ranges.x[0];
    xMax = plane_ranges.x[1];
  }
  if(plane_ranges.z.length){
    zMin = plane_ranges.z[0]
    zMax = plane_ranges.z[1]
  }    

  w = Math.abs(xMax - xMin);
  d = Math.abs(zMax - zMin);

  planeIterator(plane_detail, function(indices, percentages){
    x = xMin + (w * percentages[0]);
    y = 0;
    z = zMin + (d * percentages[1])
    array.push(x, y, z)
  })
  return array
}

export function planeIterator([xCount = 1, zCount = 1], callback){
  let x,z, i,k;
  for(i = 0; i< xCount; i++){
    x = xCount-1 == 0 ? 0 : i/(xCount-1);
    for(k=0; k< zCount; k++){
      z = zCount-1 == 0 ? 0 : k/(zCount-1);
      callback([i,k], [x,z])
    }
  }
}

export function planeIndexGenerator({ width, height }, { plane_detail }){
  let x = plane_detail[0];
  let z = plane_detail[1];  
  let array = [];
  for(let i = 0; i< z-1; i++){
    let currentRow = i*z, nextRow = (i+1) *z;
    for(let j=0; j< x-1; j++){
      let current = j+currentRow;
      let next = current + 1;
      let across = j+nextRow;
      let diagonal = across + 1
      array.push(current, next, across)
      array.push(next, diagonal, across)
    }
  }
  return array
}

export function planeUVGenerator({},{ plane_detail: [x,y], limit: l=1 }){
  let array = [];
  for(let i=0; i<y; i++){
    for(let j=0; j<x; j++){
      array.push( (j/(x-1)) * l, (i/(y-1)) * l )
    }
  }
  return array;
}