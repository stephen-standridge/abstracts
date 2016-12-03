import { CubeMap } from './cube_map.js'


class DiamondSquareHeightCubeMap extends CubeMap {
  constructor(detail=0, height_range=[0,0], roughness=0){
    let size = Math.pow(2, detail) + 1;
    super(size);
    this.max = size - 1;
    this.roughness = roughness
    this._minHeight = height_range ? height_range[0] : false
    this._maxHeight = height_range ? height_range[1] : 0;    
  }
  get minHeight(){
    return this._minHeight || this.max
  }
  get maxHeight(){
    return this._maxHeight || 0
  }
  get randomNumberInRange(){
    return Math.random() * (this.maxHeight - this.minHeight) + this.minHeight    
  }  
  generate(){
    this.set([0,0],this.maxHeight)
    this.set([this.max,0],this.maxHeight)
    this.set([this.max,this.max],this.minHeight)
    this.set([0,this.max],this.minHeight)  
    this.diamondSquare(this.max)
  }
  diamondSquare(level) {
    let half = level / 2, 
        scale = this.roughness * (level/this.max);

    if (half < 1) return;
    for (let y = half; y < this.max; y += level) {
      for (let x = half; x < this.max; x += level) {
        this.square(x, y, half, this.randomNumberInRange * scale );        
      }
    }
    for (let y = 0; y <= this.max; y += half) {
      for (let x = (y + half) % level; x <= this.max; x += level) {
        this.diamond(x, y, half, this.randomNumberInRange * scale);
      }
    }
    this.diamondSquare(level / 2);
  }
  square(x, y, level, offset) {   
    var ave = this.average([
      this.get([x - level, y - level]),   // upper left
      this.get([x + level, y - level]),   // upper right
      this.get([x + level, y + level]),   // lower right
      this.get([x - level, y + level])    // lower left
    ])
   
    this.set([x, y], ave + offset);
  }

  diamond(x, y, level, offset) {
    var ave = this.average([
      this.get([x-level, y]),      // top
      this.get([x+level, y+(level* 2)]),      // right
      this.get([x+level, y]),      // bottom
      this.get([x, y-level])       // left
    ]);

    this.set([x, y], ave + offset);
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