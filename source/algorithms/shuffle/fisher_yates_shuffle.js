// returns a new array that is a shuffled version of the given array;

function FYShuffle(array) {
  let n = (array.length - 1), t, i;
  let arr = array.slice()
  while (n) {
    i = Math.random() * n-- | 0; // 0 ≤ i < n

    let item1 = arr[n];
    let item2 = arr[i];
    arr[n] = item2;
    arr[i] = item1;
  }
  return arr;
}

export { FYShuffle };
