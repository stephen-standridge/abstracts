//usage   current = bezier( 0, controls );
const binomialLookup = [
  [1],
  [1,1],
  [1,2,1],
  [1,3,3,1],
  [1,4,6,4,1],
  [1,5,10,10,5,1],
  [1,6,15,20,15,6,1]
];
const pow = Math.pow;

function binomial(n,k){
  while(n >= binomialLookup.length){
    let s = binomialLookup.length
    let nextRow = [];
    nextRow[0] = 1
    for(let i=1, prev=s-1; i<prev; i++){
      nextRow[i] = binomialLookup[prev][i-1] + binomialLookup[prev][i]
    }
    nextRow[s] = 1
    binomialLookup.push(nextRow)    
  }

  return binomialLookup[n][k]  
}

export function bezier( t, controls ){
  let sum = [0,0,0], curveValue, n=controls.length -1, current;
  for (let j = 0; j<controls.length; j++){
    current = controls[j];
    curveValue = binomial(n,j) * pow(1-t, n-j) * pow(t, j)
    sum[0] += current[0] * curveValue
    sum[1] += current[1] * curveValue
    sum[2] += current[2] * curveValue
  }
  return sum
}