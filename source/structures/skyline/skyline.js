class SkylineEntry {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
    }
}

class SkylineSegment {
    constructor(x, y, width, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.subSegments = [];
        this.height = height;
        this.entries = [];
    }

    remainingSpace() {
        let maxX = 0;
        for (const e of this.entries) {
            if (e.x + e.width > maxX) {
                maxX = e.x + e.width;
            }
        }
        return this.width - maxX;
    }

    canFit(entry) {
        if (entry.width > this.width) {
            return false;
        }

        if (this.entries.length === 0) {
            return true;
        }

        let maxX = 0;
        for (const e of this.entries) {
            if (e.x + e.width > maxX) {
                maxX = e.x + e.width;
            }
        }

        return entry.width <= this.width - maxX;
    }

    addEntry(entry) {
        let bestSubSegment = null;
        let minWastedSpace = Infinity;
        for (const subSegment of this.subSegments) {
            const wastedSpace = subSegment.canFit(entry);
            if (wastedSpace) {
                minWastedSpace = subSegment.remainingSpace(entry);
                bestSubSegment = subSegment;
            }
        }

        if (bestSubSegment) {
            console.log('sub best')
            bestSubSegment.addEntry(entry);
            return true;
        } else if (this.canFit(entry) && entry.height <= this.height) {
            console.log('sub other', this.x, this.width, this.remainingSpace(), entry.width, this.entries)

            const newSubSegment = new SkylineSegment(this.x + (this.width - this.remainingSpace()), this.y + this.height, entry.width, entry.height);
            // newSubSegment.height = entry.height;
            // newSubSegment.height = entry.height;
            newSubSegment.addEntry(entry);
            this.subSegments.push(newSubSegment);
            this.height += entry.height;
            this.entries.push(entry); // Store the entry in the entries array
            return true;
        } else {
            console.log('return false')
            console.log(this.canFit(entry), entry.height, this.height)
            return false;
        }
    }
}

export class Skyline {
    constructor(maxWidth) {
        this.maxWidth = maxWidth;
        this.segments = [];
        this.height = 0;
    }

    insert(width, height) {
        const entry = new SkylineEntry(width, height);
        let bestSegment = null;
        let minWastedSpace = Infinity;

        for (const segment of this.segments) {
            const wastedSpace = segment.canFit(entry);
            // console.log(segment.width, entry.width, wastedSpace);

            if (wastedSpace) {
                minWastedSpace = segment.remainingSpace(entry);
                bestSegment = segment;
            }
        }

        if (bestSegment) {
            console.log('best')
            return bestSegment.addEntry(entry);
        } else {
            console.log('other')
            const newSegment = new SkylineSegment(0, this.height, this.maxWidth, entry.height);
            newSegment.height = entry.height;
            if (newSegment.addEntry(entry)) {
                this.segments.push(newSegment);
                this.height += entry.height;
                return true;
            } else {
                return false;
            }
        }
    }
}