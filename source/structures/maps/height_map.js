import {Grid} from '../grids/grid.js'


class HeightMap extends Grid{
  constructor(size, height_range, roughness){
    super(size);
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
  getHeight(u,v) {
    //confvert XY to UV
    let x1 = Math.floor(this.max * u);
    let x2 = Math.ceil(this.max * u);
    let y1 = Math.floor(this.max * v);
    let y2 = Math.ceil(this.max * v);

    //each of these are modified by the distance the uvs are from this point
    return (this.get([x1, y1]) * (1.0 - ((u + v)/2)) + 
      this.get([x2, y1]) * (1.0 - ((1.0 - u + v)/2)) +
      this.get([x2, y2]) * (1.0 - (((1.0 - u) + (1.0 - v))/2)) +
      this.get([x1, y2]) * (1.0 - ((u + (1.0 - v))/2)) ) / 4
  }  
}

export { HeightMap }