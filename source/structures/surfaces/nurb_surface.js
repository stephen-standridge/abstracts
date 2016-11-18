import {Grid} from '../grids/grid';
import * as vector from '../../math/vector';

class NurbSurface extends Grid {
	constructor(
			size=[0,0],
      degree=[3,3],
			{ x: edge_range_x=[0,0], y: edge_range_y=[0,0], z: edge_range_z=[0,0] }, 
			{ x: center_range_x=[0,0], y: center_range_y= [0,0], z: center_range_z=[0,0]}){

    super(size[0],size[1],4);
    this.degree = degree;
    this._edge_ranges={x:edge_range_x, y:edge_range_y, z:edge_range_z}
    this._center_ranges={x:center_range_x, y:center_range_y, z:center_range_z} 
    this.knots = this.uniformKnotVector();
	}
  basis( span, u, index ) {

    var N = [];
    var left = [];
    var right = [];
    N[ 0 ] = 1.0;

    for ( var j = 1; j <= this.degree[index]; ++ j ) {
     
      left[ j ] = u - this.knots[index][ span + 1 - j ];
      right[ j ] = this.knots[index][ span + j ] - u;

      var saved = 0.0;

      for ( var r = 0; r < j; ++ r ) {

        var rv = right[ r + 1 ];
        var lv = left[ j - r ];
        var temp = N[ r ] / ( rv + lv );
        N[ r ] = saved + rv * temp;
        saved = lv * temp;

       }

       N[ j ] = saved;

     }

     return N;

  }
  span( u,index ){

    let n = this.knots[index].length - this.degree[index];

    if ( u >= this.knots[index][ n ] ) return n - 1;
    if ( u <= this.knots[index][ this.degree[index] ] ) return this.degree[index];

    let low = this.degree[index], 
        high = n,
        mid = Math.floor( ( low + high ) / 2 );

    while ( u < this.knots[index][ mid ] || u >= this.knots[index][ mid + 1 ] ) {
      
      if ( u < this.knots[index][ mid ] ) {
        high = mid;
      } else {
        low = mid;
      }

      mid = Math.floor( ( low + high ) / 2 );

    }
    return mid;
  }
  getPoint(v,u){
    let uSpan, vSpan, Nu, Nv, temp = [], point, w, Sw = [ 0, 0, 0, 0 ];
    u = this.knots[0][0] + u * ( this.knots[0][ this.knots[0].length - 1 ] - this.knots[0][ 0 ] );
    v = this.knots[1][0] + v * ( this.knots[1][ this.knots[1].length - 1 ] - this.knots[1][ 0 ] );
    //get control point span
    uSpan = this.span(u,0), vSpan = this.span(v,1);

    //get control point basis values  
    Nu = this.basis(uSpan, u,0), Nv = this.basis(vSpan, v,1);
    for (let i = 0; i <= this.degree[1]; ++ i) {
      temp[ i ] = [0,0,0,0];
      for (let k = 0; k <= this.degree[0]; ++ k) {
        point = this.get([uSpan - this.degree[0] + k, vSpan - this.degree[1] + i ]);
        w = point[3];
        temp[i] = vector.add(temp[i], vector.scale(point, Nu[k] ))
      }
    }

    for ( let i = 0; i <= this.degree[1]; ++ i ) {
      Sw = vector.add(Sw, vector.scale(temp[i], Nv[i]))
    } 
    let returned = vector.descale(Sw, Sw[3]).slice(0,3);
    return returned
  }
  uniformKnotVector(){
    let knotVectors = [], knotVector, size, degreeIndex, knot, max, min, low, high;
    for( let i = 0; i< this.dimensions.length -1; i++) {
      knotVector = []; 
      size = this.degree[i] + this.dimensions[i];
      degreeIndex = this.degree[i] - 1;
      max = this.dimensions[i] - degreeIndex
      min = 0;      
      for(let k = 0; k< size; k++){
        low = Math.max(k-degreeIndex, min);
        high = Math.min(low, max)/max
        knot = high * this.dimensions[i];
        knotVector[k] = knot
      }
      knotVectors[i] = knotVector
    }
    return knotVectors
  }

}

export {NurbSurface}