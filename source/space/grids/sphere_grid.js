import { CubeGrid } from './cube_grid'
import { normalize, subtract, scale, distance } from '../../math/vector'
import { filter, reduce, reduceRight, forEach, forEachRight } from 'lodash'
import { lerp, sphericalToEuler } from '../../math'
// SphereGrid is like CubeGrid, except along a sphere.
// Points are warped along corners of the originating cube.

class WarpedSphereGrid extends CubeGrid {
	build() {
		let direction, axes, percentU, percentV, values = [];
		this.eachFace((face, index) => {
			let percentU, percentV, values = [], axisValue, valuesToSet;
			face.traverse((item, [u, v]) => {
				percentU = u / (face.dimensions()[0] - 1);
				percentU = face.direction > 0 ? percentU : 1.0 - percentU
				percentV = v / (face.dimensions()[1] - 1);
				percentV = face.direction > 0 ? percentV : 1.0 - percentV
				axisValue = this.radius * face.direction

				values[0] = axisValue
				values[1] = ((this.radius * 2) * percentU) - this.radius;
				values[2] = ((this.radius * 2) * percentV) - this.radius;

				valuesToSet = [
					this.center[0] + values[face.axes[0]],
					this.center[1] + values[face.axes[1]],
					this.center[2] + values[face.axes[2]]
				]
				valuesToSet = subtract(valuesToSet, this.center)
				valuesToSet = scale(normalize(valuesToSet), this.radius)
				face.set([u, v], valuesToSet)
			})
		})
	}
}

class SphereGrid extends CubeGrid {
	build() {
		// convert this from simple deformation into spherical coordinate traversal
		let direction, axes, percentU, percentV, values = [];
		this.eachFace((face, index) => {
			let percentU, percentV, values = [], axisValue, valuesToSet, theta, phi, result;
			face.traverse((item, [u, v]) => {

				percentU = u / (face.dimensions()[0] - 1);
				percentU = face.direction > 0 ? percentU : 1.0 - percentU
				percentV = v / (face.dimensions()[1] - 1);
				percentV = face.direction > 0 ? percentV : 1.0 - percentV

				theta = lerp(-Math.PI / 2, Math.PI / 2, percentV);
				phi = lerp(-Math.PI, Math.PI, percentU);

				result = sphericalToEuler(phi, theta, this.radius);

				valuesToSet = result;
				valuesToSet = subtract(valuesToSet, this.center)
				face.set([u, v], valuesToSet)
			})
		})
	}
}

export { WarpedSphereGrid, SphereGrid }
