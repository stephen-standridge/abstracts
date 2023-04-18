import { BSP } from '../../../source/structures/trees/BSP_tree'
import { expect } from 'chai';

describe('BSP Tree', () => {
    let bsp;
    beforeEach(() => {
        bsp = new BSP(100);
    })

    it('should allow adding one node', () => {
        bsp.insert({ width: 50, height: 100 });
        expect(bsp.root.left.x).to.equal(0)
        expect(bsp.root.left.y).to.equal(0)
        expect(bsp.root.left.width).to.equal(50)
        expect(bsp.root.left.height).to.equal(100)
        expect(bsp.root.right.x).to.equal(50)
        expect(bsp.root.right.y).to.equal(0)
        expect(bsp.root.right.width).to.equal(50)
        expect(bsp.root.right.height).to.equal(100)
    });

    it('should allow adding new nodes to the right', () => {
        bsp.insert({ width: 50, height: 100 });
        bsp.insert({ width: 50, height: 75 });

        //first entry is added to the left node
        expect(bsp.root.left.x).to.equal(0)
        expect(bsp.root.left.y).to.equal(0)
        expect(bsp.root.left.width).to.equal(50)
        expect(bsp.root.left.height).to.equal(100)

        //first node divides into second correctly
        expect(bsp.root.right.x).to.equal(50)
        expect(bsp.root.right.y).to.equal(0)
        expect(bsp.root.right.width).to.equal(50)
        expect(bsp.root.right.height).to.equal(100)

        //second entry is added to the left of the right node
        expect(bsp.root.right.left.x).to.equal(50)
        expect(bsp.root.right.left.y).to.equal(0)
        expect(bsp.root.right.left.width).to.equal(50)
        expect(bsp.root.right.left.height).to.equal(75)
    })

    it('should allow subdividing of existing nodes', () => {
        bsp.insert({ width: 50, height: 100 });
        bsp.insert({ width: 20, height: 75 });
        // bsp.insert({ width: 25, height: 25 });

        //first entry is added to the left node
        expect(bsp.root.left.x).to.equal(0)
        expect(bsp.root.left.y).to.equal(0)
        expect(bsp.root.left.width).to.equal(50)
        expect(bsp.root.left.height).to.equal(100)

        //first node divides into second correctly
        expect(bsp.root.right.x).to.equal(50)
        expect(bsp.root.right.y).to.equal(0)
        expect(bsp.root.right.width).to.equal(50)
        expect(bsp.root.right.height).to.equal(100)

        //second entry is added to the left of the right node
        expect(bsp.root.right.left.x).to.equal(50)
        expect(bsp.root.right.left.y).to.equal(0)
        expect(bsp.root.right.left.width).to.equal(20)
        expect(bsp.root.right.left.height).to.equal(100)

        expect(bsp.root.right.right.x).to.equal(70)
        expect(bsp.root.right.right.y).to.equal(0)
        expect(bsp.root.right.right.width).to.equal(30)
        expect(bsp.root.right.right.height).to.equal(100)

        // //third entry is added to the right of the right node
        // expect(bsp.root.right.right.x).to.equal(70)
        // expect(bsp.root.right.right.y).to.equal(0)
        // expect(bsp.root.right.right.width).to.equal(25)
        // expect(bsp.root.right.right.height).to.equal(25)
    })
})