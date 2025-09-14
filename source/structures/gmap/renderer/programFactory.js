function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Shader compile error: ${log}`)
  }
  return shader
}

export function createProgram(gl, vertSource, fragSource) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertSource)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSource)
  const program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(`Program link error: ${log}`)
  }
  return program
}

export function getUniformLocations(gl, program, names) {
  const out = {}
  for (const n of names) out[n] = gl.getUniformLocation(program, n)
  return out
}

export function getAttribLocations(gl, program, names) {
  const out = {}
  for (const n of names) out[n] = gl.getAttribLocation(program, n)
  return out
}


