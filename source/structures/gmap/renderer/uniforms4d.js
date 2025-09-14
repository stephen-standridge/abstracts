export function uploadResolution(gl, u, width, height) {
  gl.uniform2f(u.resolution, width, height)
}

export function uploadLegacyCamera(gl, u, camera3DPos, cameraTarget, cameraUp, cameraForward, shadowPlaneCenter, shadowPlaneDistance) {
  gl.uniform3f(u.cameraPos, ...camera3DPos)
  gl.uniform3f(u.cameraTarget, ...cameraTarget)
  gl.uniform3f(u.cameraUp, ...cameraUp)
  gl.uniform3f(u.cameraForward, ...cameraForward)
  gl.uniform3f(u.shadowPlaneCenter, ...shadowPlaneCenter)
  gl.uniform1f(u.shadowPlaneDistance, shadowPlaneDistance)
}

export function uploadCamera4D(gl, u, camera4DPos, camera4DTarget, camera4DForward) {
  gl.uniform4f(u.camera4DPos, ...camera4DPos)
  gl.uniform4f(u.camera4DTarget, ...camera4DTarget)
  gl.uniform4f(u.camera4DForward, ...camera4DForward)
}

export function uploadRotations(gl, u, rotation) {
  gl.uniform1f(u.rotationXY, rotation.xy)
  gl.uniform1f(u.rotationXZ, rotation.xz)
  gl.uniform1f(u.rotationYZ, rotation.yz)
  gl.uniform1f(u.rotationXW, rotation.xw)
  gl.uniform1f(u.rotationYW, rotation.yw)
  gl.uniform1f(u.rotationZW, rotation.zw)
}

export function uploadFrustum(gl, u, frustumParams, selectedDimension) {
  const frustumMatrix = new Float32Array([
    frustumParams.x.min, frustumParams.x.max, 0, 0,
    frustumParams.y.min, frustumParams.y.max, 0, 0,
    frustumParams.z.min, frustumParams.z.max, 0, 0,
    frustumParams.w.min, frustumParams.w.max, 0, 0
  ])
  gl.uniformMatrix4fv(u.frustumBounds, false, frustumMatrix)
  const dimIndex = { x: 0, y: 1, z: 2, w: 3 }[selectedDimension]
  gl.uniform1i(u.selectedDim, dimIndex)
}

export function uploadOrthographic(gl, u, orthographicMode, orthographicSlice, orthographicBounds) {
  const orthoModeIndex = orthographicMode ? { x: 0, y: 1, z: 2, w: 3 }[orthographicMode] : -1
  gl.uniform1i(u.orthographicMode, orthoModeIndex)
  gl.uniform1f(u.orthographicSlice, orthographicSlice)
  const orthoBoundsMatrix = new Float32Array([
    orthographicBounds.x.min, orthographicBounds.x.max, 0, 0,
    orthographicBounds.y.min, orthographicBounds.y.max, 0, 0,
    orthographicBounds.z.min, orthographicBounds.z.max, 0, 0,
    orthographicBounds.w.min, orthographicBounds.w.max, 0, 0
  ])
  gl.uniformMatrix4fv(u.orthographicBounds, false, orthoBoundsMatrix)
}

export function uploadLight(gl, u, light4DPos) {
  gl.uniform4f(u.light4DPos, ...light4DPos)
}

export function uploadToggles(gl, u, { showWireframe, wVariationScale = 0.0, wireDebugCompare = 0, useCPUWireframe = 1 }) {
  gl.uniform1i(u.showWireframe, showWireframe ? 1 : 0)
  if (u.wVariationScale) gl.uniform1f(u.wVariationScale, wVariationScale)
  if (u.wireDebugCompare) gl.uniform1i(u.wireDebugCompare, wireDebugCompare)
  if (u.useCPUWireframe) gl.uniform1i(u.useCPUWireframe, useCPUWireframe)
}


