#version 300 es
precision highp float;

// 4D Hypercube Ray Casting Renderer
// Camera casts rays through screen pixels to intersect with 4D hypercube (projected to 3D)
// 4D light affects brightness only, not geometry
// Shadow plane acts as camera frustum/screen

uniform vec4 light4DPos;
uniform vec4 vertices[16];
uniform int edges[96]; // 32 edges * 3 values each
uniform vec2 resolution;
uniform vec3 cameraPos;
uniform vec3 cameraTarget;
uniform vec3 cameraUp;
uniform vec3 cameraForward;
uniform vec3 shadowPlaneCenter;
uniform float shadowPlaneDistance;
// 4D Camera uniforms
uniform vec4 camera4DPos;
uniform vec4 camera4DTarget;
uniform vec4 camera4DForward;
// 4D rotation angles for inverse transformation
uniform float rotationXY;
uniform float rotationXZ; 
uniform float rotationYZ;
uniform float rotationXW;
uniform float rotationYW;
uniform float rotationZW;

out vec4 outColor;

// Apply inverse 4D rotation to transform point back to axis-aligned hypercube space
vec4 inverseRotateVertex4D(vec4 vertex) {
  float x = vertex.x, y = vertex.y, z = vertex.z, w = vertex.w;
  
  // Apply rotations in reverse order with negated angles
  
  // Reverse ZW rotation
  if (rotationZW != 0.0) {
    float cosZW = cos(-rotationZW), sinZW = sin(-rotationZW);
    float newZ = z * cosZW - w * sinZW;
    float newW = z * sinZW + w * cosZW;
    z = newZ; w = newW;
  }
  
  // Reverse YW rotation
  if (rotationYW != 0.0) {
    float cosYW = cos(-rotationYW), sinYW = sin(-rotationYW);
    float newY = y * cosYW - w * sinYW;
    float newW = y * sinYW + w * cosYW;
    y = newY; w = newW;
  }
  
  // Reverse XW rotation
  if (rotationXW != 0.0) {
    float cosXW = cos(-rotationXW), sinXW = sin(-rotationXW);
    float newX = x * cosXW - w * sinXW;
    float newW = x * sinXW + w * cosXW;
    x = newX; w = newW;
  }
  
  // Reverse YZ rotation
  if (rotationYZ != 0.0) {
    float cosYZ = cos(-rotationYZ), sinYZ = sin(-rotationYZ);
    float newY = y * cosYZ - z * sinYZ;
    float newZ = y * sinYZ + z * cosYZ;
    y = newY; z = newZ;
  }
  
  // Reverse XZ rotation
  if (rotationXZ != 0.0) {
    float cosXZ = cos(-rotationXZ), sinXZ = sin(-rotationXZ);
    float newX = x * cosXZ - z * sinXZ;
    float newZ = x * sinXZ + z * cosXZ;
    x = newX; z = newZ;
  }
  
  // Reverse XY rotation
  if (rotationXY != 0.0) {
    float cosXY = cos(-rotationXY), sinXY = sin(-rotationXY);
    float newX = x * cosXY - y * sinXY;
    float newY = x * sinXY + y * cosXY;
    x = newX; y = newY;
  }
  
  return vec4(x, y, z, w);
}

// Test if a 4D point is inside the axis-aligned hypercube (all coords in [-1,1])
bool isInside4D(vec4 point) {
  // Transform point back to axis-aligned space
  vec4 alignedPoint = inverseRotateVertex4D(point);
  
  // Check if point is inside all 8 hyperfaces (4D equivalent of 6 cube faces)
  return (alignedPoint.x >= -1.0 && alignedPoint.x <= 1.0 &&
          alignedPoint.y >= -1.0 && alignedPoint.y <= 1.0 &&
          alignedPoint.z >= -1.0 && alignedPoint.z <= 1.0 &&
          alignedPoint.w >= -1.0 && alignedPoint.w <= 1.0);
}

