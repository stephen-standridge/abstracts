import { MaxRectsBinPack, Rect } from "../../../source/structures/max_rect";
import { expect } from 'chai'

describe('MaxRectsBinPack', () => {
    let maxRect;
    beforeEach(() => {
        maxRect = new MaxRectsBinPack(100, 100);
    })

    it('should handle one split', () => {
        maxRect.insert(50, 100, 'hello');
        expect(maxRect.freeRectangles.length).to.equal(1)
        expect(maxRect.freeRectangles[0].x).to.equal(50);
        expect(maxRect.freeRectangles[0].y).to.equal(0);
        expect(maxRect.freeRectangles[0].width).to.equal(50);
        expect(maxRect.freeRectangles[0].height).to.equal(100);
        expect(maxRect.usedRectangles.length).to.equal(1)
        expect(maxRect.usedRectangles[0].x).to.equal(0);
        expect(maxRect.usedRectangles[0].y).to.equal(0);
        expect(maxRect.usedRectangles[0].width).to.equal(50);
        expect(maxRect.usedRectangles[0].height).to.equal(100);
        expect(maxRect.usedRectangles[0].data).to.equal('hello');
    })

    it('should handle two split', () => {
        maxRect.insert(50, 100, 'hello');
        maxRect.insert(20, 75, 'goodbye');

        expect(maxRect.freeRectangles.length).to.equal(2)
        expect(maxRect.freeRectangles[0].x).to.equal(70);
        expect(maxRect.freeRectangles[0].y).to.equal(0);
        expect(maxRect.freeRectangles[0].width).to.equal(30);
        expect(maxRect.freeRectangles[0].height).to.equal(100);

        expect(maxRect.freeRectangles[1].x).to.equal(50);
        expect(maxRect.freeRectangles[1].y).to.equal(75);
        expect(maxRect.freeRectangles[1].width).to.equal(20);
        expect(maxRect.freeRectangles[1].height).to.equal(25);

        expect(maxRect.usedRectangles.length).to.equal(2)
        expect(maxRect.usedRectangles[0].x).to.equal(0);
        expect(maxRect.usedRectangles[0].y).to.equal(0);
        expect(maxRect.usedRectangles[0].width).to.equal(50);
        expect(maxRect.usedRectangles[0].height).to.equal(100);
        expect(maxRect.usedRectangles[0].data).to.equal('hello');

        expect(maxRect.usedRectangles[1].x).to.equal(50);
        expect(maxRect.usedRectangles[1].y).to.equal(0);
        expect(maxRect.usedRectangles[1].width).to.equal(20);
        expect(maxRect.usedRectangles[1].height).to.equal(75);
        expect(maxRect.usedRectangles[1].data).to.equal('goodbye');
    })

    it('should handle three split', () => {
        maxRect.insert(50, 100, 'hello');
        maxRect.insert(20, 75, 'goodbye');
        maxRect.insert(25, 25, 1);
        expect(maxRect.freeRectangles.length).to.equal(3)
        expect(maxRect.freeRectangles[0].x).to.equal(50);
        expect(maxRect.freeRectangles[0].y).to.equal(75);
        expect(maxRect.freeRectangles[0].width).to.equal(20);
        expect(maxRect.freeRectangles[0].height).to.equal(25);

        expect(maxRect.freeRectangles[1].x).to.equal(95);
        expect(maxRect.freeRectangles[1].y).to.equal(0);
        expect(maxRect.freeRectangles[1].width).to.equal(5);
        expect(maxRect.freeRectangles[1].height).to.equal(25);

        expect(maxRect.freeRectangles[2].x).to.equal(70);
        expect(maxRect.freeRectangles[2].y).to.equal(25);
        expect(maxRect.freeRectangles[2].width).to.equal(30);
        expect(maxRect.freeRectangles[2].height).to.equal(75);

        expect(maxRect.usedRectangles.length).to.equal(3)
        expect(maxRect.usedRectangles[0].x).to.equal(0);
        expect(maxRect.usedRectangles[0].y).to.equal(0);
        expect(maxRect.usedRectangles[0].width).to.equal(50);
        expect(maxRect.usedRectangles[0].height).to.equal(100);
        expect(maxRect.usedRectangles[0].data).to.equal('hello');

        expect(maxRect.usedRectangles[1].x).to.equal(50);
        expect(maxRect.usedRectangles[1].y).to.equal(0);
        expect(maxRect.usedRectangles[1].width).to.equal(20);
        expect(maxRect.usedRectangles[1].height).to.equal(75);
        expect(maxRect.usedRectangles[1].data).to.equal('goodbye');

        expect(maxRect.usedRectangles[2].x).to.equal(70);
        expect(maxRect.usedRectangles[2].y).to.equal(0);
        expect(maxRect.usedRectangles[2].width).to.equal(25);
        expect(maxRect.usedRectangles[2].height).to.equal(25);
        expect(maxRect.usedRectangles[2].data).to.equal(1);
    });
    describe('isEdgeBordering', () => {
        it('should test true for horizontal edges', () => {
            const rectA = new Rect(0, 0, 25, 100);
            const rectB = new Rect(25, 10, 25, 90);
            const rectC = new Rect(50, 10, 25, 90);
            const rectD = new Rect(75, 10, 25, 80);
            expect(maxRect.isEdgeBordering(rectA, rectB)).to.equal(false)
            expect(maxRect.isEdgeBordering(rectB, rectA)).to.equal(true)
            expect(maxRect.isEdgeBordering(rectB, rectC)).to.equal(true)
            expect(maxRect.isEdgeBordering(rectC, rectB)).to.equal(true)
            expect(maxRect.isEdgeBordering(rectC, rectD)).to.equal(false)
            expect(maxRect.isEdgeBordering(rectD, rectC)).to.equal(true)
        })

        it('should test true for vertical edges', () => {
            const rectA = new Rect(0, 0, 100, 20);
            const rectB = new Rect(10, 20, 25, 30);
            const rectC = new Rect(10, 50, 25, 30);
            expect(maxRect.isEdgeBordering(rectA, rectB)).to.equal(false)
            expect(maxRect.isEdgeBordering(rectB, rectA)).to.equal(true)
            expect(maxRect.isEdgeBordering(rectB, rectC)).to.equal(true)
            expect(maxRect.isEdgeBordering(rectC, rectB)).to.equal(true)
        })
    })

    it('should handle four split', () => {
        maxRect.insert(50, 100, 'hello');
        maxRect.insert(20, 75, 'goodbye');
        maxRect.insert(25, 25, 1);
        maxRect.insert(50, 10, true)

        expect(maxRect.freeRectangles.length).to.equal(3)
        expect(maxRect.freeRectangles[0].x).to.equal(95);
        expect(maxRect.freeRectangles[0].y).to.equal(0);
        expect(maxRect.freeRectangles[0].width).to.equal(5);
        expect(maxRect.freeRectangles[0].height).to.equal(25);

        expect(maxRect.freeRectangles[1].x).to.equal(70);
        expect(maxRect.freeRectangles[1].y).to.equal(25);
        expect(maxRect.freeRectangles[1].width).to.equal(30);
        expect(maxRect.freeRectangles[1].height).to.equal(50);

        expect(maxRect.freeRectangles[2].x).to.equal(50);
        expect(maxRect.freeRectangles[2].y).to.equal(85);
        expect(maxRect.freeRectangles[2].width).to.equal(50);
        expect(maxRect.freeRectangles[2].height).to.equal(15);


        // expect(maxRect.freeRectangles[2].x).to.equal(70);
        // expect(maxRect.freeRectangles[2].y).to.equal(25);
        // expect(maxRect.freeRectangles[2].width).to.equal(30);
        // expect(maxRect.freeRectangles[2].height).to.equal(75);

        expect(maxRect.usedRectangles.length).to.equal(4)
        expect(maxRect.usedRectangles[0].x).to.equal(0);
        expect(maxRect.usedRectangles[0].y).to.equal(0);
        expect(maxRect.usedRectangles[0].width).to.equal(50);
        expect(maxRect.usedRectangles[0].height).to.equal(100);
        expect(maxRect.usedRectangles[0].data).to.equal('hello');

        expect(maxRect.usedRectangles[1].x).to.equal(50);
        expect(maxRect.usedRectangles[1].y).to.equal(0);
        expect(maxRect.usedRectangles[1].width).to.equal(20);
        expect(maxRect.usedRectangles[1].height).to.equal(75);
        expect(maxRect.usedRectangles[1].data).to.equal('goodbye');

        expect(maxRect.usedRectangles[2].x).to.equal(70);
        expect(maxRect.usedRectangles[2].y).to.equal(0);
        expect(maxRect.usedRectangles[2].width).to.equal(25);
        expect(maxRect.usedRectangles[2].height).to.equal(25);
        expect(maxRect.usedRectangles[2].data).to.equal(1);

        expect(maxRect.usedRectangles[3].x).to.equal(50);
        expect(maxRect.usedRectangles[3].y).to.equal(75);
        expect(maxRect.usedRectangles[3].width).to.equal(50);
        expect(maxRect.usedRectangles[3].height).to.equal(10);
        expect(maxRect.usedRectangles[3].data).to.equal(true);
    });
})