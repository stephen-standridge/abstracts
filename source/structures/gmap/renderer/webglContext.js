export function createWebGL2Context(canvas, { width = 512, height = 512 } = {}) {
  const gl = canvas.getContext('webgl2')
  if (!gl) throw new Error('WebGL2 not supported')
  canvas.width = width
  canvas.height = height
  gl.viewport(0, 0, width, height)
  gl.clearColor(0.1, 0.1, 0.15, 1.0)
  gl.disable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  return gl
}

export function clear(gl) {
  gl.clear(gl.COLOR_BUFFER_BIT)
}

export function setViewport(gl, width, height) {
  gl.viewport(0, 0, width, height)
}


