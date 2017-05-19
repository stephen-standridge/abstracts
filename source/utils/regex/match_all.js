// splits the string into an array of items the regex matches

function matchAll(str, regex){
	let returned = [], match, iteratorString = str.slice();
	while (iteratorString.length > 0) {
		match = iteratorString.match(regex);
		if (match) {
			iteratorString = iteratorString.slice(match.index + 1, iteratorString.length);
			returned.push(match[0]);
		} else {
			iteratorString = iteratorString.slice(1,iteratorString.length);
		}
	}
  return returned;
}

export { matchAll }
