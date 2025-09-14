export function createFullscreenQuad(gl, program) {
  const quadVertices = new Float32Array([
    -1, -1, 0, 1,
     1, -1, 0, 1,
    -1,  1, 0, 1,
     1,  1, 0, 1
  ])
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0)
  return { buffer: positionBuffer, positionLoc: loc }
}

export function drawFullscreenQuad(gl) {
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}