// Generate 4D ray direction from 2D screen coordinates
vec4 generate4DRayDirection(vec2 screenCoord) {
  // Create 4D coordinate system around camera forward direction
  // Screen coordinates map to a 4D "viewing cone"
  
  // Use screen coordinates to create offset from camera forward direction
  float fov = 0.8; // Field of view factor
  vec4 ray4D = camera4DForward; // Start with camera forward direction
  
  // Apply screen offset in a way that creates a 4D viewing volume
  // We'll use the first two components for screen X/Y offset
  // and create perpendicular 4D directions for the projection
  
  // Create orthogonal 4D vectors (simplified approach)
  vec4 right4D = vec4(1.0, 0.0, 0.0, 0.0); // 4D right vector
  vec4 up4D = vec4(0.0, 1.0, 0.0, 0.0);     // 4D up vector
  
  // Apply screen offset to ray direction
  ray4D += screenCoord.x * fov * right4D;
  ray4D += screenCoord.y * fov * up4D;
  
  // Normalize the 4D ray direction
  float length4D = sqrt(ray4D.x*ray4D.x + ray4D.y*ray4D.y + ray4D.z*ray4D.z + ray4D.w*ray4D.w);
  return ray4D / length4D;
}

// Adaptive ray marching to find precise surface intersections using 4D rays
// Returns: x = surface hit distance (-1 if no hit), y = surface normal component, z = surface type (face ID)
vec3 adaptiveRayMarch4D(vec2 screenCoord) {
  const float maxDistance = 12.0;
  const float coarseStep = 0.1;     // Coarse detection step
  const float fineStep = 0.002;     // Fine surface refinement step
  const float surfaceThreshold = 0.02; // Distance to surface to consider a hit
  
  // Generate 4D ray from camera position through screen coordinate
  vec4 ray4DDirection = generate4DRayDirection(screenCoord);
  
  // Phase 1: Coarse ray marching to find approximate entry point
  float t = 0.05;
  bool wasInside = false;
  float entryApprox = -1.0;
  
  for (int i = 0; i < 120 && t < maxDistance; i++) {
    vec4 samplePos4D = camera4DPos + t * ray4DDirection; // True 4D ray marching
    bool isInside = isInside4D(samplePos4D);
    
    if (!wasInside && isInside) {
      entryApprox = t - coarseStep; // Back up to just before entry
      break;
    }
    
    wasInside = isInside;
    t += coarseStep;
  }
  
  if (entryApprox < 0.0) {
    return vec3(-1.0, 0.0, 0.0); // No intersection found
  }
  
  // Phase 2: Fine ray marching to find precise surface intersection
  float searchStart = max(0.0, entryApprox);
  float searchEnd = entryApprox + coarseStep * 2.0;
  
  float bestHitDistance = -1.0;
  float bestSurfaceNormal = 0.0;
  float bestSurfaceType = 0.0;
  float closestToSurface = 999.0;
  
  for (float ft = searchStart; ft <= searchEnd; ft += fineStep) {
    vec4 samplePos4D = camera4DPos + ft * ray4DDirection; // True 4D sampling
    
    // Transform to axis-aligned space for surface analysis
    vec4 alignedPoint = inverseRotateVertex4D(samplePos4D);
    
    // Calculate distance to each face and find the closest
    float distToXPos = abs(alignedPoint.x - 1.0);
    float distToXNeg = abs(alignedPoint.x + 1.0);
    float distToYPos = abs(alignedPoint.y - 1.0);
    float distToYNeg = abs(alignedPoint.y + 1.0);
    float distToZPos = abs(alignedPoint.z - 1.0);
    float distToZNeg = abs(alignedPoint.z + 1.0);
    float distToWPos = abs(alignedPoint.w - 1.0);
    float distToWNeg = abs(alignedPoint.w + 1.0);
    
    // Find minimum distance to any face
    float minDist = min(min(min(distToXPos, distToXNeg), min(distToYPos, distToYNeg)),
                       min(min(distToZPos, distToZNeg), min(distToWPos, distToWNeg)));
    
    // Check if we're close enough to a surface and inside the hypercube
    bool isInside = isInside4D(samplePos4D);
    if (isInside && minDist < surfaceThreshold) {
      
      if (minDist < closestToSurface) {
        closestToSurface = minDist;
        bestHitDistance = ft;
        
        // Determine which face we're closest to and calculate surface normal
        if (minDist == distToXPos) {
          bestSurfaceNormal = 1.0;  // +X face
          bestSurfaceType = 0.0;
        } else if (minDist == distToXNeg) {
          bestSurfaceNormal = -1.0; // -X face  
          bestSurfaceType = 0.0;
        } else if (minDist == distToYPos) {
          bestSurfaceNormal = 1.0;  // +Y face
          bestSurfaceType = 1.0;
        } else if (minDist == distToYNeg) {
          bestSurfaceNormal = -1.0; // -Y face
          bestSurfaceType = 1.0;
        } else if (minDist == distToZPos) {
          bestSurfaceNormal = 1.0;  // +Z face
          bestSurfaceType = 2.0;
        } else if (minDist == distToZNeg) {
          bestSurfaceNormal = -1.0; // -Z face
          bestSurfaceType = 2.0;
        } else if (minDist == distToWPos) {
          bestSurfaceNormal = 1.0;  // +W face
          bestSurfaceType = 3.0;
        } else {
          bestSurfaceNormal = -1.0; // -W face
          bestSurfaceType = 3.0;
        }
        
        // Early exit if we found a very close surface hit
        if (minDist < fineStep) {
          break;
        }
      }
    }
  }
  
  return vec3(bestHitDistance, bestSurfaceNormal, bestSurfaceType);
}

