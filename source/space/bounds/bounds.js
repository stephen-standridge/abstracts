import { EPSILON } from '../../math/constants';

class Bounds {
	intersects(arg1, arg2) {
		let [center, extent] = arg1.toParams ? arg1.toParams() : [arg1, arg2]
		extent = extent || 0
		let extents2 = !isNaN(Number(extent)) ? [extent, extent, extent] : extent,
			dmin = 0, min, max,
			center1 = this.center(),
			extents1 = this.extent(),
			dist, contained, overlapping, difference;
		return center.reduce((bool, value, i) => {
			dist = Math.abs(value - center1[i]);
			//a shape is contained if the difference of centers
			//is less than the difference of extents 	
			overlapping = dist - (extents1[i] + extents2[i]) <= EPSILON;
			difference = Math.abs(extents1[i] - extents2[i]);
			contained = dist < difference;
			return bool && (overlapping && !contained)
		}, true)
	}

	contains(arg1, arg2) {
		let [newCenter, newExtent] = arg1.toParams ? arg1.toParams() : [arg1, arg2];
		newExtent = newExtent || 0;
		newExtent = !isNaN(Number(newExtent)) ? [newExtent, newExtent, newExtent] : newExtent;

		let center = this.center(),
			extent = this.extent(),
			dist, contained, difference;
		return newCenter.reduce((bool, value, i) => {
			dist = Math.abs(value - center[i]);
			//a shape is contained if the difference of centers
			//is less than the difference of extents 	
			difference = (extent[i] - newExtent[i]);
			contained = arg2 ? dist < difference : dist <= extent[i];
			return bool && contained
		}, true)
	}

	expand(arg1, arg2) {
		if (this.contains(arg1, arg2)) return false;
		let [newCenter, newExtent] = arg1.toParams ? arg1.toParams() : [arg1, arg2]
		newExtent = newExtent || 0,
			newExtent = !isNaN(Number(newExtent)) ? [newExtent, newExtent, newExtent] : newExtent;
		let center = this.center(),
			extent = this.extent(),
			dist, difference, contained;

		const [outCenter, outEdge] = newCenter.reduce((output, value, i) => {
			dist = Math.abs(value - center[i]);
			//a shape is contained if the difference of centers
			//is less than the difference of extents 	
			difference = (extent[i] - newExtent[i]);
			contained = dist < difference;
			if (contained) {
				output[0][i] = center[i];
				output[1][i] = extent[i];
				return output;
			}

			const newEdge = value + ((Math.sign(value) || 1) * newExtent[i]);
			const oldEdge = center[i] + ((Math.sign(value) || 1) * extent[i]);
			const edgeDiff = Math.abs(oldEdge - newEdge) / 2;
			const dir = newEdge < oldEdge ? -1 : 1;
			output[0][i] = center[i] + (edgeDiff * dir);
			output[1][i] = extent[i] + (edgeDiff);
			return output
		}, [[], []]);
		this.setParams(outCenter, outEdge);
		return true;
	}

	distance(args) {
		let [center2] = args.toParams ? args.toParams() : [args]
		let center1 = this.center();
		let difference = center1.map((value, i) => value - center2[i])
		return Math.sqrt(difference.reduce((sum, value, i) => {
			return sum + (value * value)
		}, 0))
	}
}

export { Bounds }