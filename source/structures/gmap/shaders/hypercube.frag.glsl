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

float distanceToLineSegment(vec2 point, vec2 start, vec2 end) {
  vec2 line = end - start;
  float lineLength2 = dot(line, line);
  if (lineLength2 < 1e-6) return distance(point, start);
  
  float t = max(0.0, min(1.0, dot(point - start, line) / lineLength2));
  vec2 projection = start + t * line;
  return distance(point, projection);
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

// Cast ray from camera through pixel position, find closest intersection with 4D hypercube
float castCameraRay(vec2 screenCoord) {
  // Get 3D world position of this pixel on the shadow plane
  vec3 pixelPos = getPixelWorldPosition(screenCoord);
  
  // Ray from camera through pixel
  vec3 rayDirection = normalize(pixelPos - cameraPos);
  
  float closestDistance = 999.0;
  int closestVertexIdx = -1;
  int closestEdgeIdx = -1;
  
  // Check intersection with 4D vertices (projected to 3D)
  for (int i = 0; i < 16; i++) {
    vec4 vertex4D = vertices[i];
    
    // Project 4D vertex to 3D space (same as before)
    vec3 vertex3D = vertex4D.xyz + vec3(0.0, 0.0, vertex4D.w * 2.0);
    
    // Find closest point on ray to vertex
    vec3 toVertex = vertex3D - cameraPos;
    float projLength = dot(toVertex, rayDirection);
    
    if (projLength > 0.0) { // In front of camera
      vec3 closestPointOnRay = cameraPos + projLength * rayDirection;
      float distanceToRay = distance(vertex3D, closestPointOnRay);
      
      if (distanceToRay < closestDistance) {
        closestDistance = distanceToRay;
        closestVertexIdx = i;
      }
    }
  }
  
  // Return distance to closest intersection (or large number if no hit)
  return closestDistance;
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
  
  // Cast ray from camera through this pixel and find intersections with 4D hypercube
  float rayDistance = castCameraRay(coord);
  
  // If ray hits something close enough, render it
  if (rayDistance < 0.2) { // Threshold for "hit"
    // Calculate brightness based on distance to intersection
    float hitIntensity = 1.0 - (rayDistance / 0.2);
    
    // Find which vertex/edge this ray is closest to for coloring and lighting
    vec3 pixelPos = getPixelWorldPosition(coord);
    vec3 rayDirection = normalize(pixelPos - cameraPos);
    
    float bestLighting = 0.2; // Base ambient lighting
    vec3 hitColor = vec3(0.6, 0.8, 1.0); // Default light blue
    int hitDimension = -1;
    
    // Check which vertex is closest to this ray for lighting calculation
    for (int i = 0; i < 16; i++) {
      vec4 vertex4D = vertices[i];
      vec3 vertex3D = vertex4D.xyz + vec3(0.0, 0.0, vertex4D.w * 2.0);
      
      vec3 toVertex = vertex3D - cameraPos;
      float projLength = dot(toVertex, rayDirection);
      
      if (projLength > 0.0) {
        vec3 closestPointOnRay = cameraPos + projLength * rayDirection;
        float distToVertex = distance(vertex3D, closestPointOnRay);
        
        if (distToVertex < 0.25) { // This ray is near this vertex
          float lighting = getLightingFactor(vertex4D);
          bestLighting = max(bestLighting, lighting);
          
          // Color based on W coordinate (4D depth)
          if (vertex4D.w < 0.0) {
            hitColor = vec3(1.0, 0.6, 0.2); // Orange for inner cube (w=-1)
          } else {
            hitColor = vec3(0.2, 0.8, 1.0); // Blue for outer cube (w=+1)
          }
        }
      }
    }
    
    // Check which edge this ray might be hitting for better coloring
    for (int i = 0; i < 32; i++) {
      int idx = i * 3;
      int vertex1Idx = edges[idx];
      int vertex2Idx = edges[idx + 1];
      int dimension = edges[idx + 2];
      
      vec4 v1_4d = vertices[vertex1Idx];
      vec4 v2_4d = vertices[vertex2Idx];
      
      vec3 v1_3d = v1_4d.xyz + vec3(0.0, 0.0, v1_4d.w * 2.0);
      vec3 v2_3d = v2_4d.xyz + vec3(0.0, 0.0, v2_4d.w * 2.0);
      
      // Check if ray is close to this edge
      vec3 edgeDir = normalize(v2_3d - v1_3d);
      vec3 toV1 = v1_3d - cameraPos;
      vec3 crossProduct = cross(rayDirection, edgeDir);
      float distToEdge = length(cross(toV1, rayDirection)) / length(crossProduct);
      
      if (distToEdge < 0.15) { // Ray is close to this edge
        // Color based on edge dimension
        if (dimension == 0) hitColor = vec3(1.0, 0.4, 0.4); // X edges - red
        else if (dimension == 1) hitColor = vec3(0.4, 1.0, 0.4); // Y edges - green  
        else if (dimension == 2) hitColor = vec3(0.4, 0.4, 1.0); // Z edges - blue
        else if (dimension == 3) hitColor = vec3(1.0, 1.0, 0.4); // W edges - yellow
        
        // Use edge lighting
        float lightingFactor1 = getLightingFactor(v1_4d);
        float lightingFactor2 = getLightingFactor(v2_4d);
        float edgeLighting = (lightingFactor1 + lightingFactor2) * 0.5;
        bestLighting = max(bestLighting, edgeLighting);
        break;
      }
    }
    
    // Apply lighting and intensity to final color
    float finalBrightness = bestLighting * hitIntensity;
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