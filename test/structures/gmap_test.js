import { expect } from 'chai'
import { GMap } from '../../source/structures/gmap/gmap.js'
import { HyperCube } from '../../source/structures/gmap/hypercubegmap.js'

describe('GMap', () => {
  let gmap

  beforeEach(() => {
    gmap = new GMap(3) // 3D gmap for basic tests
  })

  describe('Dart Creation', () => {
    it('should create darts with sequential IDs', () => {
      const dart1 = gmap.createDart()
      const dart2 = gmap.createDart()
      
      expect(dart1).to.equal(0)
      expect(dart2).to.equal(1)
    })

    it('should allocate correct memory stride for darts', () => {
      const dart1 = gmap.createDart()
      const dart2 = gmap.createDart()
      
      // For 3D gmap, stride should be 4 (dartId + 3 alpha links)
      expect(gmap.darts.length).to.be.at.least(8) // 2 darts * 4 stride
    })
  })

  describe('Alpha Links', () => {
    it('should link darts bidirectionally', () => {
      const dart1 = gmap.createDart()
      const dart2 = gmap.createDart()
      
      gmap.link(dart1, dart2, 0)
      
      expect(gmap.getAlpha(dart1, 0)).to.equal(dart2)
      expect(gmap.getAlpha(dart2, 0)).to.equal(dart1)
    })

    it('should handle multiple alpha dimensions', () => {
      const dart1 = gmap.createDart()
      const dart2 = gmap.createDart()
      const dart3 = gmap.createDart()
      
      gmap.link(dart1, dart2, 0)
      gmap.link(dart1, dart3, 1)
      
      expect(gmap.getAlpha(dart1, 0)).to.equal(dart2)
      expect(gmap.getAlpha(dart1, 1)).to.equal(dart3)
    })
  })

  describe('Orbits', () => {
    it('should find connected darts in an orbit', () => {
      const dart1 = gmap.createDart()
      const dart2 = gmap.createDart()
      const dart3 = gmap.createDart()
      
      gmap.link(dart1, dart2, 0)
      gmap.link(dart2, dart3, 0)
      
      const orbit = gmap.getOrbit(dart1, [0])
      
      expect(orbit).to.have.length(3)
      expect(orbit).to.include.members([dart1, dart2, dart3])
    })
  })
})

describe('HyperCube', () => {
  let hypercube

  beforeEach(() => {
    hypercube = new HyperCube()
  })

  describe('4D Hypercube Construction', () => {
    it('should create 16 vertices for 4D hypercube', () => {
      const vertices = hypercube.makeHypercube()
      
      expect(vertices).to.have.length(16)
      expect(hypercube.dimension).to.equal(4)
    })

    it('should connect each vertex to exactly 4 neighbors', () => {
      const vertices = hypercube.makeHypercube()
      
      // Check that each vertex has 4 connections (one per dimension)
      for (let i = 0; i < vertices.length; i++) {
        let connections = 0
        for (let dim = 0; dim < 4; dim++) {
          if (hypercube.getAlpha(vertices[i], dim) !== undefined) {
            connections++
          }
        }
        expect(connections).to.equal(4)
      }
    })

    it('should generate correct 4D coordinates', () => {
      const coords = hypercube.getVertexCoords(0)  // [0,0,0,0] -> [-1,-1,-1,-1]
      expect(coords).to.deep.equal([-1, -1, -1, -1])
      
      const coords15 = hypercube.getVertexCoords(15) // [1,1,1,1] -> [1,1,1,1]
      expect(coords15).to.deep.equal([1, 1, 1, 1])
    })

    it('should create 32 edges total', () => {
      hypercube.makeHypercube()
      const edges = hypercube.getEdges()
      
      expect(edges).to.have.length(32) // 16 vertices * 4 neighbors / 2
    })
  })
}) 