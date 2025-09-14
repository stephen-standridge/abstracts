// Common 4D helpers: rotation, frustum, camera rays, grid

vec4 inverseRotateVertex4D(vec4 vertex) {
  float x = vertex.x, y = vertex.y, z = vertex.z, w = vertex.w;
  if (rotationZW != 0.0) {
    float c = cos(-rotationZW), s = sin(-rotationZW);
    float nz = z * c - w * s; float nw = z * s + w * c; z = nz; w = nw;
  }
  if (rotationYW != 0.0) {
    float c = cos(-rotationYW), s = sin(-rotationYW);
    float ny = y * c - w * s; float nw = y * s + w * c; y = ny; w = nw;
  }
  if (rotationXW != 0.0) {
    float c = cos(-rotationXW), s = sin(-rotationXW);
    float nx = x * c - w * s; float nw = x * s + w * c; x = nx; w = nw;
  }
  if (rotationYZ != 0.0) {
    float c = cos(-rotationYZ), s = sin(-rotationYZ);
    float ny = y * c - z * s; float nz = y * s + z * c; y = ny; z = nz;
  }
  if (rotationXZ != 0.0) {
    float c = cos(-rotationXZ), s = sin(-rotationXZ);
    float nx = x * c - z * s; float nz = x * s + z * c; x = nx; z = nz;
  }
  if (rotationXY != 0.0) {
    float c = cos(-rotationXY), s = sin(-rotationXY);
    float nx = x * c - y * s; float ny = x * s + y * c; x = nx; y = ny;
  }
  return vec4(x, y, z, w);
}

bool isInsideFrustum4D(vec4 point) {
  vec4 xyzRelative = point - camera4DTarget;
  float wRelative = point.w - camera4DPos.w;
  float xMin = frustumBounds[0][0]; float xMax = frustumBounds[0][1];
  float yMin = frustumBounds[1][0]; float yMax = frustumBounds[1][1];
  float zMin = frustumBounds[2][0]; float zMax = frustumBounds[2][1];
  float wMin = frustumBounds[3][0]; float wMax = frustumBounds[3][1];
  return (xyzRelative.x >= xMin && xyzRelative.x <= xMax &&
          xyzRelative.y >= yMin && xyzRelative.y <= yMax &&
          xyzRelative.z >= zMin && xyzRelative.z <= zMax &&
          wRelative >= wMin && wRelative <= wMax);
}

bool isInside4D(vec4 point) {
  vec4 alignedPoint = inverseRotateVertex4D(point);
  bool insideHypercube;
  if (orthographicMode >= 0) {
    if (orthographicMode == 0) {
      insideHypercube = (alignedPoint.y >= -1.0 && alignedPoint.y <= 1.0 && alignedPoint.z >= -1.0 && alignedPoint.z <= 1.0 && alignedPoint.w >= -1.0 && alignedPoint.w <= 1.0);
    } else if (orthographicMode == 1) {
      insideHypercube = (alignedPoint.x >= -1.0 && alignedPoint.x <= 1.0 && alignedPoint.z >= -1.0 && alignedPoint.z <= 1.0 && alignedPoint.w >= -1.0 && alignedPoint.w <= 1.0);
    } else if (orthographicMode == 2) {
      insideHypercube = (alignedPoint.x >= -1.0 && alignedPoint.x <= 1.0 && alignedPoint.y >= -1.0 && alignedPoint.y <= 1.0 && alignedPoint.w >= -1.0 && alignedPoint.w <= 1.0);
    } else {
      insideHypercube = (alignedPoint.x >= -1.0 && alignedPoint.x <= 1.0 && alignedPoint.y >= -1.0 && alignedPoint.y <= 1.0 && alignedPoint.z >= -1.0 && alignedPoint.z <= 1.0);
    }
  } else {
    insideHypercube = (alignedPoint.x >= -1.0 && alignedPoint.x <= 1.0 && alignedPoint.y >= -1.0 && alignedPoint.y <= 1.0 && alignedPoint.z >= -1.0 && alignedPoint.z <= 1.0 && alignedPoint.w >= -1.0 && alignedPoint.w <= 1.0);
  }
  if (orthographicMode < 0 && insideHypercube && !isInsideFrustum4D(point)) return false;
  return insideHypercube;
}

