import { SpaceTree } from "../space_tree";

// an oct tree that resizes to fit the dimensions of the bounding box of its points
// assigns a 0-1 vale that's the point's relative position within the tree.
export class ColorTree extends SpaceTree {
    constructor(args) {
        super(args);
    }
}