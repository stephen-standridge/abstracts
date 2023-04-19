class SkylineEntry {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
    }
}

class SkylineSegment {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.subSegments = [];
        this.height = 0;
        this.entries = [];
    }

    canFit(entry) {
        return entry.width <= this.width && entry.height <= this.height;
    }

    addEntry(entry) {
        // Try to fit the entry horizontally first
        let canFitHorizontally = false;
        let newEntryX = this.x;
        let newEntryY = this.y;
        for (const existingEntry of this.entries) {
            if (newEntryX + entry.width <= existingEntry.x || existingEntry.x + existingEntry.width <= newEntryX) {
                // There is enough horizontal space between the entries to fit the new entry
                canFitHorizontally = true;
                newEntryY = Math.min(newEntryY, existingEntry.y - entry.height);
                break;
            }
        }

        if (!canFitHorizontally) {
            // Try to fit the entry in a sub-segment
            let bestSubSegment = null;
            let minWastedSpace = Infinity;
            for (const subSegment of this.subSegments) {
                const wastedSpace = subSegment.canFit(entry);
                if (wastedSpace !== false && wastedSpace < minWastedSpace) {
                    minWastedSpace = wastedSpace;
                    bestSubSegment = subSegment;
                }
            }

            if (bestSubSegment) {
                bestSubSegment.addEntry(entry);
                this.height = Math.max(this.height, bestSubSegment.y - this.y + bestSubSegment.height);
            } else {
                // Create a new sub-segment if there is not enough space
                const newSubSegment = new SkylineSegment(this.x, this.y + this.height, this.width);
                newSubSegment.addEntry(entry);
                this.subSegments.push(newSubSegment);
                this.height += newSubSegment.height;
            }
        } else {
            // Add the entry to the current segment
            entry.x = newEntryX;
            entry.y = newEntryY;
            this.entries.push(entry);
            this.height = Math.max(this.height, newEntryY - this.y + entry.height);
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
            if (wastedSpace !== false && wastedSpace < minWastedSpace) {
                minWastedSpace = wastedSpace;
                bestSegment = segment;
            }
        }

        if (bestSegment) {
            return bestSegment.addEntry(entry);
        } else {
            const newSegment = new SkylineSegment(0, this.height, this.maxWidth);
            newSegment.addEntry(entry);
            this.segments.push(newSegment);
            this.height += entry.height;
            return true;
        }
    }
}






