export class SkylineEntry {
    constructor([x, y]) {
        this.width = x ? x : 0;
        this.height = y ? y : 0;
        this.x = 0;
        this.y = 0;
    }
}

export class SkylineSegment {
    constructor([x, y], width) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
        this.width = width ? width : 0;
        this.height = 0;
        this.segments = [];
        this.entry = null;
    }

    addEntry(entry) {
        //sort segments ascending.
        if (this.segments.length === 0) {
            // this is the first entry added to the segment
            const newSegment = new SkylineSegment([0, this.y], entry.width);
            newSegment.height = entry.height;
            newSegment.entry = entry;
            return true;
        }

        const segmentsWidth = this.segments.reduce((acc, seg) => { return acc + seg.width }, 0);
        if (segmentsWidth + entry.width < this.width) {
            //add a new horizontal segment
            const newSegment = new SkylineSegment([segmentsWidth, this.y], this.width - segmentsWidth);
            const added = newSegment.addEntry(entry);
            if (added) return true;
        }

        this.segments.
        const segmentsByHeight = this.segments.sort((a, b) => a.height - b.height);
        // entry.x = this.x + this.width;
    }

    nestEntry(entry) {
        // iterate over segments, 
    }
}

export class Skyline {
    constructor(binWidth, maxHeight) {
        this.segment = new SkylineSegment([0, 0], binWidth);
        this.maxWidth = binWidth;
        this.maxHeight = maxHeight;
    }

    addEntry(entry) {
        let added = this.segments.reduce((prevAdded, segment) => {
            if (prevAdded) return true;
            return segment.addEntry(entry);
        }, false)

        if (added) return true;
        const segmentsHeight = this.segments.reduce((acc, segment) => {
            return acc + segment.height;
        }, 0);

        const newVerticalSegment = new SkylineSegment([0, segmentsHeight], this.maxWidth);
        added = newVerticalSegment.addEntry(entry);
        if (added) {
            this.segments.push(newVerticalSegment);
            return added;
        } else {
            throw `could not add new entry of width ${entry.width}, maxWidth is ${this.maxWidth}`;
        }

    }
}