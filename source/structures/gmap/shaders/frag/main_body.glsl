// Material helpers for hypercube shading
float getLightingFactor(vec4 vertex4D) {
  float distance4D = length(vertex4D - light4DPos);
  return 1.0 / (1.0 + distance4D * 0.3);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 coord = (uv - 0.5) * 4.0; // Screen coordinates [-2, 2]

  vec3 color = vec3(0.05, 0.05, 0.1);

  // Orthographic mode visualization and grid
  if (orthographicMode >= 0) {
    if (orthographicMode == 0) color = mix(color, vec3(0.4, 0.1, 0.1), 0.6);
    else if (orthographicMode == 1) color = mix(color, vec3(0.1, 0.4, 0.1), 0.6);
    else if (orthographicMode == 2) color = mix(color, vec3(0.1, 0.1, 0.4), 0.6);
    else if (orthographicMode == 3) color = mix(color, vec3(0.4, 0.4, 0.1), 0.6);

    float xBoundsRange = 6.0;
    float yBoundsRange = 6.0;
    if (orthographicMode == 0) {
      xBoundsRange = orthographicBounds[1][1] - orthographicBounds[1][0];
      yBoundsRange = orthographicBounds[2][1] - orthographicBounds[2][0];
    } else if (orthographicMode == 1) {
      xBoundsRange = orthographicBounds[0][1] - orthographicBounds[0][0];
      yBoundsRange = orthographicBounds[2][1] - orthographicBounds[2][0];
    } else if (orthographicMode == 2) {
      xBoundsRange = orthographicBounds[0][1] - orthographicBounds[0][0];
      yBoundsRange = orthographicBounds[1][1] - orthographicBounds[1][0];
    } else if (orthographicMode == 3) {
      xBoundsRange = orthographicBounds[0][1] - orthographicBounds[0][0];
      yBoundsRange = orthographicBounds[1][1] - orthographicBounds[1][0];
    }
    float gridSizeX = 20.0 * (xBoundsRange / 6.0);
    float gridSizeY = 20.0 * (yBoundsRange / 6.0);
    float grid = abs(sin(gl_FragCoord.x / gridSizeX)) * abs(sin(gl_FragCoord.y / gridSizeY));
    color = mix(color, vec3(0.3, 0.3, 0.3), grid * 0.15);
  } else {
    if (selectedDim == 0) color = mix(color, vec3(0.2, 0.05, 0.05), 0.4);
    else if (selectedDim == 1) color = mix(color, vec3(0.05, 0.2, 0.05), 0.4);
    else if (selectedDim == 2) color = mix(color, vec3(0.05, 0.05, 0.2), 0.4);
    else if (selectedDim == 3) color = mix(color, vec3(0.2, 0.2, 0.05), 0.4);
  }

  // Frustum pulse when active
  {
    bool hasActiveFrustum = false;
    if (selectedDim == 3) {
      if (abs(frustumBounds[selectedDim][0] + 4.0) > 0.1 || abs(frustumBounds[selectedDim][1] - 4.0) > 0.1) hasActiveFrustum = true;
    } else {
      if (abs(frustumBounds[selectedDim][0] + 2.0) > 0.1 || abs(frustumBounds[selectedDim][1] - 2.0) > 0.1) hasActiveFrustum = true;
    }
    if (hasActiveFrustum) {
      float pulse = 0.5 + 0.3 * sin(gl_FragCoord.x * 0.1 + gl_FragCoord.y * 0.1);
      float intensity = orthographicMode >= 0 ? 0.1 : 0.2;
      color = mix(color, vec3(0.3, 0.3, 0.3), intensity * pulse);
    }
  }

  // Sphere tracing for surface intersection
  vec3 marchResult = sphereTrace4D(coord);
  float surfaceHitDistance = marchResult.x;
  float surfaceNormal = marchResult.y;
  float surfaceType = marchResult.z;

  if (surfaceHitDistance >= 0.0) {
    vec4 rayDir4 = generate4DRayDirection(coord);
    vec4 ro4 = getRayOrigin4D(coord);
    vec4 hitPos4D = ro4 + surfaceHitDistance * rayDir4;

    vec3 surfaceColor;
    if (surfaceType < 0.5) surfaceColor = surfaceNormal > 0.0 ? vec3(1.0, 0.3, 0.3) : vec3(0.8, 0.2, 0.2);
    else if (surfaceType < 1.5) surfaceColor = surfaceNormal > 0.0 ? vec3(0.3, 1.0, 0.3) : vec3(0.2, 0.8, 0.2);
    else if (surfaceType < 2.5) surfaceColor = surfaceNormal > 0.0 ? vec3(0.3, 0.3, 1.0) : vec3(0.2, 0.2, 0.8);
    else surfaceColor = surfaceNormal > 0.0 ? vec3(1.0, 1.0, 0.3) : vec3(0.8, 0.8, 0.2);

    float lightingFactor = getLightingFactor(hitPos4D);
    float fadeFactor = clamp(1.0 - (surfaceHitDistance / 10.0), 0.1, 1.0);
    color = surfaceColor * lightingFactor * fadeFactor;
    float rimIntensity = abs(surfaceNormal) * 0.3;
    color += vec3(rimIntensity * 0.5, rimIntensity * 0.7, rimIntensity * 1.0);
  }

  // Wireframe overlay (screen-space)
  if (showWireframe) {
    vec2 px = coord;
    float pxScale = min(4.0 / max(1.0, resolution.x), 4.0 / max(1.0, resolution.y));
    float edgeRadius = pxScale * 1.8;
    float vertRadius = pxScale * 2.4;

    for (int i = 0; i < 32; i++) {
      int edgeIdx = i * 3;
      int v1Idx = edges[edgeIdx];
      int v2Idx = edges[edgeIdx + 1];
      int dim = edges[edgeIdx + 2];
      vec4 p0 = vertices[v1Idx];
      vec4 p1 = vertices[v2Idx];
      vec2 a = (useCPUWireframe && orthographicMode < 0) ? projected2D[v1Idx] : project4DToScreen(p0);
      vec2 b = (useCPUWireframe && orthographicMode < 0) ? projected2D[v2Idx] : project4DToScreen(p1);
      float d = pointSegmentDistance2D(px, a, b);
      vec4 mid4 = 0.5 * (p0 + p1);
      float atten = wireDistanceAttenuation(mid4);
      vec3 wireColor = (dim == 0) ? vec3(1.0, 0.4, 0.4) : (dim == 1) ? vec3(0.4, 1.0, 0.4) : (dim == 2) ? vec3(0.4, 0.4, 1.0) : vec3(1.0, 1.0, 0.4);
      float alpha = smoothstep(edgeRadius, 0.0, d) * atten;
      color = mix(color, wireColor, clamp(alpha, 0.0, 1.0));
    }

    for (int i = 0; i < 16; i++) {
      vec4 p = vertices[i];
      vec2 q = (useCPUWireframe && orthographicMode < 0) ? projected2D[i] : project4DToScreen(p);
      float d = length(px - q);
      float atten = wireDistanceAttenuation(p);
      float alpha = smoothstep(vertRadius, 0.0, d) * atten;
      color = mix(color, vec3(1.0), clamp(alpha, 0.0, 1.0));
    }
  }

  // Screen grid + center crosshair
  float gridSpacing = 0.5;
  float gridThickness = 0.01;
  float xGrid = mod(coord.x + gridSpacing * 0.5, gridSpacing) - gridSpacing * 0.5;
  if (abs(xGrid) < gridThickness) color = mix(color, vec3(0.15, 0.15, 0.2), 0.3);
  float yGrid = mod(coord.y + gridSpacing * 0.5, gridSpacing) - gridSpacing * 0.5;
  if (abs(yGrid) < gridThickness) color = mix(color, vec3(0.15, 0.15, 0.2), 0.3);
  if (abs(coord.x) < 0.02 || abs(coord.y) < 0.02) color = mix(color, vec3(0.3, 0.4, 0.5), 0.5);

  outColor = vec4(color, 1.0);
}


