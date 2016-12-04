import { CubeMap } from './cube_map.js'
import { add, descale } from '../../../math/vector'

class DiamondSquareHeightCubeMap extends CubeMap {
  constructor(detail=0, height_range=[0,0], roughness=1){
    let size = Math.pow(2, detail) + 1;
    super([size,size,1]);
    this.max = size - 1;
    this.roughness = roughness
    this._heightRange = height_range; 
  }
  get minHeight(){
    return this._heightRange[0]
  }
  get maxHeight(){
    return this._heightRange[1]
  }
  get randomNumberInRange(){
    return (Math.random() * (this.maxHeight - this.minHeight)) + this.minHeight    
  }  
  build(){
    this.eachFace((face, faceIndex)=>{
      this.set([faceIndex,0,0],this.randomNumberInRange)
      this.set([faceIndex,this.max,0],this.randomNumberInRange)
      this.set([faceIndex,this.max,this.max],this.randomNumberInRange)
      this.set([faceIndex,0,this.max],this.randomNumberInRange) 
      this.diamondSquare(faceIndex,this.max)  
    })
    this.eachFace((face, faceIndex)=>{
      face.eachEdge((edge, edgeIndex)=>{
        face.setEdge(edgeIndex, descale(add([edge, face.getNextEdge(edgeIndex)]), 2) )
      })
    })    
  }
  diamondSquare(faceIndex,level) {
    let half = level / 2, 
        scale = this.roughness * (level/this.max);

    if (half < 1) return;
    for (let y = half; y < this.max; y += level) {
      for (let x = half; x < this.max; x += level) {
        this.square(faceIndex, x, y, half, this.randomNumberInRange * scale );        
      }
    }
    for (let y = 0; y <= this.max; y += half) {
      for (let x = (y + half) % level; x <= this.max; x += level) {
        this.diamond(faceIndex, x, y, half, this.randomNumberInRange * scale);
      }
    }
    this.diamondSquare(faceIndex, level / 2);
  }
  square(faceIndex, x, y, level, offset) {   
    var ave = this.average([
      this.get([faceIndex, x - level, y - level]),   // upper left
      this.get([faceIndex, x + level, y - level]),   // upper right
      this.get([faceIndex, x + level, y + level]),   // lower right
      this.get([faceIndex, x - level, y + level])    // lower left
    ])
   
    this.set([faceIndex, x, y], ave + offset);
  }

  diamond(faceIndex, x, y, level, offset) {
    var ave = this.average([
      this.get([faceIndex, x-level, y]),      // top
      this.get([faceIndex, x+level, y+(level* 2)]),      // right
      this.get([faceIndex, x+level, y]),      // bottom
      this.get([faceIndex, x, y-level])       // left
    ]);

    this.set([faceIndex, x, y], ave + offset);
  }  
  average(values) {
    if( this.dimensions[2] == 1 ) return this._average(values);
    let total = [];
    let sum = values.reduce((start, val)=>{
      if( val == undefined || !val.length ) return start
      for(let i = 0, v; i<this.dimensions[2]; i++){
        v = val[i]
        if( v !== undefined ){
          start[i] = typeof start[i] == 'number' ? start[i] + v : v;
          total[i] = typeof total[i] == 'number' ? total[i] + 1 : 1;
        }
      }
      return start
    },[]);

    return sum.map((val, i)=> val / total[i] )
  }
  _average(values) {
    let valid = values.filter((val)=> val !== undefined && val !== -1 );
    var total = valid.reduce((sum, val)=>{ return sum + val; }, 0);
    return total / valid.length;
  }  
}

export { DiamondSquareHeightCubeMap }