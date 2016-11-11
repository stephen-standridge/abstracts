import Bounds from './bounds';

class BoundingSphere extends Bounds {
	constructor(center, radius){
		super()
		this._center = center;
		this.radius = radius
		this.dimensions = this._center.length;
	}
	measurement( dimension ){
		let diameter = this.radius + this.radius;
		if(dimension !== undefined) {
			if(dimension >= this.dimensions){ return }
			return diameter
		}
		return [diameter, diameter, diameter]
	}
	extent( dimension ){
		if(dimension !== undefined) {
			if(dimension >= this.dimensions){ return }
			return this.radius
		}
		return [this.radius, this.radius, this.radius]
	}
	center( dimension ){
		if(dimension !== undefined) {
			return this._center[dimension]
		}
		return this._center
	}
	toParams(){
		return [this.center(), this.radius]
	}
}

export default BoundingSphere
