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
    // Orthographic/Flattening mode
    orthographicMode,
    orthographicSlice,
    orthographicBounds,
    // Wireframe mode
    showWireframe,
    rotateVertex4D, 
    resetLight, 
    resetCamera, 
    resetRotation,
    resetOrthographic,
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
      wVariationScale: gl.getUniformLocation(program, 'wVariationScale'),
      wireDebugCompare: gl.getUniformLocation(program, 'wireDebugCompare'),
      useCPUWireframe: gl.getUniformLocation(program, 'useCPUWireframe'),
      projected2D: gl.getUniformLocation(program, 'projected2D'),
      // 4D rotation angles for inside/outside detection
      rotationXY: gl.getUniformLocation(program, 'rotationXY'),
      rotationXZ: gl.getUniformLocation(program, 'rotationXZ'),
      rotationYZ: gl.getUniformLocation(program, 'rotationYZ'),
      rotationXW: gl.getUniformLocation(program, 'rotationXW'),
      rotationYW: gl.getUniformLocation(program, 'rotationYW'),
      rotationZW: gl.getUniformLocation(program, 'rotationZW'),
                // 4D Frustum uniforms for collapsing
          frustumBounds: gl.getUniformLocation(program, 'frustumBounds'),
          selectedDim: gl.getUniformLocation(program, 'selectedDim'),
          // Orthographic/Flattening uniforms
          orthographicMode: gl.getUniformLocation(program, 'orthographicMode'),
          orthographicSlice: gl.getUniformLocation(program, 'orthographicSlice'),
          orthographicBounds: gl.getUniformLocation(program, 'orthographicBounds'),
          // Wireframe uniforms
          showWireframe: gl.getUniformLocation(program, 'showWireframe')
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
    // Debug/calibration: disable W variation for alignment tests in perspective
    gl.uniform1f(uniforms.wVariationScale, orthographicMode ? 1.0 : 0.0)
    // Disable debug projection dots (red/cyan)
    gl.uniform1i(uniforms.wireDebugCompare, 0)
    gl.uniform1i(uniforms.useCPUWireframe, 0)
    
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
        
        // Upload orthographic mode data
        const orthoModeIndex = orthographicMode ? { x: 0, y: 1, z: 2, w: 3 }[orthographicMode] : -1
        gl.uniform1i(uniforms.orthographicMode, orthoModeIndex) // -1 for disabled, 0-3 for x,y,z,w
        gl.uniform1f(uniforms.orthographicSlice, orthographicSlice)
        
        // Upload orthographic viewing bounds (projection scale)
        const orthoBoundsMatrix = new Float32Array([
          orthographicBounds.x.min, orthographicBounds.x.max, 0, 0,
          orthographicBounds.y.min, orthographicBounds.y.max, 0, 0,
          orthographicBounds.z.min, orthographicBounds.z.max, 0, 0,
          orthographicBounds.w.min, orthographicBounds.w.max, 0, 0
        ])
        gl.uniformMatrix4fv(uniforms.orthographicBounds, false, orthoBoundsMatrix)
        
        // Upload wireframe mode
        gl.uniform1i(uniforms.showWireframe, showWireframe ? 1 : 0)
    
    // Upload rotated vertex data
    const flatVertices = new Float32Array(rotatedVertices.flat())
    gl.uniform4fv(uniforms.vertices, flatVertices)
    
    // Upload edge data
    const flatEdges = new Int32Array(edges.flat())
    gl.uniform1iv(uniforms.edges, flatEdges)

    // CPU-projected 2D for perspective wireframe alignment
    let useCpuWire = 0
    let projected = null
    if (showWireframe && !orthographicMode) {
      useCpuWire = 1
      const fwd = camera4DForward
      const cam = camera4DPos
      const screenX4 = [1.0, 0.0, 0.0, 0.3]
      const screenY4 = [0.0, 1.0, 0.2, 0.0]
      const fov = 0.8
      const eps = 1e-3
      function dot4(a, b) { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3] }
      function sub4(a, b) { return [a[0]-b[0], a[1]-b[1], a[2]-b[2], a[3]-b[3]] }
      function add4(a, b) { return [a[0]+b[0], a[1]+b[1], a[2]+b[2], a[3]+b[3]] }
      function mul4(a, s) { return [a[0]*s, a[1]*s, a[2]*s, a[3]*s] }
      function norm4(a) { const l=Math.hypot(a[0],a[1],a[2],a[3])||1; return [a[0]/l,a[1]/l,a[2]/l,a[3]/l] }
      const fwdN = norm4(fwd)
      function rayDir(u, v) {
        const sx = mul4(screenX4, fov * u)
        const sy = mul4(screenY4, fov * v)
        return norm4(add4(fwdN, add4(sx, sy)))
      }
      function solveUVForPoint(p) {
        const tDir = norm4(sub4(p, cam))
        let u = 0, v = 0
        // Initial guess using linear perspective approximation
        const vRel = sub4(p, cam)
        const depth = Math.max(1e-4, dot4(vRel, fwdN))
        const vperp = sub4(vRel, mul4(fwdN, depth))
        // Build orthonormal basis from screen vectors
        const axp = sub4(screenX4, mul4(fwdN, dot4(screenX4, fwdN)))
        const axl = Math.hypot(axp[0],axp[1],axp[2],axp[3])||1
        const axn = [axp[0]/axl, axp[1]/axl, axp[2]/axl, axp[3]/axl]
        let byp = sub4(screenY4, mul4(fwdN, dot4(screenY4, fwdN)))
        // Gram-Schmidt
        byp = sub4(byp, mul4(axn, dot4(byp, axn)))
        const byl = Math.hypot(byp[0],byp[1],byp[2],byp[3])||1
        const byn = [byp[0]/byl, byp[1]/byl, byp[2]/byl, byp[3]/byl]
        u = (dot4(vperp, axn) / (depth * fov)) * 2.0
        v = (dot4(vperp, byn) / (depth * fov)) * 2.0
        // Gauss-Newton refinement
        for (let it = 0; it < 6; it++) {
          const F = (() => {
            const r = rayDir(u, v)
            return [r[0]-tDir[0], r[1]-tDir[1], r[2]-tDir[2], r[3]-tDir[3]]
          })()
          const Fu = (() => {
            const r = rayDir(u+eps, v)
            return [r[0]-tDir[0], r[1]-tDir[1], r[2]-tDir[2], r[3]-tDir[3]]
          })()
          const Fv = (() => {
            const r = rayDir(u, v+eps)
            return [r[0]-tDir[0], r[1]-tDir[1], r[2]-tDir[2], r[3]-tDir[3]]
          })()
          // J = [dF/du, dF/dv]
          const Ju = [(Fu[0]-F[0])/eps, (Fu[1]-F[1])/eps, (Fu[2]-F[2])/eps, (Fu[3]-F[3])/eps]
          const Jv = [(Fv[0]-F[0])/eps, (Fv[1]-F[1])/eps, (Fv[2]-F[2])/eps, (Fv[3]-F[3])/eps]
          // Solve 2x2 normal equations
          const a11 = Ju[0]*Ju[0]+Ju[1]*Ju[1]+Ju[2]*Ju[2]+Ju[3]*Ju[3]
          const a12 = Ju[0]*Jv[0]+Ju[1]*Jv[1]+Ju[2]*Jv[2]+Ju[3]*Jv[3]
          const a22 = Jv[0]*Jv[0]+Jv[1]*Jv[1]+Jv[2]*Jv[2]+Jv[3]*Jv[3]
          const b1 = -(Ju[0]*F[0]+Ju[1]*F[1]+Ju[2]*F[2]+Ju[3]*F[3])
          const b2 = -(Jv[0]*F[0]+Jv[1]*F[1]+Jv[2]*F[2]+Jv[3]*F[3])
          const det = a11*a22 - a12*a12
          if (Math.abs(det) < 1e-10) break
          const du = ( a22*b1 - a12*b2) / det
          const dv = (-a12*b1 + a11*b2) / det
          u += du
          v += dv
          if (Math.abs(du)+Math.abs(dv) < 1e-4) break
        }
        return [u, v]
      }
      projected = new Float32Array(32)
      for (let i = 0; i < 16; i++) {
        const p = rotatedVertices[i]
        const uv = solveUVForPoint(p)
        projected[i*2+0] = uv[0]
        projected[i*2+1] = uv[1]
      }
    }
    gl.uniform1i(uniforms.useCPUWireframe, useCpuWire)
    if (useCpuWire && projected) {
      gl.uniform2fv(uniforms.projected2D, projected)
    }

    // Render
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }, [rotation, rotateVertex4D, light4DPos, camera4DPos, camera4DTarget, camera4DForward, camera3DPos, cameraTarget, cameraUp, cameraForward, shadowPlaneCenter, shadowPlaneDistance, frustumParams, selectedDimension, orthographicMode, orthographicSlice, orthographicBounds, showWireframe])

  // Re-render when rotation, light position, camera, or frustum changes
  useEffect(() => {
    render()
  }, [rotation, light4DPos, camera4DPos, camera4DForward, shadowPlaneCenter, shadowPlaneDistance, frustumParams, selectedDimension, orthographicMode, orthographicSlice, orthographicBounds, showWireframe, render])

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
        <strong>Orthographic/Dimensional Flattening:</strong><br/>
        • <strong>Press 'A':</strong> Flatten X dimension (YZW view)<br/>
        • <strong>Press 'S':</strong> Flatten Y dimension (XZW view)<br/>
        • <strong>Press 'D':</strong> Flatten Z dimension (XYW view)<br/>
        • <strong>Press 'F':</strong> Flatten W dimension (XYZ view)<br/>
        • <strong>Press 'G':</strong> Disable flattening (normal 4D view)<br/>
        <strong>4D Wireframe Visualization:</strong><br/>
        • <strong>Press 'W':</strong> Toggle 4D hypercube wireframe (edges & vertices)<br/>
        • <strong>Middle mouse drag:</strong> {orthographicMode ? 'Adjust orthographic viewing bounds (both axes)' : 'Adjust frustum bounds (selected dimension)'}<br/>
        • <strong>Shift+Middle mouse drag:</strong> Projection offset control (currently disabled)<br/>
        • <strong>Current Mode:</strong> <span style={{color: '#FF9800', fontWeight: 'bold', fontSize: '1.2em'}}>
          {orthographicMode ? `${orthographicMode.toUpperCase()}-Flattened (offset: ${orthographicSlice.toFixed(2)})` : 'Normal 4D'}
        </span><br/>
        • <strong>Wireframe:</strong> <span style={{color: showWireframe ? '#4CAF50' : '#F44336', fontWeight: 'bold', fontSize: '1.2em'}}>
          {showWireframe ? 'ON' : 'OFF'}
        </span><br/>
        • <strong>Selected:</strong> <span style={{color: '#4CAF50', fontWeight: 'bold', fontSize: '1.2em'}}>{selectedDimension.toUpperCase()}</span> dimension<br/>
        • <strong>{orthographicMode ? 'Orthographic Viewing Bounds:' : 'Frustum Bounds (Clipping):'}</strong><br/>
        {orthographicMode ? (
          <>
            &nbsp;&nbsp;X: <span style={{color: selectedDimension === 'x' ? '#4CAF50' : '#666'}}>[{orthographicBounds.x.min.toFixed(1)}, {orthographicBounds.x.max.toFixed(1)}]</span> (default: [-3.0, 3.0])<br/>
            &nbsp;&nbsp;Y: <span style={{color: selectedDimension === 'y' ? '#4CAF50' : '#666'}}>[{orthographicBounds.y.min.toFixed(1)}, {orthographicBounds.y.max.toFixed(1)}]</span> (default: [-3.0, 3.0])<br/>
            &nbsp;&nbsp;Z: <span style={{color: selectedDimension === 'z' ? '#4CAF50' : '#666'}}>[{orthographicBounds.z.min.toFixed(1)}, {orthographicBounds.z.max.toFixed(1)}]</span> (default: [-3.0, 3.0])<br/>
            &nbsp;&nbsp;W: <span style={{color: selectedDimension === 'w' ? '#4CAF50' : '#666'}}>[{orthographicBounds.w.min.toFixed(1)}, {orthographicBounds.w.max.toFixed(1)}]</span> (default: [-3.0, 3.0])<br/>
          </>
        ) : (
          <>
            &nbsp;&nbsp;X: <span style={{color: selectedDimension === 'x' ? '#4CAF50' : '#666'}}>[{frustumParams.x.min.toFixed(1)}, {frustumParams.x.max.toFixed(1)}]</span> (default: [-2.0, 2.0])<br/>
            &nbsp;&nbsp;Y: <span style={{color: selectedDimension === 'y' ? '#4CAF50' : '#666'}}>[{frustumParams.y.min.toFixed(1)}, {frustumParams.y.max.toFixed(1)}]</span> (default: [-2.0, 2.0])<br/>
            &nbsp;&nbsp;Z: <span style={{color: selectedDimension === 'z' ? '#4CAF50' : '#666'}}>[{frustumParams.z.min.toFixed(1)}, {frustumParams.z.max.toFixed(1)}]</span> (default: [-2.0, 2.0])<br/>
            &nbsp;&nbsp;W: <span style={{color: selectedDimension === 'w' ? '#4CAF50' : '#666'}}>[{frustumParams.w.min.toFixed(1)}, {frustumParams.w.max.toFixed(1)}]</span> (default: [-4.0, 4.0])<br/>
          </>
        )}
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