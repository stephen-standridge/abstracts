import { GMap } from './gmap.js'

class HyperCube extends GMap {
  constructor() {
    super(4) // 4D hypercube
  }

  // Create a 4D hypercube using gmap operations
  makeHypercube() {
    // A 4D hypercube has 16 vertices, 32 edges, 24 faces, 8 cubes, 1 hypercube
    // We'll build it by creating 16 vertices and connecting them properly
    
    const vertices = []
    // Create 16 darts for the 16 vertices of a 4D hypercube
    for (let i = 0; i < 16; i++) {
      vertices.push(this.createDart())
    }
    
    // Connect vertices based on 4D hypercube topology
    // Each vertex connects to 4 others (differing by 1 bit in binary representation)
    for (let i = 0; i < 16; i++) {
      for (let dim = 0; dim < 4; dim++) {
        const neighbor = i ^ (1 << dim) // Flip bit at position 'dim'
        if (neighbor > i) { // Avoid double-linking
          this.link(vertices[i], vertices[neighbor], dim)
        }
      }
    }
    
    return vertices
  }

  // Get coordinates for a vertex in 4D space
  getVertexCoords(vertexIndex) {
    return [
      (vertexIndex & 1) ? 1 : -1,        // x
      (vertexIndex & 2) ? 1 : -1,        // y  
      (vertexIndex & 4) ? 1 : -1,        // z
      (vertexIndex & 8) ? 1 : -1         // w
    ]
  }

  // Get all edges in the hypercube
  getEdges() {
    const edges = []
    for (let i = 0; i < 16; i++) {
      for (let dim = 0; dim < 4; dim++) {
        const neighbor = i ^ (1 << dim)
        if (neighbor > i) {
          edges.push([i, neighbor, dim])
        }
      }
    }
    return edges
  }
}

export { HyperCube }
