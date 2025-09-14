import { createProgram, getUniformLocations } from './programFactory'
import { vertexShaderSource, buildFragmentShaderSource } from './shaderSources'
import { getRuntimeUniforms, getRuntimeOuts, resetRuntimeUniforms } from './uniforms/registryRuntime'
import { createFullscreenQuad, drawFullscreenQuad } from './fullscreenQuad'
import { uploadResolution, uploadLegacyCamera, uploadCamera4D, uploadRotations, uploadFrustum, uploadOrthographic, uploadLight } from './uniforms4d'
import { projectVerticesCPU } from './wireframeProjector'
import { getUniformNames } from './uniforms/registry'

export function initRenderer4D(gl) {
  // Build fragment shader from runtime-registered uniforms
  const fragmentShaderSource = buildFragmentShaderSource()
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)
  gl.useProgram(program)
  const uniforms = getUniformLocations(gl, program, getRuntimeUniforms().map(u => u.name))
  const quad = createFullscreenQuad(gl, program)
  return { gl, program, uniforms, quad }
}

export function renderFrame4D(ctx, params) {
  const { gl, program, uniforms } = ctx
  gl.useProgram(program)

  const {
    resolution = [512, 512],
    light4DPos,
    camera3DPos, cameraTarget, cameraUp, cameraForward, shadowPlaneCenter, shadowPlaneDistance,
    camera4DPos, camera4DTarget, camera4DForward,
    rotation,
    frustumParams, selectedDimension,
    orthographicMode, orthographicSlice, orthographicBounds,
    showWireframe,
    rotatedVertices,
    edges
  } = params

  // Core uniforms
  uploadLight(gl, uniforms, light4DPos)
  uploadResolution(gl, uniforms, resolution[0], resolution[1])
  uploadLegacyCamera(gl, uniforms, camera3DPos, cameraTarget, cameraUp, cameraForward, shadowPlaneCenter, shadowPlaneDistance)
  uploadCamera4D(gl, uniforms, camera4DPos, camera4DTarget, camera4DForward)
  uploadRotations(gl, uniforms, rotation)
  uploadFrustum(gl, uniforms, frustumParams, selectedDimension)
  uploadOrthographic(gl, uniforms, orthographicMode, orthographicSlice, orthographicBounds)

  // Toggles
  if (uniforms.showWireframe) gl.uniform1i(uniforms.showWireframe, showWireframe ? 1 : 0)
  if (uniforms.wVariationScale) gl.uniform1f(uniforms.wVariationScale, orthographicMode ? 1.0 : 0.0)
  if (uniforms.wireDebugCompare) gl.uniform1i(uniforms.wireDebugCompare, 0)

  // Geometry uniforms
  if (uniforms.vertices) gl.uniform4fv(uniforms.vertices, new Float32Array(rotatedVertices.flat()))
  if (uniforms.edges) gl.uniform1iv(uniforms.edges, new Int32Array(edges.flat()))

  // CPU wireframe projection for perspective
  let useCpuWire = 0
  if (showWireframe && !orthographicMode && uniforms.projected2D && uniforms.useCPUWireframe) {
    useCpuWire = 1
    const projected = projectVerticesCPU(rotatedVertices, camera4DPos, camera4DForward, { fov: 0.8 })
    gl.uniform2fv(uniforms.projected2D, projected)
  }
  if (uniforms.useCPUWireframe) gl.uniform1i(uniforms.useCPUWireframe, useCpuWire)

  // Draw
  gl.clear(gl.COLOR_BUFFER_BIT)
  drawFullscreenQuad(gl)
}

export function disposeRenderer4D(ctx) {
  const { gl, program } = ctx
  if (program) gl.deleteProgram(program)
}


