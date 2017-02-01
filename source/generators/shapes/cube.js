export function cubePositionGenerator({cubic_detail, cubic_ranges}){
  let array = []; 
  let xMin=0,xMax=0,
      yMin=0,yMax=0,
      zMin=0,zMax=0,
      w,h,d,x,y,z;
  if(cubic_ranges.x.length){
    xMin = cubic_ranges.x[0];
    xMax = cubic_ranges.x[1];
  }
  if(cubic_ranges.y.length){
    yMin = cubic_ranges.y[0]
    yMax = cubic_ranges.y[1]
  }  
  if(cubic_ranges.z.length){
    zMin = cubic_ranges.z[0]
    zMax = cubic_ranges.z[1]
  }    

  w = Math.abs(xMax - xMin);
  h = Math.abs(yMax - yMin);
  d = Math.abs(zMax - zMin);

  cubeIterator(cubic_detail, function(indices, percentages){
    x = xMin + (w * percentages[0]);
    y = yMin + (h * percentages[1])
    z = zMin + (d * percentages[2])
    array.push(x, y, z)
  })
  return array
}

export function cubeIterator({x: xCount=1, y: yCount=1, z: zCount=1}, callback){
  let x,y,z, i,j,k;
  for(i = 0; i< xCount; i++){
    x = xCount-1 == 0 ? 0 : i/(xCount-1);
    for(j=0; j< yCount; j++){
      y = yCount-1 == 0 ? 0 : j/(yCount-1);
      for(k=0; k< zCount; k++){
        z = zCount-1 == 0 ? 0 : k/(zCount-1);
        callback([i,j,k], [x,y,z])
      }
    }
  }
}

export function cubeIndexGenerator({cubic_detail}){
  let x = cubic_detail.x;
  let z = cubic_detail.z;
  let array = [];
  for(let i = 0; i< z-1; i++){
    let currentRow = i*z, nextRow = (i+1) *z;
    for(let j=0; j< x-1; j++){
      let current = j+currentRow;
      let next = current + 1;
      let across = j+nextRow;
      let diagonal = across + 1
      array.push(current, across, next)
      array.push(next, diagonal, across)
    }
  }
  return array
}