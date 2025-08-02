// 4D Vector operations and ray-hypercube intersection for 4D hypercube rendering
// Following the functional style of existing vector.js

// Basic 4D vector operations
export function dot4d(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
}

export function length4d(v) {
  return Math.sqrt(dot4d(v, v))
}

export function normalize4d(v) {
  const len = length4d(v)
  return [v[0] / len, v[1] / len, v[2] / len, v[3] / len]
}

export function add4d(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]]
}

export function subtract4d(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]]
}

export function scale4d(v, s) {
  return [v[0] * s, v[1] * s, v[2] * s, v[3] * s]
}

export function distance4d(a, b) {
  return length4d(subtract4d(a, b))
}

// 4D Cross product - returns a 4D vector perpendicular to 3 given 4D vectors
// This is unique to 4D space (3D has 2-vector cross, 4D has 3-vector cross)
export function cross4d(a, b, c) {
  // 4D cross product using determinant expansion
  // Result is perpendicular to all three input vectors
  return [
    // x component
    a[1] * (b[2] * c[3] - b[3] * c[2]) - 
    a[2] * (b[1] * c[3] - b[3] * c[1]) + 
    a[3] * (b[1] * c[2] - b[2] * c[1]),
    
    // y component  
    -a[0] * (b[2] * c[3] - b[3] * c[2]) + 
    a[2] * (b[0] * c[3] - b[3] * c[0]) - 
    a[3] * (b[0] * c[2] - b[2] * c[0]),
    
    // z component
    a[0] * (b[1] * c[3] - b[3] * c[1]) - 
    a[1] * (b[0] * c[3] - b[3] * c[0]) + 
    a[3] * (b[0] * c[1] - b[1] * c[0]),
    
    // w component
    -a[0] * (b[1] * c[2] - b[2] * c[1]) + 
    a[1] * (b[0] * c[2] - b[2] * c[0]) - 
    a[2] * (b[0] * c[1] - b[1] * c[0])
  ]
}

// Ray-hypercube intersection using slab method
// Returns intersection parameter t (distance along ray), or null if no intersection
export function rayIntersectHypercube(rayOrigin, rayDir, hypercubeMin = [-1, -1, -1, -1], hypercubeMax = [1, 1, 1, 1]) {
  let tMin = -Infinity
  let tMax = Infinity
  
  // Check intersection with each pair of parallel hyperplanes (slabs)
  for (let i = 0; i < 4; i++) {
    if (Math.abs(rayDir[i]) < 1e-10) {
      // Ray is parallel to the slab
      if (rayOrigin[i] < hypercubeMin[i] || rayOrigin[i] > hypercubeMax[i]) {
        return null // No intersection
      }
    } else {
      // Calculate intersection distances with the two hyperplanes
      const t1 = (hypercubeMin[i] - rayOrigin[i]) / rayDir[i]
      const t2 = (hypercubeMax[i] - rayOrigin[i]) / rayDir[i]
      
      // Ensure t1 <= t2
      const tNear = Math.min(t1, t2)
      const tFar = Math.max(t1, t2)
      
      tMin = Math.max(tMin, tNear)
      tMax = Math.min(tMax, tFar)
      
      // Early exit if no intersection possible
      if (tMin > tMax) {
        return null
      }
    }
  }
  
  // Return the closest positive intersection
  if (tMax < 0) return null // Hypercube is behind ray
  return tMin >= 0 ? tMin : tMax
}

// Get the intersection point on the hypercube surface
export function rayIntersectHypercubePoint(rayOrigin, rayDir, hypercubeMin = [-1, -1, -1, -1], hypercubeMax = [1, 1, 1, 1]) {
  const t = rayIntersectHypercube(rayOrigin, rayDir, hypercubeMin, hypercubeMax)
  if (t === null) return null
  
  return add4d(rayOrigin, scale4d(rayDir, t))
}

// Determine which face/surface of the hypercube was hit
export function getHypercubeSurfaceInfo(point, hypercubeMin = [-1, -1, -1, -1], hypercubeMax = [1, 1, 1, 1], epsilon = 1e-6) {
  const surfaces = []
  
  // Check which faces the point lies on
  for (let i = 0; i < 4; i++) {
    if (Math.abs(point[i] - hypercubeMin[i]) < epsilon) {
      surfaces.push({ dimension: i, face: 'min', normal: [-1, -1, -1, -1].map((_, j) => j === i ? -1 : 0) })
    } else if (Math.abs(point[i] - hypercubeMax[i]) < epsilon) {
      surfaces.push({ dimension: i, face: 'max', normal: [1, 1, 1, 1].map((_, j) => j === i ? 1 : 0) })
    }
  }
  
  return {
    point: point,
    surfaces: surfaces,
    // The type of surface: vertex (4 faces), edge (3 faces), face (2 faces), cell (1 face)
    surfaceType: surfaces.length === 4 ? 'vertex' : 
                 surfaces.length === 3 ? 'edge' :
                 surfaces.length === 2 ? 'face' : 
                 surfaces.length === 1 ? 'cell' : 'interior'
  }
}

// 4D light attenuation calculation
export function calculateAttenuation4d(lightPos, surfacePos, constant = 1.0, linear = 0.05, quadratic = 0.005) {
  const dist = distance4d(lightPos, surfacePos)
  return 1.0 / (constant + linear * dist + quadratic * dist * dist)
}

// Create a 4D rotation matrix around given plane (2D subspace)
// This is more complex than 3D rotations - 4D has 6 planes of rotation
export function create4DRotationMatrix(angle, plane = 'xy') {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  
  // Identity matrix
  const matrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0], 
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]
  
  // Apply rotation in the specified plane
  switch (plane) {
    case 'xy':
      matrix[0][0] = cos; matrix[0][1] = -sin
      matrix[1][0] = sin; matrix[1][1] = cos
      break
    case 'xz':
      matrix[0][0] = cos; matrix[0][2] = -sin
      matrix[2][0] = sin; matrix[2][2] = cos
      break
    case 'xw':
      matrix[0][0] = cos; matrix[0][3] = -sin
      matrix[3][0] = sin; matrix[3][3] = cos
      break
    case 'yz':
      matrix[1][1] = cos; matrix[1][2] = -sin
      matrix[2][1] = sin; matrix[2][2] = cos
      break
    case 'yw':
      matrix[1][1] = cos; matrix[1][3] = -sin
      matrix[3][1] = sin; matrix[3][3] = cos
      break
    case 'zw':
      matrix[2][2] = cos; matrix[2][3] = -sin
      matrix[3][2] = sin; matrix[3][3] = cos
      break
  }
  
  return matrix
}

// Apply 4D matrix transformation to 4D vector
export function transform4d(matrix, vector) {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2] + matrix[0][3] * vector[3],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2] + matrix[1][3] * vector[3],
    matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2] + matrix[2][3] * vector[3],
    matrix[3][0] * vector[0] + matrix[3][1] * vector[1] + matrix[3][2] * vector[2] + matrix[3][3] * vector[3]
  ]
}

// Project 4D point to 3D using perspective projection
export function project4DTo3D(point4d, distance = 2.0) {
  // Simple perspective projection: divide by (distance - w)
  const w = point4d[3]
  const factor = distance / (distance - w)
  
  return [
    point4d[0] * factor,
    point4d[1] * factor, 
    point4d[2] * factor
  ]
}