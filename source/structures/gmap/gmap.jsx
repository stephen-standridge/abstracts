import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

const Gmap = () => {

  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl2')
    if (!gl) throw new Error('WebGL2 not supported')

    // Input data
    const inputData = new Float32Array([1, 2, 3, 4])

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 1, 1, 0, gl.RGBA, gl.FLOAT, inputData)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    // Output texture + framebuffer
    const outputTex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, outputTex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 1, 1, 0, gl.RGBA, gl.FLOAT, null)

    const fb = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, outputTex, 0)

    // Shaders
    const vs = `#version 300 es
      in vec4 position;
      void main() {
        gl_Position = position;
      }`

    const fs = `#version 300 es
      precision highp float;
      uniform sampler2D inputTex;
      out vec4 outColor;
      void main() {
        vec2 uv = vec2(0.5, 0.5);
        vec4 val = texture(inputTex, uv);
        outColor = val * 2.0;
      }`

    function compileShader(type, src) {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(s))
      }
      return s
    }

    const prog = gl.createProgram()
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vs))
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fs))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    // Bind uniform
    const texLoc = gl.getUniformLocation(prog, 'inputTex')
    gl.uniform1i(texLoc, 0)

    // Quad vertices
    const posBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    )

    const posLoc = gl.getAttribLocation(prog, 'position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    // Run "compute shader"
    gl.viewport(0, 0, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    const result = new Float32Array(4)
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, result)
    console.log('Result:', result)
  }, [])




    return(
  <div style={{ padding: '2rem' }}>
    <h2>Gmap </h2>
    <p>An implementation of a generalized map</p>
    <Canvas ref={canvasRef} />
    <Link to="/">← Back to Home</Link>
  </div>
)}

const Canvas = styled.canvas`
  border: 2px solid hotpink;
  width: 200px;
  height: 200px;
`

export default Gmap