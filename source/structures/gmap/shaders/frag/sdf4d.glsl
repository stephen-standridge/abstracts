// SDFs and sphere tracing for 4D

float sdfHypercubeAligned(vec4 alignedPoint) {
  vec4 d = abs(alignedPoint) - vec4(1.0);
  float outside = length(max(d, vec4(0.0)));
  float inside = min(max(max(max(d.x, d.y), max(d.z, d.w)), 0.0), 0.0);
  return outside + inside;
}

vec3 sphereTrace4D(vec2 screenCoord) {
  const float maxDistance = 20.0;
  const int maxSteps = 120;
  const float epsilon = 0.0015;
  const float minStep = 0.01;
  const float maxStep = 0.5;
  vec4 ro = getRayOrigin4D(screenCoord);
  vec4 rd = normalize(generate4DRayDirection(screenCoord));
  float t = 0.0;
  for (int i = 0; i < maxSteps; i++) {
    vec4 p = ro + t * rd;
    vec4 aligned = inverseRotateVertex4D(p);
    float sd = sdfHypercubeAligned(aligned);
    if (sd < epsilon) {
      float distToXPos = abs(aligned.x - 1.0);
      float distToXNeg = abs(aligned.x + 1.0);
      float distToYPos = abs(aligned.y - 1.0);
      float distToYNeg = abs(aligned.y + 1.0);
      float distToZPos = abs(aligned.z - 1.0);
      float distToZNeg = abs(aligned.z + 1.0);
      float distToWPos = abs(aligned.w - 1.0);
      float distToWNeg = abs(aligned.w + 1.0);
      float minDist = min(min(min(distToXPos, distToXNeg), min(distToYPos, distToYNeg)),
                         min(min(distToZPos, distToZNeg), min(distToWPos, distToWNeg)));
      float normalSign = 1.0;
      float surfaceType = 0.0;
      if (minDist == distToXPos) { normalSign = 1.0; surfaceType = 0.0; }
      else if (minDist == distToXNeg) { normalSign = -1.0; surfaceType = 0.0; }
      else if (minDist == distToYPos) { normalSign = 1.0; surfaceType = 1.0; }
      else if (minDist == distToYNeg) { normalSign = -1.0; surfaceType = 1.0; }
      else if (minDist == distToZPos) { normalSign = 1.0; surfaceType = 2.0; }
      else if (minDist == distToZNeg) { normalSign = -1.0; surfaceType = 2.0; }
      else if (minDist == distToWPos) { normalSign = 1.0; surfaceType = 3.0; }
      else { normalSign = -1.0; surfaceType = 3.0; }
      return vec3(t, normalSign, surfaceType);
    }
    if (t > maxDistance) break;
    float stepLen = clamp(sd * 0.9, minStep, maxStep);
    t += stepLen;
  }
  return vec3(-1.0, 0.0, 0.0);
}


