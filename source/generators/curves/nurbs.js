
/*
Finds knot vector span.

p : degree
u : parametric value
U : knot vector

returns the span
*/
function makeSpanFunction( degree, knots ) {
  return function( u ){
    var n = knots.length - degree - 1;

    if ( u >= knots[ n ] ) return n - 1;
    if ( u <= knots[ degree ] ) return degree;

    var low = degree;
    var high = n;
    var mid = Math.floor( ( low + high ) / 2 );

    while ( u < knots[ mid ] || u >= knots[ mid + 1 ] ) {
      
      if ( u < knots[ mid ] ) {
        high = mid;
      } else {
        low = mid;
      }

      mid = Math.floor( ( low + high ) / 2 );

    }
    return mid;
  }
};
    
    
/*
Calculate basis functions. See The NURBS Book, page 70, algorithm A2.2
 
span : span in which u lies
u    : parametric point
p    : degree
U    : knot vector

returns array[p+1] with basis functions values.
*/
function makeBasisFunction( degree, knots ) {
  return function( span, u ) {
    var N = [];
    var left = [];
    var right = [];
    N[ 0 ] = 1.0;

    for ( var j = 1; j <= degree; ++ j ) {
     
      left[ j ] = u - knots[ span + 1 - j ];
      right[ j ] = knots[ span + j ] - u;

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
}

  // degree1, degree2, knots1, knots2, controlPoints, u, v
  export function surface(degrees, knots, controls) {

    let spanU = makeSpanFunction(degrees[0], knots[0]);
    let spanV = makeSpanFunction(degrees[1], knots[1]);
    let basisU =  makeBasisFunction(degrees[0], knots[0]);
    let basisV =  makeBasisFunction(degrees[1], knots[1]);
    return function(u, v) {
      let uSpan = spanU(u)
      let vSpan = spanV(v)
      var Nu = basisU(uSpan, u);
      var Nv = basisV(vSpan, v);

      var temp = [];
      for (var i = 0; i <= degrees[1]; ++ i) {

        temp[ i ] = [0,0,0,0];
        for (var k = 0; k <= degrees[0]; ++ k) {
          var point = controls[ uSpan - degrees[0] + k ][ vSpan - degrees[1] + i ];
          var w = point[3];
          temp[ i ][0] += (point[0] * w) * Nu[ k ];
          temp[ i ][1] += (point[1] * w) * Nu[ k ];
          temp[ i ][2] += (point[2] * w) * Nu[ k ];
          temp[ i ][3] += (point[3] * w) * Nu[ k ];
        }

      }
      var Sw = [ 0, 0, 0, 0 ];
      for ( var i = 0; i <= degrees[1]; ++ i ) {
        Sw[0] += temp[i][0] * Nv[ i ];
        Sw[1] += temp[i][1] * Nv[ i ];
        Sw[2] += temp[i][2] * Nv[ i ];
        Sw[3] += temp[i][3] * Nv[ i ];
      }

      return [ Sw[0]/Sw[3], Sw[1]/Sw[3], Sw[2]/Sw[3] ];
    }
  }  