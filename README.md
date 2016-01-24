#Basic-Tree

An n-branching tree interface representing a list of data. 


##Installation
```
npm install basic-tree
```

##Usage

```
import Tree from 'basic-tree';

let tree = new Tree({config:{branches: 3}})
/* creates a tree with three branches */

tree.node = 1;

tree.toFirst()
tree.node = 2;

tree.parent

tree.toLast()
tree.node = 3;

tree.toJS()
/* prints [1,2,,3]

```

###Navigation

####toNth() //0 indexed
####toFirst()
####toLast()
####root
####parent

###Setters

####root
####node
####children
####parent

###Traversal

#####preOrderDepth( callback )
#####postOrderDepth( callback )
#####preOrderBreadth( callback )