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

out vec4 outColor;

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
  
  // Cast ray from camera and get intersection info (distance, W-coord, type)
  vec3 rayResult = castCameraRay(coord);
  float rayDistance = rayResult.x;
  float intersectionW = rayResult.y;
  float intersectionType = rayResult.z;
  
  // If ray hits something, render it
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