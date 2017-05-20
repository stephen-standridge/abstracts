import {Bounds} from './bounds';

class BoundingSphere extends Bounds {
	constructor(center, radius){
		super()
		this._center = center;
		this.radius = radius
		this.dimensions = this._center.length;
	}
	measurement(whichDimension){
		let diameter = this.radius + this.radius;
		if(whichDimension !== undefined) {
			if(whichDimension >= this.dimensions){ return }
			return diameter
		}
		return [diameter, diameter, diameter]
	}
	extent(whichDimension){
		if(whichDimension !== undefined) {
			if(whichDimension >= this.dimensions){ return }
			return this.radius
		}
		return [this.radius, this.radius, this.radius]
	}
	center(whichDimension){
		if(whichDimension !== undefined) {
			return this._center[whichDimension]
		}
		return this._center
	}
	toParams(){
		return [this.center(), this.radius]
	}
}

export {BoundingSphere}
