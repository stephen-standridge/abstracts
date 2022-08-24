export function eulerToSpherical(x, y, z) {
    const radius = Math.sqrt((x * x) + (y * y) + (z * z))
    return [
        Math.atan2(y, x), //phi
        Math.acos(z / radius), //theta
        radius
    ]
}

export function sphericalToEuler(phi, theta, radius) {
    //theta is inclination
    //phi is azimuth
    return [
        radius * Math.cos(phi) * Math.sin(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(theta)
    ];
}