vec4 getRayOrigin4D(vec2 screenCoord) {
  if (orthographicMode >= 0) {
    if (orthographicMode == 0) {
      float yRange = orthographicBounds[1][1] - orthographicBounds[1][0];
      float zRange = orthographicBounds[2][1] - orthographicBounds[2][0];
      float yCenter = (orthographicBounds[1][1] + orthographicBounds[1][0]) * 0.5;
      float zCenter = (orthographicBounds[2][1] + orthographicBounds[2][0]) * 0.5;
      float yPos = yCenter + screenCoord.x * yRange * 0.25;
      float zPos = zCenter + screenCoord.y * zRange * 0.25;
      return vec4(-6.0, yPos, zPos, 0.0);
    } else if (orthographicMode == 1) {
      float xRange = orthographicBounds[0][1] - orthographicBounds[0][0];
      float zRange = orthographicBounds[2][1] - orthographicBounds[2][0];
      float xCenter = (orthographicBounds[0][1] + orthographicBounds[0][0]) * 0.5;
      float zCenter = (orthographicBounds[2][1] + orthographicBounds[2][0]) * 0.5;
      float xPos = xCenter + screenCoord.x * xRange * 0.25;
      float zPos = zCenter + screenCoord.y * zRange * 0.25;
      return vec4(xPos, -6.0, zPos, 0.0);
    } else if (orthographicMode == 2) {
      float xRange = orthographicBounds[0][1] - orthographicBounds[0][0];
      float yRange = orthographicBounds[1][1] - orthographicBounds[1][0];
      float xCenter = (orthographicBounds[0][1] + orthographicBounds[0][0]) * 0.5;
      float yCenter = (orthographicBounds[1][1] + orthographicBounds[1][0]) * 0.5;
      float xPos = xCenter + screenCoord.x * xRange * 0.25;
      float yPos = yCenter + screenCoord.y * yRange * 0.25;
      return vec4(xPos, yPos, -6.0, 0.0);
    } else {
      float xRange = orthographicBounds[0][1] - orthographicBounds[0][0];
      float yRange = orthographicBounds[1][1] - orthographicBounds[1][0];
      float xCenter = (orthographicBounds[0][1] + orthographicBounds[0][0]) * 0.5;
      float yCenter = (orthographicBounds[1][1] + orthographicBounds[1][0]) * 0.5;
      float xPos = xCenter + screenCoord.x * xRange * 0.25;
      float yPos = yCenter + screenCoord.y * yRange * 0.25;
      return vec4(xPos, yPos, 0.0, -6.0);
    }
  }
  return camera4DPos;
}

vec4 generate4DRayDirection(vec2 screenCoord) {
  if (orthographicMode >= 0) {
    vec4 orthoDirection;
    if (orthographicMode == 0) orthoDirection = vec4(1.0, 0.0, 0.0, 0.0);
    else if (orthographicMode == 1) orthoDirection = vec4(0.0, 1.0, 0.0, 0.0);
    else if (orthographicMode == 2) orthoDirection = vec4(0.0, 0.0, 1.0, 0.0);
    else orthoDirection = vec4(0.0, 0.0, 0.0, 1.0);
    return orthoDirection;
  } else {
    float fov = 0.8;
    vec4 ray4D = camera4DForward;
    vec4 screenX_4D = vec4(1.0, 0.0, 0.0, 0.3);
    vec4 screenY_4D = vec4(0.0, 1.0, 0.2, 0.0);
    ray4D += screenCoord.x * fov * screenX_4D;
    ray4D += screenCoord.y * fov * screenY_4D;
    float distFromCenter = length(screenCoord);
    float wScale = wVariationScale;
    vec4 wVariation = vec4(0.0, 0.0, 0.0, distFromCenter * 0.2 * wScale);
    ray4D += wVariation;
    float length4D = sqrt(ray4D.x*ray4D.x + ray4D.y*ray4D.y + ray4D.z*ray4D.z + ray4D.w*ray4D.w);
    return ray4D / length4D;
  }
}


