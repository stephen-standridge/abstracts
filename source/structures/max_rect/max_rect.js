export class Rect {
    constructor(x, y, width, height, data = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.data = data;
    }

    get area() {
        return this.width * this.height;
    }

    split(width, height, splitPreference = 'horizontal') {
        const newRectangles = [];

        const remainingWidth = this.width - width;
        const remainingHeight = this.height - height;

        const horizontalSplitArea = remainingWidth * height;
        const verticalSplitArea = remainingHeight * this.width;

        if (horizontalSplitArea <= verticalSplitArea || splitPreference === 'horizontal') {
            if (remainingWidth > 0) {
                newRectangles.push(new Rect(this.x + width, this.y, remainingWidth, this.height));
            }
            if (remainingHeight > 0) {
                newRectangles.push(new Rect(this.x, this.y + height, width, remainingHeight));
            }
        } else {
            if (remainingHeight > 0) {
                newRectangles.push(new Rect(this.x, this.y + height, this.width, remainingHeight));
            }
            if (remainingWidth > 0) {
                newRectangles.push(new Rect(this.x + width, this.y, remainingWidth, height));
            }
        }

        return newRectangles;
    }
}



export class MaxRectsBinPack {
    constructor(width, height) {
        this.binWidth = width;
        this.binHeight = height;
        this.freeRectangles = [new Rect(0, 0, width, height)];
        this.usedRectangles = [];
    }

    insert(width, height, data) {

        let bestRectIndex = -1;
        let bestRect = null;
        for (let i = 0; i < this.freeRectangles.length; i++) {
            const rect = this.freeRectangles[i];
            if (rect.width >= width && rect.height >= height) {
                if (bestRectIndex === -1 || rect.area < bestRect.area) {
                    bestRectIndex = i;
                    bestRect = rect;
                }
            }
        }

        if (bestRectIndex === -1) {
            return false;
        }

        const newRectangles = bestRect.split(width, height);

        this.freeRectangles.splice(bestRectIndex, 1);
        newRectangles.forEach((rect) => this.freeRectangles.push(rect));

        this.usedRectangles.push(new Rect(bestRect.x, bestRect.y, width, height, data));
        this.freeRectangles = this.mergeFreeRectangles(this.freeRectangles);
        return true;
    }

    getOccupancy() {
        let usedArea = 0;
        for (const rect of this.usedRectangles) {
            usedArea += rect.area;
        }

        return usedArea / (this.binWidth * this.binHeight)
    }

    isEdgeBordering(rectA, rectB) {
        // Check if rectA's right edge is bordering rectB's left edge
        const rightEdgeA = rectA.x + rectA.width;
        const borderingRightToLeft = rightEdgeA === rectB.x && (rectA.y >= rectB.y && rectA.y + rectA.height <= rectB.y + rectB.height);

        // Check if rectA's left edge is bordering rectB's right edge
        const rightEdgeB = rectB.x + rectB.width;
        const borderingLeftToRight = rectA.x === rightEdgeB && (rectA.y >= rectB.y && rectA.y + rectA.height <= rectB.y + rectB.height);

        // Check if rectA's top edge is bordering rectB's bottom edge
        const topEdgeA = rectA.y + rectA.height;
        const borderingTopToBottom = topEdgeA === rectB.y && (rectA.x >= rectB.x && rectA.x + rectA.width <= rectB.x + rectB.width);

        // Check if rectA's bottom edge is bordering rectB's top edge
        const topEdgeB = rectB.y + rectB.height;
        const borderingBottomToTop = rectA.y === topEdgeB && (rectA.x >= rectB.x && rectA.x + rectA.width <= rectB.x + rectB.width);

        return borderingRightToLeft || borderingLeftToRight || borderingTopToBottom || borderingBottomToTop;
    }

    mergeFreeRectangles(freeRectangles) {
        const mergedRectangles = [];

        for (const rectA of freeRectangles) {
            let merged = false;
            for (const rectB of freeRectangles) {
                if (rectA === rectB) continue;

                if (this.isEdgeBordering(rectA, rectB)) {
                    if (rectA.area >= rectB.area) {
                        const left = Math.min(rectA.x, rectB.x);
                        const right = Math.max(rectA.x + rectA.width, rectB.x + rectB.width);
                        const top = Math.min(rectA.y, rectB.y);
                        const bottom = Math.max(rectA.y + rectA.height, rectB.y + rectB.height);

                        const newWidth = right - left;
                        const newHeight = bottom - top;
                        if (rectA.width <= newWidth &&
                            rectB.y <= rectA.y &&
                            rectB.y + rectB.height <= rectA.y + rectA.height
                        ) {
                            //vertical border between two means the bigger area grows horizontally
                            rectA.width = newWidth;
                            rectB.height -= rectA.height;
                            merged = true;
                        }
                        if (rectA.height <= newHeight &&
                            rectB.x <= rectA.x &&
                            rectB.x + rectB.width <= rectA.x + rectA.width
                        ) {
                            //vertical border between two means the bigger area grows horizontally
                            rectA.height = newHeight;
                            rectB.width -= rectA.width;
                            merged = true;
                        }
                    }
                }
            }

            mergedRectangles.push(rectA);
        }

        return mergedRectangles.filter(rect => rect.width > 0 && rect.height > 0);

    }
    printRectangles() {
        const { binWidth, binHeight, freeRectangles, usedRectangles } = this;
        let grid = new Array(binHeight).fill(null).map(() => new Array(binWidth).fill('.'));

        // Fill the grid with "F" for free rectangles
        for (let i = 0; i < freeRectangles.length; i++) {
            const rect = freeRectangles[i];
            for (let y = rect.y; y < rect.y + rect.height; y++) {
                for (let x = rect.x; x < rect.x + rect.width; x++) {
                    grid[y][x] = `${i}`;
                }
            }
        }

        // Fill the grid with "U" for used rectangles
        for (const rect of usedRectangles) {
            for (let y = rect.y; y < rect.y + rect.height; y++) {
                for (let x = rect.x; x < rect.x + rect.width; x++) {
                    grid[y][x] = 'U';
                }
            }
        }

        // Print the grid in the console
        console.log('-'.repeat(binWidth + 2));
        for (const row of grid) {
            console.log('|' + row.join('') + '|');
        }
        console.log('-'.repeat(binWidth + 2));
    }
}