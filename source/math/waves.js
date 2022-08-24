function wave(period, ampletude, xOffset, yOffset, t) {
    return waveFunc(period, xOffset, t) * (ampletude) + yOffset;
}

function waveFunc(period, offset, t) {
    return Math.sin((t + offset) * 2 * Math.PI / period);
}

function square(period, ampletude, xOffset, yOffset, t) {
    return squareFunc(period, xOffset, t) * (ampletude) + yOffset;
}

function squareFunc(period, offset, t) {
    return Math.sign(Math.sin((t + offset) * 2 * Math.PI / period));
}

function saw(period, ampletude, xOffset, yOffset, t) {
    return sawFunc(period, xOffset, t) * (ampletude) + yOffset;
}

function sawFunc(period, offset, t) {
    return ((t + offset) / period) * 2 - 1;
}

function triangle(period, ampletude, xOffset, yOffset, t) {
    return triangleFunc(period, xOffset, t) * (ampletude) + yOffset;
}

function triangleFunc(period, offset, t) {
    return 1 - (Math.abs(((offset + t) / period) - 0.5)) * 4;
}

export { wave, square, saw, triangle };