// Get 3D world position of pixel on shadow plane (screen)
vec3 getPixelWorldPosition(vec2 screenCoord) {
  // Create right and up vectors for the shadow plane (screen-like coordinates)
  vec3 worldUp = vec3(0.0, 1.0, 0.0);
  vec3 right = normalize(cross(cameraForward, worldUp));
  vec3 up = normalize(cross(right, cameraForward));
  
  // Convert screen coordinates to world position on shadow plane
  vec3 pixelPosition = shadowPlaneCenter + 
                      screenCoord.x * right + 
                      screenCoord.y * up;
  
  return pixelPosition;
}

// Find ray intersection with line segment in 3D
float rayLineSegmentDistance(vec3 rayOrigin, vec3 rayDir, vec3 lineStart, vec3 lineEnd) {
  vec3 lineDir = lineEnd - lineStart;
  vec3 toStart = lineStart - rayOrigin;
  
  // Vector from ray to line
  vec3 cross1 = cross(rayDir, lineDir);
  vec3 cross2 = cross(toStart, lineDir);
  
  float denominator = dot(cross1, cross1);
  if (denominator < 1e-6) return 999.0; // Parallel lines
  
  float t = dot(cross2, cross1) / denominator;
  if (t < 0.0) return 999.0; // Intersection behind camera
  
  // Find closest points on both lines
  vec3 rayPoint = rayOrigin + t * rayDir;
  
  // Project onto line segment
  float lineT = dot(rayPoint - lineStart, lineDir) / dot(lineDir, lineDir);
  lineT = clamp(lineT, 0.0, 1.0); // Clamp to segment
  
  vec3 linePoint = lineStart + lineT * lineDir;
  return distance(rayPoint, linePoint);
}

// Cast ray from camera through pixel, find closest intersection with 4D hypercube
// Returns: x = distance to intersection, y = W coordinate of intersection, z = type (0=vertex, 1=edge)
vec3 castCameraRay(vec2 screenCoord) {
  vec3 pixelPos = getPixelWorldPosition(screenCoord);
  vec3 rayDirection = normalize(pixelPos - cameraPos);
  
  float closestDistance = 999.0;
  float closestW = 0.0;
  float intersectionType = -1.0; // -1=none, 0=vertex, 1=edge
  int closestIdx = -1;
  
  // Check intersection with 4D vertices (projected to 3D)
  for (int i = 0; i < 16; i++) {
    vec4 vertex4D = vertices[i];
    vec3 vertex3D = vertex4D.xyz + vec3(0.0, 0.0, vertex4D.w * 2.0);
    
    vec3 toVertex = vertex3D - cameraPos;
    float projLength = dot(toVertex, rayDirection);
    
    if (projLength > 0.0) { // In front of camera
      vec3 closestPointOnRay = cameraPos + projLength * rayDirection;
      float distanceToRay = distance(vertex3D, closestPointOnRay);
      
      // W-plane culling: prefer closer W coordinates when distances are similar
      bool isCloser = (distanceToRay < closestDistance) || 
                     (abs(distanceToRay - closestDistance) < 0.05 && vertex4D.w > closestW);
      
      if (isCloser && distanceToRay < 0.15) { // Vertex hit threshold
        closestDistance = distanceToRay;
        closestW = vertex4D.w;
        intersectionType = 0.0; // Vertex
        closestIdx = i;
      }
    }
  }
  
  // Check intersection with 4D edges (projected to 3D)
  for (int i = 0; i < 32; i++) {
    int idx = i * 3;
    int vertex1Idx = edges[idx];
    int vertex2Idx = edges[idx + 1];
    
    vec4 v1_4d = vertices[vertex1Idx];
    vec4 v2_4d = vertices[vertex2Idx];
    
    vec3 v1_3d = v1_4d.xyz + vec3(0.0, 0.0, v1_4d.w * 2.0);
    vec3 v2_3d = v2_4d.xyz + vec3(0.0, 0.0, v2_4d.w * 2.0);
    
    float edgeDistance = rayLineSegmentDistance(cameraPos, rayDirection, v1_3d, v2_3d);
    float avgW = (v1_4d.w + v2_4d.w) * 0.5;
    
    // W-plane culling: prefer closer W coordinates when distances are similar
    bool isCloser = (edgeDistance < closestDistance) || 
                   (abs(edgeDistance - closestDistance) < 0.05 && avgW > closestW);
    
    if (isCloser && edgeDistance < 0.08) { // Edge hit threshold
      closestDistance = edgeDistance;
      closestW = avgW;
      intersectionType = 1.0; // Edge
      closestIdx = i;
    }
  }
  
  return vec3(closestDistance, closestW, intersectionType);
}

