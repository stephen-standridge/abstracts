#version 300 es
precision highp float;

// Note: Would use 4D vector math imports here, but glslify issues
// Functions inlined directly instead

uniform vec4 light4DPos;
uniform vec4 vertices[16];
uniform int edges[96]; // 32 edges * 3 values each
uniform float shadowPlaneW;
uniform vec2 resolution;

out vec4 outColor;

float distanceToLineSegment(vec2 point, vec2 start, vec2 end) {
  vec2 line = end - start;
  float lineLength2 = dot(line, line);
  if (lineLength2 < 1e-6) return distance(point, start);
  
  float t = max(0.0, min(1.0, dot(point - start, line) / lineLength2));
  vec2 projection = start + t * line;
  return distance(point, projection);
}

// Cast ray from 4D light through 4D vertex to 3D shadow plane
vec3 castShadow4D(vec4 light4D, vec4 vertex4D, float shadowPlaneW) {
  vec4 rayDir = vertex4D - light4D;
  
  // Check if ray is parallel to shadow plane (rayDir.w ≈ 0)
  if (abs(rayDir.w) < 1e-6) {
    return vec3(0.0, 0.0, 0.0); // Invalid shadow point
  }
  
  // Find intersection parameter t where ray hits shadow plane (w = shadowPlaneW)
  // light4D.w + t * rayDir.w = shadowPlaneW
  float t = (shadowPlaneW - light4D.w) / rayDir.w;
  
  // Skip if shadow is "behind" the light (t <= 0)
  if (t <= 0.0) {
    return vec3(0.0, 0.0, 0.0); // Invalid shadow point
  }
  
  // Calculate 3D shadow point
  vec4 shadowPoint4D = light4D + t * rayDir;
  return shadowPoint4D.xyz;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 coord = (uv - 0.5) * 8.0; // Bigger view range [-4, 4] to see all shadows
  
  vec3 color = vec3(0.1, 0.1, 0.15); // Dark background
  
  // Render 4D light as a bright indicator
  // Project 4D light to 2D screen using same projection as hypercube
  float perspective4D = 2.0;
  vec2 lightProjected = light4DPos.xy / (perspective4D - light4DPos.w) + light4DPos.z * 0.3;
  
  float distToLight = distance(coord, lightProjected);
  if (distToLight < 0.15) {
    // Large bright yellow/orange light indicator
    float intensity = 1.0 - (distToLight / 0.15);
    color = mix(color, vec3(1.0, 0.8, 0.2), intensity * 0.9); // Bright light glow
  }
  
  // Render edges as lines
  for (int i = 0; i < 32; i++) {
    int idx = i * 3;
    int vertex1Idx = edges[idx];
    int vertex2Idx = edges[idx + 1];
    int dimension = edges[idx + 2];
    
    vec4 v1 = vertices[vertex1Idx];
    vec4 v2 = vertices[vertex2Idx];
    
    // 4D perspective projection for both vertices
    float perspective4D = 2.0;
    vec2 p1 = v1.xy / (perspective4D - v1.w) + v1.z * 0.3;
    vec2 p2 = v2.xy / (perspective4D - v2.w) + v2.z * 0.3;
    
    // Distance to line segment
    float lineDistance = distanceToLineSegment(coord, p1, p2);
    if (lineDistance < 0.02) {
      // Color based on dimension
      if (dimension == 0) color = vec3(1.0, 0.2, 0.2); // X edges - red
      else if (dimension == 1) color = vec3(0.2, 1.0, 0.2); // Y edges - green  
      else if (dimension == 2) color = vec3(0.2, 0.2, 1.0); // Z edges - blue
      else if (dimension == 3) color = vec3(1.0, 1.0, 0.2); // W edges - yellow
    }
  }
  
  // Still render vertices as dots on top
  for (int i = 0; i < 16; i++) {
    vec4 vertex4D = vertices[i];
    
    // 4D perspective projection
    float perspective4D = 2.0;
    vec2 projected = vertex4D.xy / (perspective4D - vertex4D.w) + vertex4D.z * 0.3;
    
    float dist = distance(coord, projected);
    if (dist < 0.05) {
      color = vec3(1.0, 1.0, 1.0); // White dots
    }
  }
  
  // NEW: Render 3D shadows of 4D edges (complete wireframe)
  for (int i = 0; i < 32; i++) {
    int idx = i * 3;
    int vertex1Idx = edges[idx];
    int vertex2Idx = edges[idx + 1];
    int dimension = edges[idx + 2];
    
    vec4 v1_4d = vertices[vertex1Idx];
    vec4 v2_4d = vertices[vertex2Idx];
    
    // Cast shadows of both edge endpoints to 3D shadow plane
    vec3 shadow1_3d = castShadow4D(light4DPos, v1_4d, shadowPlaneW);
    vec3 shadow2_3d = castShadow4D(light4DPos, v2_4d, shadowPlaneW);
    
    // Skip if either shadow is invalid
    if (length(shadow1_3d) < 1e-6 || length(shadow2_3d) < 1e-6) continue;
    
    // Project 3D shadow edge to 2D screen
    vec2 shadowP1 = shadow1_3d.xy;
    vec2 shadowP2 = shadow2_3d.xy;
    
    // Render shadow edge as line segment
    float shadowLineDist = distanceToLineSegment(coord, shadowP1, shadowP2);
    if (shadowLineDist < 0.03) {
      // Render shadow edges as orange lines
      color = vec3(1.0, 0.4, 0.1); // Bright orange shadow wireframe
    }
  }
  
  // DEBUG: Render shadow vertices with enhanced visualization
  for (int i = 0; i < 16; i++) {
    vec4 vertex4D = vertices[i];
    
    // Cast shadow from light through vertex to shadow plane
    vec3 shadow3D = castShadow4D(light4DPos, vertex4D, shadowPlaneW);
    
    // Skip invalid shadows (behind light or parallel rays)  
    if (length(shadow3D) < 1e-6) continue;
    
    // Project 3D shadow to 2D screen
    vec2 shadowProjected = shadow3D.xy;
    
    float shadowDist = distance(coord, shadowProjected);
    
    // Different sizes and colors for the two cube layers
    float dotRadius;
    vec3 shadowColor;
    if (vertex4D.w < 0.0) {
      // Inner cube (w = -1) - smaller, orange
      dotRadius = 0.08;
      shadowColor = vec3(1.0, 0.4, 0.1); // Bright orange
    } else {
      // Outer cube (w = +1) - larger, green 
      dotRadius = 0.12;
      shadowColor = vec3(0.2, 1.0, 0.4); // Bright green
    }
    
    if (shadowDist < dotRadius) {
      float intensity = 1.0 - (shadowDist / dotRadius);
      // Add bright center for better visibility
      if (shadowDist < dotRadius * 0.3) {
        color = shadowColor; // Solid color center
      } else {
        color = mix(color, shadowColor, intensity * 0.7); // Fade to edges
      }
    }
  }
  
  // Add coordinate grid for reference
  float gridSpacing = 1.0;
  float gridThickness = 0.02;
  
  // Vertical grid lines
  float xGrid = mod(coord.x + gridSpacing * 0.5, gridSpacing) - gridSpacing * 0.5;
  if (abs(xGrid) < gridThickness) {
    color = mix(color, vec3(0.3, 0.3, 0.4), 0.3);
  }
  
  // Horizontal grid lines  
  float yGrid = mod(coord.y + gridSpacing * 0.5, gridSpacing) - gridSpacing * 0.5;
  if (abs(yGrid) < gridThickness) {
    color = mix(color, vec3(0.3, 0.3, 0.4), 0.3);
  }
  
  // Center axes (brighter)
  if (abs(coord.x) < gridThickness * 2.0) {
    color = mix(color, vec3(0.5, 0.5, 0.6), 0.5); // Bright Y axis
  }
  if (abs(coord.y) < gridThickness * 2.0) {
    color = mix(color, vec3(0.5, 0.5, 0.6), 0.5); // Bright X axis  
  }
  
  outColor = vec4(color, 1.0);
}