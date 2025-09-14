// Declarative uniform registry for shader header generation and location fetching

export const uniformRegistry = [
  { name: 'light4DPos', type: 'vec4' },
  { name: 'vertices', type: 'vec4', size: 16 },
  { name: 'edges', type: 'int', size: 96 },
  { name: 'resolution', type: 'vec2' },
  { name: 'cameraPos', type: 'vec3' },
  { name: 'cameraTarget', type: 'vec3' },
  { name: 'cameraUp', type: 'vec3' },
  { name: 'cameraForward', type: 'vec3' },
  { name: 'shadowPlaneCenter', type: 'vec3' },
  { name: 'shadowPlaneDistance', type: 'float' },
  // 4D camera
  { name: 'camera4DPos', type: 'vec4' },
  { name: 'camera4DTarget', type: 'vec4' },
  { name: 'camera4DForward', type: 'vec4' },
  { name: 'wVariationScale', type: 'float' },
  // rotation angles
  { name: 'rotationXY', type: 'float' },
  { name: 'rotationXZ', type: 'float' },
  { name: 'rotationYZ', type: 'float' },
  { name: 'rotationXW', type: 'float' },
  { name: 'rotationYW', type: 'float' },
  { name: 'rotationZW', type: 'float' },
  // frustum & ortho
  { name: 'frustumBounds', type: 'mat4' },
  { name: 'selectedDim', type: 'int' },
  { name: 'orthographicMode', type: 'int' },
  { name: 'orthographicSlice', type: 'float' },
  { name: 'orthographicBounds', type: 'mat4' },
  // wireframe
  { name: 'showWireframe', type: 'bool' },
  { name: 'wireDebugCompare', type: 'bool' },
  { name: 'useCPUWireframe', type: 'bool' },
  { name: 'projected2D', type: 'vec2', size: 16 },
]

export const outVars = [
  { name: 'outColor', type: 'vec4' },
]

export function getUniformNames() {
  return uniformRegistry.map(u => u.name)
}


