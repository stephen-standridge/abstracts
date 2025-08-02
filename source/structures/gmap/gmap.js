class Dart {
  constructor(id) {
    this.id = id
    this.alpha = new Map() // alpha_i: Dart links between geometries
    this.attributes = new Map() //vertex attributes kind of
  }
}

class GMap {
  constructor(dimension) {
    this.dimension = dimension
    // Darts is an array that contains all dart ids and alpha links contiguously for one dart.
    // The amount of memory a dart takes up is 1-> n+1 where n is the number of dimensions
    // i.e. a dart for a 4Gmap will look like [dart1Id, a0, a1, a2, a3]
    this.darts = []
    this.nextId = 0
  }

  getDartIndex(dartId) {
    const stride = this.dimension + 1
    return dartId * stride
  }

  createDart() {
    const dartId = this.nextId++
    const stride = this.dimension + 1
    const startIndex = dartId * stride
    this.darts[startIndex] = dartId
    for (let i = 1; i < stride; i++) {
      this.darts[startIndex + i] = undefined
    }
    return dartId
  }

  link(dartIdA, dartIdB, alphaIndex) {
    const indexA = this.getDartIndex(dartIdA) + 1 + alphaIndex
    const indexB = this.getDartIndex(dartIdB) + 1 + alphaIndex
    this.darts[indexA] = dartIdB
    this.darts[indexB] = dartIdA
  }

  getAlpha(dartId, alphaIndex) {
    const index = this.getDartIndex(dartId) + 1 + alphaIndex
    return this.darts[index]
  }

  //get orbit for a dart (i.e. all darts in a vertex orbit or all darts in an edge)
  getOrbit(dartId, indices) {
    const visited = new Set()
    const queue = [dartId]
    while (queue.length > 0) {
      const currentId = queue.pop()
      if (!visited.has(currentId)) {
        visited.add(currentId)
        for (let alphaIndex of indices) {
          const neighborId = this.getAlpha(currentId, alphaIndex)
          if (neighborId !== undefined && !visited.has(neighborId)) {
            queue.push(neighborId)
          }
        }
      }
    }
    return [...visited]
  }
}

export { GMap }
