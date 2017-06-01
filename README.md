#Abstracts

Abstracts is a collection of abstract data structures, data generation algorithms and mathmatical definitions.

Contained in the structures collection are the following classes:

- Structures
  - Trees
    - NAryTree
    - SpaceTree (octree)
    - GridTree (n-ary tree with branching defined per level)
    - RoseTree
  - Maps
    - CubeMap
    - SquareMap
    - DiamondSquareCubeHeightMap
  - Lsystems
    - lSystemProducer (grammar, rules, and productions)
    - lSystemExecutor (grammar, rules, productions, and instructions)
  - Probability
    - RandomProbabilitySet (randomly chooses an item or items from a set, can reshuffle)
    - DiscreetProbabilitySet (randomly chooses an item or items from a set with a discreet probability defined for each item)
- Space
  - Grids
  	- CubeGrid (a grid mapped geometrically to a defined cube)
  	- SphereGrid (a grid mapped geometrically to a defined sphere)
  - Bounds
    - BoundingBox
    - BoundingSphere
  - Surfaces
    - NurbsSurface
    - RandomNurbsSurface (meh)
- Utils
  - matchAll (regex that returns an array of all unique matches within a string)
  - fisherYatesShuffle
- Math (lacking in depth)
  - Constants
  - Vector
  - Matrix

To get started with development
```
npm install
npm run test:watch
```

To build
```
webpack
```
