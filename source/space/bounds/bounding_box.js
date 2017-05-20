import {Bounds} from './bounds';

class BoundingBox extends Bounds {
	constructor(min, max){
		super()
		this.min = min.map((value, index)=> value <= max[index] ? value : max[index] );
		this.max = max.map((value, index)=> value >= min[index] ? value : min[index] );
		this.dimensions = this.min.length;
		this.max.length = this.dimensions;
	}
	measurement(whichDimension){
		if(whichDimension !== undefined) {
			if(whichDimension >= this.dimensions){ return }
			return Math.abs(this.min[whichDimension] - this.max[whichDimension])
		}
		return this.min.map((value, index) => Math.abs(value - this.max[index]) )
	}
	extent(whichDimension){
		if(whichDimension !== undefined) {
			if(whichDimension >= this.dimensions){ return }
			return this.measurement(whichDimension) / 2
		}
		return this.measurement().map((val)=> val/2 )
	}
	center(whichDimension){
		if(whichDimension !== undefined) {
			if(whichDimension >= this.dimensions){ return }
			return (this.min[whichDimension] + this.max[whichDimension]) / 2
		}
		return this.min.map((value, index)=> (value + this.max[index]) / 2 )
	}
	toParams(){
		return [this.center(), this.extent()]
	}
}

export {BoundingBox}