// Calculate distance-based lighting factor
float getLightingFactor(vec4 vertex4D) {
  float distance4D = length(vertex4D - light4DPos);
  // Brighter when closer to light, with falloff
  return 1.0 / (1.0 + distance4D * 0.3);
}



void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 coord = (uv - 0.5) * 4.0; // Screen coordinates [-2, 2] for camera ray casting
  
  vec3 color = vec3(0.05, 0.05, 0.1); // Dark space background
  
  // Perform adaptive 4D ray marching to find precise surface intersections
  vec3 marchResult = adaptiveRayMarch4D(coord);
  float surfaceHitDistance = marchResult.x;
  float surfaceNormal = marchResult.y;
  float surfaceType = marchResult.z;
  
  // Visual feedback based on precise surface intersections
  if (surfaceHitDistance >= 0.0) {
    // Ray hits a 4D hypercube surface
    vec4 ray4DDirection = generate4DRayDirection(coord);
    vec4 hitPos4D = camera4DPos + surfaceHitDistance * ray4DDirection;
    
    // Color based on surface type and normal direction
    vec3 surfaceColor;
    if (surfaceType < 0.5) {
      // X faces
      surfaceColor = surfaceNormal > 0.0 ? vec3(1.0, 0.3, 0.3) : vec3(0.8, 0.2, 0.2);
    } else if (surfaceType < 1.5) {
      // Y faces  
      surfaceColor = surfaceNormal > 0.0 ? vec3(0.3, 1.0, 0.3) : vec3(0.2, 0.8, 0.2);
    } else if (surfaceType < 2.5) {
      // Z faces
      surfaceColor = surfaceNormal > 0.0 ? vec3(0.3, 0.3, 1.0) : vec3(0.2, 0.2, 0.8);
    } else {
      // W faces
      surfaceColor = surfaceNormal > 0.0 ? vec3(1.0, 1.0, 0.3) : vec3(0.8, 0.8, 0.2);
    }
    
    // Calculate lighting based on 4D light position
    float lightingFactor = getLightingFactor(hitPos4D);
    
    // Apply distance-based fade
    float fadeFactor = 1.0 - (surfaceHitDistance / 10.0);
    fadeFactor = clamp(fadeFactor, 0.1, 1.0);
    
    // Combine surface color with lighting and distance fade
    color = surfaceColor * lightingFactor * fadeFactor;
    
    // Add subtle rim lighting based on surface normal
    float rimIntensity = abs(surfaceNormal) * 0.3;
    color += vec3(rimIntensity * 0.5, rimIntensity * 0.7, rimIntensity * 1.0);
  }
  
  // DISABLED: Old ray casting (replaced by adaptive ray marching above)
  /*
  vec3 rayResult = castCameraRay(coord);
  float rayDistance = rayResult.x;
  float intersectionW = rayResult.y;
  float intersectionType = rayResult.z;
  
  if (intersectionType >= 0.0) {
    vec3 pixelPos = getPixelWorldPosition(coord);
    vec3 rayDirection = normalize(pixelPos - cameraPos);
    
    vec3 hitColor = vec3(0.5, 0.5, 0.5); // Default gray
    float hitLighting = 0.2; // Base ambient
    
    if (intersectionType < 0.5) { // Vertex hit
      // Find the specific vertex that was hit for proper lighting and coloring
      for (int i = 0; i < 16; i++) {
        vec4 vertex4D = vertices[i];
        vec3 vertex3D = vertex4D.xyz + vec3(0.0, 0.0, vertex4D.w * 2.0);
        
        vec3 toVertex = vertex3D - cameraPos;
        float projLength = dot(toVertex, rayDirection);
        
        if (projLength > 0.0) {
          vec3 closestPointOnRay = cameraPos + projLength * rayDirection;
          float distToVertex = distance(vertex3D, closestPointOnRay);
          
          if (distToVertex < 0.15 && abs(vertex4D.w - intersectionW) < 0.1) {
            // This is the hit vertex
            hitLighting = getLightingFactor(vertex4D);
            
            // Color based on W coordinate (4D depth)
            if (vertex4D.w < 0.0) {
              hitColor = vec3(1.0, 0.7, 0.3); // Orange for inner cube (w=-1)
            } else {
              hitColor = vec3(0.3, 0.7, 1.0); // Blue for outer cube (w=+1)
            }
            break;
          }
        }
      }
    } else { // Edge hit
      // Find the specific edge that was hit for proper lighting and coloring
      for (int i = 0; i < 32; i++) {
        int idx = i * 3;
        int vertex1Idx = edges[idx];
        int vertex2Idx = edges[idx + 1];
        int dimension = edges[idx + 2];
        
        vec4 v1_4d = vertices[vertex1Idx];
        vec4 v2_4d = vertices[vertex2Idx];
        float avgW = (v1_4d.w + v2_4d.w) * 0.5;
        
        if (abs(avgW - intersectionW) < 0.1) {
          vec3 v1_3d = v1_4d.xyz + vec3(0.0, 0.0, v1_4d.w * 2.0);
          vec3 v2_3d = v2_4d.xyz + vec3(0.0, 0.0, v2_4d.w * 2.0);
          
          float edgeDistance = rayLineSegmentDistance(cameraPos, rayDirection, v1_3d, v2_3d);
          
          if (edgeDistance < 0.08) {
            // This is the hit edge
            float lightingFactor1 = getLightingFactor(v1_4d);
            float lightingFactor2 = getLightingFactor(v2_4d);
            hitLighting = (lightingFactor1 + lightingFactor2) * 0.5;
            
            // Color based on edge dimension with W-coordinate depth modulation
            float depthFactor = 0.7 + (intersectionW + 1.0) * 0.15; // Brighter for closer W
            
            if (dimension == 0) hitColor = vec3(1.0, 0.3, 0.3) * depthFactor; // X edges - red
            else if (dimension == 1) hitColor = vec3(0.3, 1.0, 0.3) * depthFactor; // Y edges - green  
            else if (dimension == 2) hitColor = vec3(0.3, 0.3, 1.0) * depthFactor; // Z edges - blue
            else if (dimension == 3) hitColor = vec3(1.0, 1.0, 0.3) * depthFactor; // W edges - yellow
            break;
          }
        }
      }
    }
    
    // Calculate final intensity based on distance to intersection
    float hitIntensity = 1.0 - (rayDistance / 0.2);
    hitIntensity = clamp(hitIntensity, 0.0, 1.0);
    
    // Apply lighting and W-coordinate depth effects
    float wDepthBrightness = 0.6 + (intersectionW + 1.0) * 0.2; // Closer W is brighter
    float finalBrightness = hitLighting * hitIntensity * wDepthBrightness;
    
    color = hitColor * finalBrightness;
  }
  */
  
  // Add subtle grid for reference (camera frustum visualization)
  float gridSpacing = 0.5;
  float gridThickness = 0.01;
  
  // Draw grid lines
  float xGrid = mod(coord.x + gridSpacing * 0.5, gridSpacing) - gridSpacing * 0.5;
  if (abs(xGrid) < gridThickness) {
    color = mix(color, vec3(0.15, 0.15, 0.2), 0.3);
  }
  
  float yGrid = mod(coord.y + gridSpacing * 0.5, gridSpacing) - gridSpacing * 0.5;
  if (abs(yGrid) < gridThickness) {
    color = mix(color, vec3(0.15, 0.15, 0.2), 0.3);
  }
  
  // Draw center crosshair
  if (abs(coord.x) < 0.02 || abs(coord.y) < 0.02) {
    color = mix(color, vec3(0.3, 0.4, 0.5), 0.5);
  }
  
  outColor = vec4(color, 1.0);
}