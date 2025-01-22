import { Bounds } from './bounds';

class BoundingBox extends Bounds {
    constructor(min = [], max = []) {
        super()
        if (!isNaN(Number(min.x))) min = Object.values(min);
        if (!isNaN(Number(max.x))) max = Object.values(max);
        this.min = min.map((value, index) => value <= max[index] ? value : max[index]);
        this.max = max.map((value, index) => value >= min[index] ? value : min[index]);
        this.dimensions = this.min.length;
        this.max.length = this.dimensions;
    }

    get width() {
        return Math.abs(this.max[0] - this.min[0]);
    }

    get height() {
        return Math.abs(this.max[1] - this.min[1]);
    }

    get depth() {
        return Math.abs(this.max[2] - this.min[2]);
    }
    pad(amount = 0.1) {
        this.min = this.min.map((m) => m - amount);
        this.max = this.max.map((m) => m + amount);
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

    union(newMin, newMax) {
        if (!this.min.length) {
            this.min = newMin.x ? Object.values(newMin) : newMin;
        }
        if (!this.max.length) {
            this.max = newMax.x ? Object.values(newMax) : newMax
        }
        const min = Object.values(newMin);
        const max = Object.values(newMax);
        this.min = [Math.min(min[0], this.min[0]), Math.min(min[1], this.min[1]), Math.min(min[2], this.min[2])];
        this.max = [Math.max(max[0], this.max[0]), Math.max(max[1], this.max[1]), Math.max(max[2], this.max[2])];
    }

	setParams(center, extent) {
		const [min, max] = center.reduce((newMinMax, value, i) => {
			newMinMax[0][i] = value - extent[i];
			newMinMax[1][i] = value + extent[i];

			return newMinMax;
		}, [[0, 0, 0], [0, 0, 0]]);
		this.min = min;
		this.max = max;
	}

    toParams() {
        return [this.center(), this.extent()]
    }
}

export { BoundingBox }
