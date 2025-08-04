import React, { useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { HyperCube } from './hypercubegmap'
import vertexShaderSource from './shaders/hypercube.vert.glsl'
import fragmentShaderSource from './shaders/hypercube.frag.glsl'
import { use4DRotation } from './hooks/use4DRotation'

const Gmap = () => {
  const canvasRef = useRef(null)
  const { 
    rotation, 
    light4DPos, 
    // 4D Camera
    camera4DPos, 
    camera4DTarget, 
    camera4DForward,
    // Legacy 3D Camera (for compatibility)
    camera3DPos, 
    cameraTarget, 
    cameraUp, 
    cameraForward, 
    shadowPlaneCenter, 
    shadowPlaneDistance, 
    // 4D Frustum for collapsing
    frustumParams,
    selectedDimension,
    rotateVertex4D, 
    resetLight, 
    resetCamera, 
    resetRotation,
    mouseHandlers 
  } = use4DRotation()
  
  // Store WebGL context and program for re-rendering
  const webglRef = useRef({ gl: null, program: null, uniforms: null })

  // Setup WebGL once
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl2')
    
    if (!gl) {
      console.error('WebGL2 not supported')
      return
    }

    // Set canvas size to match display size
    const shadowResolution = 512
    canvas.width = shadowResolution
    canvas.height = shadowResolution
    
    gl.viewport(0, 0, shadowResolution, shadowResolution)
    gl.clearColor(0.1, 0.1, 0.15, 1.0)



    // Compile shaders
    function compileShader(type, source) {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }

      return shader
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) return

    // Create program
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program))
      return
    }

    gl.useProgram(program)

    // Get uniform locations
    const uniforms = {
      light4DPos: gl.getUniformLocation(program, 'light4DPos'),
      vertices: gl.getUniformLocation(program, 'vertices'),
      edges: gl.getUniformLocation(program, 'edges'),
      resolution: gl.getUniformLocation(program, 'resolution'),
      cameraPos: gl.getUniformLocation(program, 'cameraPos'),
      cameraTarget: gl.getUniformLocation(program, 'cameraTarget'),
      cameraUp: gl.getUniformLocation(program, 'cameraUp'),
      cameraForward: gl.getUniformLocation(program, 'cameraForward'),
      shadowPlaneCenter: gl.getUniformLocation(program, 'shadowPlaneCenter'),
      shadowPlaneDistance: gl.getUniformLocation(program, 'shadowPlaneDistance'),
      // 4D Camera uniforms
      camera4DPos: gl.getUniformLocation(program, 'camera4DPos'),
      camera4DTarget: gl.getUniformLocation(program, 'camera4DTarget'),
      camera4DForward: gl.getUniformLocation(program, 'camera4DForward'),
      // 4D rotation angles for inside/outside detection
      rotationXY: gl.getUniformLocation(program, 'rotationXY'),
      rotationXZ: gl.getUniformLocation(program, 'rotationXZ'),
      rotationYZ: gl.getUniformLocation(program, 'rotationYZ'),
      rotationXW: gl.getUniformLocation(program, 'rotationXW'),
      rotationYW: gl.getUniformLocation(program, 'rotationYW'),
      rotationZW: gl.getUniformLocation(program, 'rotationZW'),
      // 4D Frustum uniforms for collapsing
      frustumBounds: gl.getUniformLocation(program, 'frustumBounds'),
      selectedDim: gl.getUniformLocation(program, 'selectedDim')
    }

    // Create hypercube data
    const hypercube = new HyperCube()
    hypercube.makeHypercube()
    
    // Get all 16 vertex coordinates
    const baseVertices = []
    for (let i = 0; i < 16; i++) {
      baseVertices.push(hypercube.getVertexCoords(i))
    }
    const edges = hypercube.getEdges()

    // Create fullscreen quad
    const quadVertices = new Float32Array([
      -1, -1, 0, 1,
       1, -1, 0, 1,
      -1,  1, 0, 1,
       1,  1, 0, 1
    ])

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0)

    // Store for re-rendering
    webglRef.current = { gl, program, uniforms, baseVertices, edges }

  }, [])

  // Render function that applies current rotation
  const render = useCallback(() => {
    const { gl, program, uniforms, baseVertices, edges } = webglRef.current
    if (!gl || !program) return

    // Apply rotation to all vertices
    const rotatedVertices = baseVertices.map(vertex => rotateVertex4D(vertex))

    // Upload uniforms
    gl.uniform4f(uniforms.light4DPos, ...light4DPos)
    gl.uniform2f(uniforms.resolution, 512, 512)
    gl.uniform3f(uniforms.cameraPos, ...camera3DPos)
    gl.uniform3f(uniforms.cameraTarget, ...cameraTarget)
    gl.uniform3f(uniforms.cameraUp, ...cameraUp)
    gl.uniform3f(uniforms.cameraForward, ...cameraForward)
    gl.uniform3f(uniforms.shadowPlaneCenter, ...shadowPlaneCenter)
    gl.uniform1f(uniforms.shadowPlaneDistance, shadowPlaneDistance)
    
    // Upload 4D camera data
    gl.uniform4f(uniforms.camera4DPos, ...camera4DPos)
    gl.uniform4f(uniforms.camera4DTarget, ...camera4DTarget)
    gl.uniform4f(uniforms.camera4DForward, ...camera4DForward)
    
    // Upload 4D rotation angles for inside/outside detection
    gl.uniform1f(uniforms.rotationXY, rotation.xy)
    gl.uniform1f(uniforms.rotationXZ, rotation.xz)
    gl.uniform1f(uniforms.rotationYZ, rotation.yz)
    gl.uniform1f(uniforms.rotationXW, rotation.xw)
    gl.uniform1f(uniforms.rotationYW, rotation.yw)
    gl.uniform1f(uniforms.rotationZW, rotation.zw)
    
    // Upload 4D frustum bounds for collapsing (as mat4 with min/max for each dimension)
    const frustumMatrix = new Float32Array([
      frustumParams.x.min, frustumParams.x.max, 0, 0,
      frustumParams.y.min, frustumParams.y.max, 0, 0,
      frustumParams.z.min, frustumParams.z.max, 0, 0,
      frustumParams.w.min, frustumParams.w.max, 0, 0
    ])
    gl.uniformMatrix4fv(uniforms.frustumBounds, false, frustumMatrix)
    
    // Upload selected dimension index (0=x, 1=y, 2=z, 3=w)
    const dimIndex = { x: 0, y: 1, z: 2, w: 3 }[selectedDimension]
    gl.uniform1i(uniforms.selectedDim, dimIndex)
    
    // Upload rotated vertex data
    const flatVertices = new Float32Array(rotatedVertices.flat())
    gl.uniform4fv(uniforms.vertices, flatVertices)
    
    // Upload edge data
    const flatEdges = new Int32Array(edges.flat())
    gl.uniform1iv(uniforms.edges, flatEdges)

    // Render
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }, [rotation, rotateVertex4D, light4DPos, camera4DPos, camera4DTarget, camera4DForward, camera3DPos, cameraTarget, cameraUp, cameraForward, shadowPlaneCenter, shadowPlaneDistance, frustumParams, selectedDimension])

  // Re-render when rotation, light position, camera, or frustum changes
  useEffect(() => {
    render()
  }, [rotation, light4DPos, camera4DPos, camera4DForward, shadowPlaneCenter, shadowPlaneDistance, frustumParams, selectedDimension, render])

  return (
    <PageWrapper style={{ padding: '2rem' }}>
      <h2>Gmap </h2>
      <p>An implementation of a generalized map</p>
      <Canvas 
        ref={canvasRef} 
        width={512} 
        height={512}
        {...mouseHandlers}
      />
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <strong>4D Camera Ray Casting Controls:</strong><br/>
        <strong>Hypercube Rotation:</strong><br/>
        • <strong>Left drag:</strong> XW + YW rotations (primary 4D)<br/>
        • <strong>Right drag:</strong> XY + XZ rotations (3D-like)<br/>
        <strong>4D Light (affects brightness only):</strong><br/>
        • <strong>Shift+Left drag:</strong> Light orbit (azimuth + elevation)<br/>
        • <strong>Shift+Right drag:</strong> Light distance + 4D W coordinate<br/>
        <strong>4D Camera (ray origin):</strong><br/>
        • <strong>Alt+Left drag:</strong> Camera orbit around hypercube view<br/>
        • <strong>Alt+Right drag:</strong> Camera zoom in/out<br/>
        • <strong>Ctrl+Left drag:</strong> 4D Camera W position + target W<br/>
        • <strong>Ctrl+Right drag:</strong> 4D Camera W position only<br/>
        <strong>4D Frustum Collapsing:</strong><br/>
        • <strong>Press '1', '2', '3', '4':</strong> Select X, Y, Z, W dimension<br/>
        • <strong>Middle mouse drag (no keys):</strong> Expand/collapse selected dimension bounds<br/>
        • <strong>Press '5':</strong> Reset frustum bounds<br/>
        • <strong>Selected:</strong> <span style={{color: '#4CAF50', fontWeight: 'bold', fontSize: '1.2em'}}>{selectedDimension.toUpperCase()}</span> dimension<br/>
        • <strong>All Bounds:</strong><br/>
        &nbsp;&nbsp;X: <span style={{color: selectedDimension === 'x' ? '#4CAF50' : '#666'}}>[{frustumParams.x.min.toFixed(1)}, {frustumParams.x.max.toFixed(1)}]</span> (default: [-2.0, 2.0])<br/>
        &nbsp;&nbsp;Y: <span style={{color: selectedDimension === 'y' ? '#4CAF50' : '#666'}}>[{frustumParams.y.min.toFixed(1)}, {frustumParams.y.max.toFixed(1)}]</span> (default: [-2.0, 2.0])<br/>
        &nbsp;&nbsp;Z: <span style={{color: selectedDimension === 'z' ? '#4CAF50' : '#666'}}>[{frustumParams.z.min.toFixed(1)}, {frustumParams.z.max.toFixed(1)}]</span> (default: [-2.0, 2.0])<br/>
        &nbsp;&nbsp;W: <span style={{color: selectedDimension === 'w' ? '#4CAF50' : '#666'}}>[{frustumParams.w.min.toFixed(1)}, {frustumParams.w.max.toFixed(1)}]</span> (default: [-4.0, 4.0])<br/>
        <strong>Reset Keys:</strong><br/>
        • <strong>Press 'R':</strong> Reset light position<br/>
        • <strong>Press 'C':</strong> Reset camera position<br/>
        • <strong>Press 'H':</strong> Reset hypercube rotation<br/>
        <strong>Rendering:</strong> 4D Camera with frustum-based collapsing
      </div>
      <Link to="/">← Back to Home</Link>
    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const Canvas = styled.canvas`
  border: 2px solid #333;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  background-color: #1a1a2e;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`

export default Gmap