#version 300 es
precision highp float;

// Import 4D vector math functions
#pragma glslify: require(../../math/glsl/vector4d.glsl)

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

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 coord = (uv - 0.5) * 4.0; // View range [-2, 2]
  
  vec3 color = vec3(0.1, 0.1, 0.15); // Dark background
  
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
  
  outColor = vec4(color, 1.0);
}