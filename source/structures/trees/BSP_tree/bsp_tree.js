class BSPNode {
    constructor(x, y, width, height, entry = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.entry = entry;
        this.left = null;
        this.right = null;
    }
}

export class BSP {
    constructor(maxWidth) {
        this.root = new BSPNode(0, 0, maxWidth, 0);
    }

    insert(entry) {
        const inserted = this.insertEntry(this.root, entry);
        if (!inserted) {
            this.growVertically(entry.height);
            this.insert(entry);
        }
    }

    insertEntry(node, entry) {
        //If the entry is taller than current node, return false
        if (entry.height > node.height) {
            return false;
        }

        if (node.left && node.right) {
            // if both left and right exist, try inserting into either of them, starting from left
            return this.insertEntry(node.left, entry) || this.insertEntry(node.right, entry);
        } else {
            if (node.entry) {
                //if it has an etry, it's a leaf node, cannot insert
                return false;
            }

            if (entry.width <= node.width && entry.height <= node.height) {
                //if entry fits within the node, split the node and insert it

                // determine how to split the node based on available width and height
                const widthDifference = node.width - entry.width;
                const heightDifference = node.height - entry.height;

                if (widthDifference >= heightDifference) {
                    //split horizontally

                    node.left = new BSPNode(node.x, node.y, entry.width, node.height);
                    node.right = new BSPNode(node.x + entry.width, node.y, widthDifference, node.height)

                } else {
                    //split vertically
                    node.left = new BSPNode(node.x, node.y, node.width, entry.height);
                    node.right = new BSPNode(node.x, node.y + entry.height, node.width, heightDifference);
                }

                node.left.entry = entry;
                return true;
            }
            return false;
            //TODO organize all nodes from most space to least space
        }
    }

    growVertically(height) {
        const newRoot = new BSPNode(0, 0, this.root.width, this.root.height + height);
        newRoot.left = this.root;
        this.root = newRoot;
    }
}