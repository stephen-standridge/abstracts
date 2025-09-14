import React, { useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { HyperCube } from './hypercubegmap'
import { vertexShaderSource, fragmentShaderSource } from './renderer/shaderSources'
import { use4DRotation } from './hooks/use4DRotation'
import { createWebGL2Context, clear as glClear } from './renderer/webglContext'
import { createProgram, getUniformLocations } from './renderer/programFactory'
import { createFullscreenQuad, drawFullscreenQuad } from './renderer/fullscreenQuad'
import { uploadResolution, uploadLegacyCamera, uploadCamera4D, uploadRotations, uploadFrustum, uploadOrthographic, uploadLight } from './renderer/uniforms4d'
import { projectVerticesCPU } from './renderer/wireframeProjector'

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
    const gl = createWebGL2Context(canvas, { width: 512, height: 512 })
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)
    gl.useProgram(program)

    // Get uniform locations
    const uniforms = getUniformLocations(gl, program, [
      'light4DPos','vertices','edges','resolution','cameraPos','cameraTarget','cameraUp','cameraForward','shadowPlaneCenter','shadowPlaneDistance','camera4DPos','camera4DTarget','camera4DForward','wVariationScale','wireDebugCompare','useCPUWireframe','projected2D','rotationXY','rotationXZ','rotationYZ','rotationXW','rotationYW','rotationZW','frustumBounds','selectedDim','orthographicMode','orthographicSlice','orthographicBounds','showWireframe'
    ])

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
    createFullscreenQuad(gl, program)

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
    uploadLight(gl, uniforms, light4DPos)
    uploadResolution(gl, uniforms, 512, 512)
    uploadLegacyCamera(gl, uniforms, camera3DPos, cameraTarget, cameraUp, cameraForward, shadowPlaneCenter, shadowPlaneDistance)
    
    // Upload 4D camera data
    uploadCamera4D(gl, uniforms, camera4DPos, camera4DTarget, camera4DForward)
    // Debug/calibration: disable W variation for alignment tests in perspective
    gl.uniform1f(uniforms.wVariationScale, orthographicMode ? 1.0 : 0.0)
    // Disable debug projection dots (red/cyan)
    gl.uniform1i(uniforms.wireDebugCompare, 0)
    gl.uniform1i(uniforms.useCPUWireframe, 0)
    
    // Upload 4D rotation angles for inside/outside detection
    uploadRotations(gl, uniforms, rotation)
    
    // Upload 4D frustum bounds for collapsing (as mat4 with min/max for each dimension)
    uploadFrustum(gl, uniforms, frustumParams, selectedDimension)
        
        // Upload orthographic mode data
        uploadOrthographic(gl, uniforms, orthographicMode, orthographicSlice, orthographicBounds)
        
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
    if (showWireframe && !orthographicMode) {
      useCpuWire = 1
      const projected = projectVerticesCPU(rotatedVertices, camera4DPos, camera4DForward, { fov: 0.8 })
      if (uniforms.projected2D) gl.uniform2fv(uniforms.projected2D, projected)
    }
    if (uniforms.useCPUWireframe) gl.uniform1i(uniforms.useCPUWireframe, useCpuWire)

    // Render
    glClear(gl)
    drawFullscreenQuad(gl)
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