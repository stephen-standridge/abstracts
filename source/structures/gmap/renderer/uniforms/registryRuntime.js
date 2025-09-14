// Runtime uniform registry: hooks/modules register what they need before shader assembly

const runtimeUniforms = new Map()
const runtimeOuts = new Map()

export function resetRuntimeUniforms() {
  runtimeUniforms.clear()
  runtimeOuts.clear()
}

export function registerUniform(name, type, size) {
  if (!name || !type) return
  runtimeUniforms.set(name, { name, type, size })
}

export function registerOut(name, type) {
  if (!name || !type) return
  runtimeOuts.set(name, { name, type })
}

export function getRuntimeUniforms() {
  return Array.from(runtimeUniforms.values())
}

export function getRuntimeOuts() {
  return Array.from(runtimeOuts.values())
}

// Convenience group helpers
export function registerGeometryUniforms() {
  registerUniform('vertices', 'vec4', 16)
  registerUniform('edges', 'int', 96)
}

export function registerResolution() { registerUniform('resolution', 'vec2') }

export function registerLight4D() { registerUniform('light4DPos', 'vec4') }

export function registerCamera3D() {
  registerUniform('cameraPos', 'vec3')
  registerUniform('cameraTarget', 'vec3')
  registerUniform('cameraUp', 'vec3')
  registerUniform('cameraForward', 'vec3')
  registerUniform('shadowPlaneCenter', 'vec3')
  registerUniform('shadowPlaneDistance', 'float')
}

export function registerCamera4D() {
  registerUniform('camera4DPos', 'vec4')
  registerUniform('camera4DTarget', 'vec4')
  registerUniform('camera4DForward', 'vec4')
  registerUniform('wVariationScale', 'float')
}

export function registerRotations() {
  registerUniform('rotationXY', 'float')
  registerUniform('rotationXZ', 'float')
  registerUniform('rotationYZ', 'float')
  registerUniform('rotationXW', 'float')
  registerUniform('rotationYW', 'float')
  registerUniform('rotationZW', 'float')
}

export function registerFrustum() {
  registerUniform('frustumBounds', 'mat4')
  registerUniform('selectedDim', 'int')
}

export function registerOrtho() {
  registerUniform('orthographicMode', 'int')
  registerUniform('orthographicSlice', 'float')
  registerUniform('orthographicBounds', 'mat4')
}

export function registerWireframe() {
  registerUniform('showWireframe', 'bool')
  registerUniform('wireDebugCompare', 'bool')
  registerUniform('useCPUWireframe', 'bool')
  registerUniform('projected2D', 'vec2', 16)
}

export function registerDefaultOuts() {
  registerOut('outColor', 'vec4')
}


