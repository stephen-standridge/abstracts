import React, { useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { HyperCube } from './hypercubegmap'
import { useControls4D } from './hooks/useControls4D'
import { createWebGL2Context } from './renderer/webglContext'
import { initRenderer4D, renderFrame4D, disposeRenderer4D } from './renderer/renderer4d'
import { resetRuntimeUniforms, registerDefaultOuts, registerUniform } from './renderer/uniforms/registryRuntime'

const Gmap = () => {
  const canvasRef = useRef(null)
  const controls = useControls4D()
  
  // Store WebGL context and renderer for re-rendering
  const webglRef = useRef({ gl: null, renderer: null, baseVertices: null, edges: null })

  // Setup WebGL (re-init if the set of required uniforms changes)
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const gl = createWebGL2Context(canvas, { width: 512, height: 512 })

    // Runtime uniform registration: collect from hooks
    resetRuntimeUniforms()
    registerDefaultOuts()
    for (const u of controls.uniforms) registerUniform(u.name, u.type, u.size)

    const renderer = initRenderer4D(gl)

    // Create hypercube data
    const hypercube = new HyperCube()
    hypercube.makeHypercube()
    
    // Get all 16 vertex coordinates
    const baseVertices = []
    for (let i = 0; i < 16; i++) {
      baseVertices.push(hypercube.getVertexCoords(i))
    }
    const edges = hypercube.getEdges()

    // Store for re-rendering
    webglRef.current = { gl, renderer, baseVertices, edges }

    return () => {
      if (webglRef.current?.renderer) disposeRenderer4D(webglRef.current.renderer)
      webglRef.current = { gl: null, renderer: null, baseVertices: null, edges: null }
    }

  }, [controls.uniforms])

  // Render function that applies current rotation
  const render = useCallback(() => {
    const { gl, renderer, baseVertices, edges } = webglRef.current
    if (!gl || !renderer) return

    // Apply rotation to all vertices
    const rotatedVertices = baseVertices.map(vertex => controls.rotateVertex4D(vertex))

    renderFrame4D(renderer, {
      resolution: [512, 512],
      light4DPos: controls.light4DPos,
      camera3DPos: controls.camera3DPos, cameraTarget: controls.cameraTarget, cameraUp: controls.cameraUp, cameraForward: controls.cameraForward, shadowPlaneCenter: controls.shadowPlaneCenter, shadowPlaneDistance: controls.shadowPlaneDistance,
      camera4DPos: controls.camera4DPos, camera4DTarget: controls.camera4DTarget, camera4DForward: controls.camera4DForward,
      rotation: controls.rotation,
      frustumParams: controls.frustumParams, selectedDimension: controls.selectedDimension,
      orthographicMode: controls.orthographicMode, orthographicSlice: controls.orthographicSlice, orthographicBounds: controls.orthographicBounds,
      showWireframe: controls.showWireframe,
      rotatedVertices,
      edges
    })
  }, [controls])

  // Re-render when rotation, light position, camera, or frustum changes
  useEffect(() => {
    render()
  }, [controls, render])

  return (
    <PageWrapper style={{ padding: '2rem' }}>
      <h2>Gmap </h2>
      <p>An implementation of a generalized map</p>
      <Canvas 
        ref={canvasRef} 
        width={512} 
        height={512}
        {...controls.mouseHandlers}
      />
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <strong>Controls:</strong><br/>
        {controls.instructions.map((line, i) => (<span key={i}>• <strong>{line}</strong><br/></span>))}
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