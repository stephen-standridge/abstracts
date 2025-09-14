// Screen-space helpers for wireframe overlay

float pointSegmentDistance2D(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float abLen2 = dot(ab, ab);
  if (abLen2 < 1e-6) return length(p - a);
  float t = clamp(dot(p - a, ab) / abLen2, 0.0, 1.0);
  vec2 closest = a + t * ab;
  return length(p - closest);
}

vec2 project4DToScreen(vec4 p) {
  if (orthographicMode >= 0) {
    float xMin = orthographicBounds[0][0]; float xMax = orthographicBounds[0][1];
    float yMin = orthographicBounds[1][0]; float yMax = orthographicBounds[1][1];
    float zMin = orthographicBounds[2][0]; float zMax = orthographicBounds[2][1];
    float xC = 0.5 * (xMin + xMax); float xR = max(1e-3, xMax - xMin);
    float yC = 0.5 * (yMin + yMax); float yR = max(1e-3, yMax - yMin);
    float zC = 0.5 * (zMin + zMax); float zR = max(1e-3, zMax - zMin);
    vec2 ndc;
    if (orthographicMode == 0) ndc = vec2(2.0 * (p.y - yC) / yR, 2.0 * (p.z - zC) / zR);
    else if (orthographicMode == 1) ndc = vec2(2.0 * (p.x - xC) / xR, 2.0 * (p.z - zC) / zR);
    else if (orthographicMode == 2) ndc = vec2(2.0 * (p.x - xC) / xR, 2.0 * (p.y - yC) / yR);
    else ndc = vec2(2.0 * (p.x - xC) / xR, 2.0 * (p.y - yC) / yR);
    return ndc * 2.0;
  } else {
    // Orthonormalized perspective plane matching ray basis
    vec4 f = normalize(camera4DForward);
    vec4 ax = vec4(1.0, 0.0, 0.0, 0.3);
    vec4 ay = vec4(0.0, 1.0, 0.2, 0.0);
    vec4 axp = ax - f * dot(ax, f);
    vec4 axn = normalize(axp);
    vec4 byp = ay - f * dot(ay, f);
    vec4 byo = byp - axn * dot(byp, axn);
    vec4 byn = normalize(byo);
    vec4 v = p - camera4DPos;
    float depth = max(1e-4, dot(v, f));
    vec4 vperp = v - f * depth;
    float fov = 0.8;
    float sx = dot(vperp, axn) / (depth * fov);
    float sy = dot(vperp, byn) / (depth * fov);
    return vec2(sx, sy) * 2.0;
  }
}

float wireDistanceAttenuation(vec4 p) {
  vec4 f = normalize(camera4DForward);
  float depth = max(0.001, dot(p - camera4DPos, f));
  float att = 1.0 / (1.0 + 0.25 * depth);
  return clamp(att, 0.25, 1.0);
}


