import { expect } from 'chai'
import * as vector4d from '../../source/math/vector/vector4d'

describe('4D Vector Operations', () => {
  describe('#dot4d', () => {
    it('should return the dot product of two 4D vectors', () => {
      const a = [1, 2, 3, 4]
      const b = [5, 6, 7, 8]
      const result = vector4d.dot4d(a, b)
      expect(result).to.equal(70) // 1*5 + 2*6 + 3*7 + 4*8 = 5+12+21+32 = 70
    })

    it('should handle zero vectors', () => {
      const a = [0, 0, 0, 0]
      const b = [1, 2, 3, 4]
      expect(vector4d.dot4d(a, b)).to.equal(0)
    })
  })

  describe('#length4d', () => {
    it('should return the length of a 4D vector', () => {
      const v = [3, 4, 0, 0]
      expect(vector4d.length4d(v)).to.equal(5) // sqrt(9+16) = 5
    })

    it('should handle unit vectors in 4D', () => {
      const v = [1, 0, 0, 0]
      expect(vector4d.length4d(v)).to.equal(1)
    })

    it('should handle the 4D unit vector', () => {
      const v = [0.5, 0.5, 0.5, 0.5]
      expect(vector4d.length4d(v)).to.equal(1) // sqrt(0.25*4) = 1
    })
  })

  describe('#normalize4d', () => {
    it('should create a unit vector from any 4D vector', () => {
      const v = [2, 4, 6, 8]
      const normalized = vector4d.normalize4d(v)
      expect(vector4d.length4d(normalized)).to.be.closeTo(1, 1e-10)
    })

    it('should preserve direction', () => {
      const v = [3, 4, 0, 0]
      const normalized = vector4d.normalize4d(v)
      expect(normalized[0]).to.be.closeTo(0.6, 1e-10) // 3/5
      expect(normalized[1]).to.be.closeTo(0.8, 1e-10) // 4/5
      expect(normalized[2]).to.equal(0)
      expect(normalized[3]).to.equal(0)
    })
  })

  describe('#add4d', () => {
    it('should add two 4D vectors component-wise', () => {
      const a = [1, 2, 3, 4]
      const b = [5, 6, 7, 8]
      const result = vector4d.add4d(a, b)
      expect(result).to.deep.equal([6, 8, 10, 12])
    })
  })

  describe('#subtract4d', () => {
    it('should subtract two 4D vectors component-wise', () => {
      const a = [5, 6, 7, 8]
      const b = [1, 2, 3, 4]
      const result = vector4d.subtract4d(a, b)
      expect(result).to.deep.equal([4, 4, 4, 4])
    })
  })

  describe('#scale4d', () => {
    it('should scale a 4D vector by a scalar', () => {
      const v = [1, 2, 3, 4]
      const result = vector4d.scale4d(v, 2)
      expect(result).to.deep.equal([2, 4, 6, 8])
    })
  })

  describe('#distance4d', () => {
    it('should calculate distance between two 4D points', () => {
      const a = [0, 0, 0, 0]
      const b = [3, 4, 0, 0]
      expect(vector4d.distance4d(a, b)).to.equal(5)
    })

    it('should handle 4D unit distance', () => {
      const a = [0, 0, 0, 0]
      const b = [1, 1, 1, 1]
      expect(vector4d.distance4d(a, b)).to.equal(2) // sqrt(4) = 2
    })
  })

  describe('#cross4d', () => {
    it('should return a vector perpendicular to three input vectors', () => {
      // Use orthogonal basis vectors
      const a = [1, 0, 0, 0]
      const b = [0, 1, 0, 0]
      const c = [0, 0, 1, 0]
      const result = vector4d.cross4d(a, b, c)
      
      // Result should be perpendicular to all three
      expect(vector4d.dot4d(result, a)).to.be.closeTo(0, 1e-10)
      expect(vector4d.dot4d(result, b)).to.be.closeTo(0, 1e-10)
      expect(vector4d.dot4d(result, c)).to.be.closeTo(0, 1e-10)
      
      // Should point in w direction
      expect(result[3]).to.not.equal(0)
    })
  })
})

