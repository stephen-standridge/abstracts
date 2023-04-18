import { Bounds } from './bounds';

class BoundingBox extends Bounds {
	constructor(min = [0, 0, 0], max = [0, 0, 0]) {
		super()
		if (min.x) min = Object.values(min);
		if (max.y) max = Object.values(max);
		this.min = min.map((value, index) => value <= max[index] ? value : max[index]);
		this.max = max.map((value, index) => value >= min[index] ? value : min[index]);
		this.dimensions = this.min.length;
		this.max.length = this.dimensions;
	}

	size(whichDimension) {
		if (whichDimension !== undefined) {
			if (whichDimension >= this.dimensions) { return }
			return Math.abs(this.min[whichDimension] - this.max[whichDimension])
		}
		return this.min.map((value, index) => Math.abs(value - this.max[index]))
	}

	extent(whichDimension) {
		if (whichDimension !== undefined) {
			if (whichDimension >= this.dimensions) { return }
			return this.size(whichDimension) / 2
		}
		return this.size().map((val) => val / 2)
	}

	center(whichDimension) {
		if (whichDimension !== undefined) {
			if (whichDimension >= this.dimensions) { return }
			return (this.min[whichDimension] + this.max[whichDimension]) / 2
		}
		return this.min.map((value, index) => (value + this.max[index]) / 2)
	}

	union(minMaybe, max) {
		let boundingBox = minMaybe;
		if (Array.isArray(minMaybe)) {
			boundingBox = {
				min: minMaybe,
				max: max
			}
		}
		this.min = this.min.map((min, i) => {
			return Math.min(min, boundingBox.min[i]);
		})
		this.max = this.max.map((max, i) => {
			return Math.max(max, boundingBox.max[i]);
		})
	}

	toParams() {
		return [this.center(), this.extent()]
	}
}

export { BoundingBox }
