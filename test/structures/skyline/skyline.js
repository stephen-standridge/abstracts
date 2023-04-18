import { Skyline } from "../../../source/structures/skyline";
import { expect } from "chai";


const ensureFirst = (skyline) => {
    expect(skyline.segments[0].width).to.equal(100)
    expect(skyline.segments[0].x).to.equal(0)
    expect(skyline.segments[0].y).to.equal(0)
    // expect(skyline.segments[0].entries[0].x).to.equal(0)
    // expect(skyline.segments[0].entries[0].y).to.equal(0)
    // expect(skyline.segments[0].entries[0].width).to.equal(50)
    // expect(skyline.segments[0].entries[0].height).to.equal(100)
}



const ensureSecond = (skyline) => {
    expect(skyline.segments[0].subSegments[0].x).to.equal(50)
    expect(skyline.segments[0].subSegments[0].y).to.equal(0)
    expect(skyline.segments[0].subSegments[0].width).to.equal(50)
    expect(skyline.segments[0].subSegments[0].entries[0].x).to.equal(50)
    expect(skyline.segments[0].subSegments[0].entries[0].y).to.equal(0)
    expect(skyline.segments[0].subSegments[0].entries[0].width).to.equal(20)
    expect(skyline.segments[0].subSegments[0].entries[0].height).to.equal(75)
}

const ensureThird = (skyline) => {
    expect(skyline.segments[0].subSegments[0].entries[1].x).to.equal(70)
    expect(skyline.segments[0].subSegments[0].entries[1].y).to.equal(0)
    expect(skyline.segments[0].subSegments[0].entries[1].width).to.equal(25)
    expect(skyline.segments[0].subSegments[0].entries[1].height).to.equal(25)
}

const ensureFourth = (skyline) => {
    expect(skyline.segments[0].subSegments[0].entries[2].x).to.equal(50)
    expect(skyline.segments[0].subSegments[0].entries[2].y).to.equal(25)
    expect(skyline.segments[0].subSegments[0].entries[2].width).to.equal(50)
    expect(skyline.segments[0].subSegments[0].entries[2].height).to.equal(10)
}

const ensureFifth = (skyline) => {
    expect(skyline.segments[1].x).to.equal(0)
    expect(skyline.segments[1].y).to.equal(100)
    expect(skyline.segments[1].width).to.equal(100)
    expect(skyline.segments[1].entries[0].x).to.equal(0)
    expect(skyline.segments[1].entries[0].y).to.equal(100)
    expect(skyline.segments[1].entries[0].width).to.equal(75)
    expect(skyline.segments[1].entries[0].height).to.equal(20)
}


describe("Skyline", () => {

    let skyline;
    beforeEach(() => {
        skyline = new Skyline(100);
    })

    it('should add a new entry to the skyline', () => {
        const res = skyline.insert(50, 100);
        expect(res).to.equal(true);
        expect(skyline.segments[0].subSegments.length).to.equal(1)
        // expect(skyline.segments[0].subSegments[0].length).to.equal(1)
        ensureFirst(skyline);
        expect(skyline.height).to.equal(100)
    })

    it('should add a new entry to the skyline', () => {
        skyline.insert(50, 100);
        const res = skyline.insert(25, 75);
        expect(res).to.equal(true);
        expect(skyline.segments[0].subSegments.length).to.equal(1)
        ensureFirst(skyline)
        expect(skyline.segments[0].entries.length).to.equal(1)
        expect(skyline.segments[0].subSegments.length).to.equal(1)
        ensureSecond(skyline)
        expect(skyline.height).to.equal(100)
    })

    // it('should add a third entry', () => {
    //     skyline.insert(50, 100);
    //     skyline.insert(25, 75);
    //     skyline.insert(25, 25);
    //     expect(skyline.segments[0].entries.length).to.equal(1)
    //     ensureFirst(skyline)
    //     ensureSecond(skyline)
    //     ensureThird(skyline)
    //     expect(skyline.height).to.equal(100)
    // })
    // it('should add a fourth entry', () => {
    //     skyline.insert(50, 100);
    //     skyline.insert(20, 75);
    //     skyline.insert(25, 25);
    //     skyline.insert(50, 10);
    //     expect(skyline.segments[0].entries.length).to.equal(2)
    //     ensureFirst(skyline)
    //     ensureSecond(skyline)
    //     ensureThird(skyline)
    //     expect(skyline.height).to.equal(100)
    // })
})