describe('Ray-Hypercube Intersection', () => {
  describe('#rayIntersectHypercube', () => {
    it('should detect intersection with ray hitting hypercube face', () => {
      const rayOrigin = [0, 0, 0, 2] // Outside hypercube in w direction
      const rayDir = [0, 0, 0, -1]   // Pointing toward hypercube
      const result = vector4d.rayIntersectHypercube(rayOrigin, rayDir)
      
      expect(result).to.be.closeTo(1, 1e-10) // Should hit at t=1 (w=1 face)
    })

    it('should return null for rays missing hypercube', () => {
      const rayOrigin = [2, 2, 2, 2] // Outside hypercube
      const rayDir = [1, 1, 1, 1]    // Pointing away
      const result = vector4d.rayIntersectHypercube(rayOrigin, rayDir)
      
      expect(result).to.be.null
    })

    it('should handle rays starting inside hypercube', () => {
      const rayOrigin = [0, 0, 0, 0] // Center of hypercube
      const rayDir = [1, 0, 0, 0]    // Pointing toward +x face
      const result = vector4d.rayIntersectHypercube(rayOrigin, rayDir)
      
      expect(result).to.be.closeTo(1, 1e-10) // Should hit +x face at x=1
    })

    it('should handle rays parallel to hypercube faces', () => {
      const rayOrigin = [0, 0, 0, 2] // Outside, but ray parallel to w=const planes
      const rayDir = [1, 0, 0, 0]    // Parallel to x axis
      const result = vector4d.rayIntersectHypercube(rayOrigin, rayDir)
      
      expect(result).to.be.null // No intersection
    })
  })

  describe('#rayIntersectHypercubePoint', () => {
    it('should return intersection point on hypercube surface', () => {
      const rayOrigin = [0, 0, 0, 2]
      const rayDir = [0, 0, 0, -1]
      const result = vector4d.rayIntersectHypercubePoint(rayOrigin, rayDir)
      
      expect(result).to.deep.equal([0, 0, 0, 1]) // Point on w=1 face
    })

    it('should return null for no intersection', () => {
      const rayOrigin = [2, 2, 2, 2]
      const rayDir = [1, 1, 1, 1]
      const result = vector4d.rayIntersectHypercubePoint(rayOrigin, rayDir)
      
      expect(result).to.be.null
    })
  })

  describe('#getHypercubeSurfaceInfo', () => {
    it('should identify vertex (corner) points', () => {
      const point = [1, 1, 1, 1] // Corner of hypercube
      const info = vector4d.getHypercubeSurfaceInfo(point)
      
      expect(info.surfaceType).to.equal('vertex')
      expect(info.surfaces).to.have.length(4)
    })

    it('should identify face centers', () => {
      const point = [0, 0, 0, 1] // Center of w=1 face
      const info = vector4d.getHypercubeSurfaceInfo(point)
      
      expect(info.surfaceType).to.equal('cell')
      expect(info.surfaces).to.have.length(1)
      expect(info.surfaces[0].dimension).to.equal(3) // w dimension
    })

    it('should identify edge points', () => {
      const point = [1, 1, 0, 1] // Edge where x=1, y=1, w=1 faces meet
      const info = vector4d.getHypercubeSurfaceInfo(point)
      
      expect(info.surfaceType).to.equal('edge')
      expect(info.surfaces).to.have.length(3)
    })

    it('should identify 2D face centers', () => {
      const point = [1, 0, 0, 1] // Center of edge where x=1, w=1 faces meet
      const info = vector4d.getHypercubeSurfaceInfo(point)
      
      expect(info.surfaceType).to.equal('face')
      expect(info.surfaces).to.have.length(2)
    })
  })
})

describe('4D Lighting and Transformations', () => {
  describe('#calculateAttenuation4d', () => {
    it('should calculate proper attenuation with distance', () => {
      const lightPos = [0, 0, 0, 0]
      const surfacePos = [2, 0, 0, 0] // Distance = 2
      const attenuation = vector4d.calculateAttenuation4d(lightPos, surfacePos, 1.0, 0.1, 0.01)
      
      const expected = 1.0 / (1.0 + 0.1 * 2 + 0.01 * 4) // 1/(1 + 0.2 + 0.04) = 1/1.24
      expect(attenuation).to.be.closeTo(expected, 1e-10)
    })

    it('should handle zero distance', () => {
      const lightPos = [0, 0, 0, 0]
      const surfacePos = [0, 0, 0, 0]
      const attenuation = vector4d.calculateAttenuation4d(lightPos, surfacePos, 1.0, 0.1, 0.01)
      
      expect(attenuation).to.equal(1.0)
    })
  })

  describe('#create4DRotationMatrix', () => {
    it('should create rotation matrix for XY plane', () => {
      const matrix = vector4d.create4DRotationMatrix(Math.PI / 2, 'xy')
      const point = [1, 0, 0, 0]
      const rotated = vector4d.transform4d(matrix, point)
      
      expect(rotated[0]).to.be.closeTo(0, 1e-10)  // cos(90°) = 0
      expect(rotated[1]).to.be.closeTo(1, 1e-10)  // sin(90°) = 1
      expect(rotated[2]).to.equal(0)
      expect(rotated[3]).to.equal(0)
    })

    it('should create rotation matrix for ZW plane', () => {
      const matrix = vector4d.create4DRotationMatrix(Math.PI / 2, 'zw')
      const point = [0, 0, 1, 0]
      const rotated = vector4d.transform4d(matrix, point)
      
      expect(rotated[0]).to.equal(0)
      expect(rotated[1]).to.equal(0)
      expect(rotated[2]).to.be.closeTo(0, 1e-10)  // cos(90°) = 0
      expect(rotated[3]).to.be.closeTo(1, 1e-10)  // sin(90°) = 1
    })
  })

  describe('#project4DTo3D', () => {
    it('should project 4D point to 3D using perspective', () => {
      const point4d = [2, 4, 6, 0] // Point on w=0 plane
      const result = vector4d.project4DTo3D(point4d, 2.0)
      
      // With w=0 and distance=2, factor = 2/(2-0) = 1
      expect(result).to.deep.equal([2, 4, 6])
    })

    it('should handle perspective scaling with non-zero w', () => {
      const point4d = [2, 4, 6, 1] // Point with w=1
      const result = vector4d.project4DTo3D(point4d, 2.0)
      
      // With w=1 and distance=2, factor = 2/(2-1) = 2
      expect(result).to.deep.equal([4, 8, 12])
    })

    it('should handle negative w values', () => {
      const point4d = [1, 2, 3, -1] // Point with w=-1
      const result = vector4d.project4DTo3D(point4d, 2.0)
      
      // With w=-1 and distance=2, factor = 2/(2-(-1)) = 2/3
      expect(result[0]).to.be.closeTo(2/3, 1e-10)
      expect(result[1]).to.be.closeTo(4/3, 1e-10)
      expect(result[2]).to.be.closeTo(2, 1e-10)
    })
  })
})