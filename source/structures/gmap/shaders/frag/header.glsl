#version 300 es
precision highp float;

// 4D Hypercube Ray Casting Renderer - Header & Uniforms

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
uniform float wVariationScale; // 0 disables W variation in perspective rays

// 4D rotation angles for inverse transformation
uniform float rotationXY;
uniform float rotationXZ; 
uniform float rotationYZ;
uniform float rotationXW;
uniform float rotationYW;
uniform float rotationZW;

// 4D Frustum uniforms for collapsing
uniform mat4 frustumBounds; // Each row contains [min, max, 0, 0] for X,Y,Z,W
uniform int selectedDim;     // Currently selected dimension (0=x, 1=y, 2=z, 3=w)

// Orthographic/Flattening uniforms  
uniform int orthographicMode;   // -1=disabled, 0=x, 1=y, 2=z, 3=w flattened
uniform float orthographicSlice; // Which slice/plane to show when flattened
uniform mat4 orthographicBounds; // Orthographic viewing bounds for each dimension [min, max, 0, 0]

// Wireframe uniforms
uniform bool showWireframe;     // Whether to show 4D hypercube wireframe
uniform bool wireDebugCompare;  // draw dual projection markers for calibration
uniform bool useCPUWireframe;   // if true in perspective, use CPU-projected 2D positions
uniform vec2 projected2D[16];   // CPU-projected screen coords for vertices in coord space [-2,2]

out vec4 outColor;


