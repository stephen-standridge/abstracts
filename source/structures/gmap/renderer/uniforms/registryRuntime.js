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

export function registerDefaultOuts() {
  registerOut('outColor', 'vec4')
}


