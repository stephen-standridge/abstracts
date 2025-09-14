import { useState, useMemo, useCallback } from 'react'

export function useCamera4D() {
  // Uniforms used by this hook
  const uniforms = [
    { name: 'resolution', type: 'vec2' },
    { name: 'cameraPos', type: 'vec3' },
    { name: 'cameraTarget', type: 'vec3' },
    { name: 'cameraUp', type: 'vec3' },
    { name: 'cameraForward', type: 'vec3' },
    { name: 'shadowPlaneCenter', type: 'vec3' },
    { name: 'shadowPlaneDistance', type: 'float' },
    { name: 'camera4DPos', type: 'vec4' },
    { name: 'camera4DTarget', type: 'vec4' },
    { name: 'camera4DForward', type: 'vec4' },
    { name: 'wVariationScale', type: 'float' }
  ]

  const [cameraParams, setCameraParams] = useState({
    theta: Math.PI * 0.25,
    phi: Math.PI * 0.2,
    radius: 5.0,
    w: 3.0,
    targetW: 0.0
  })

  const camera4DTarget = useMemo(() => [0, 0, 0, cameraParams.targetW], [cameraParams.targetW])

  const camera4DPos = useMemo(() => [
    camera4DTarget[0] + cameraParams.radius * Math.cos(cameraParams.phi) * Math.cos(cameraParams.theta),
    camera4DTarget[1] + cameraParams.radius * Math.cos(cameraParams.phi) * Math.sin(cameraParams.theta),
    camera4DTarget[2] + cameraParams.radius * Math.sin(cameraParams.phi),
    cameraParams.w
  ], [cameraParams.theta, cameraParams.phi, cameraParams.radius, cameraParams.w, camera4DTarget])

  const camera4DForward = useMemo(() => {
    const dir = [
      camera4DTarget[0] - camera4DPos[0],
      camera4DTarget[1] - camera4DPos[1],
      camera4DTarget[2] - camera4DPos[2],
      camera4DTarget[3] - camera4DPos[3]
    ]
    const len = Math.hypot(dir[0], dir[1], dir[2], dir[3]) || 1
    return [dir[0]/len, dir[1]/len, dir[2]/len, dir[3]/len]
  }, [camera4DTarget, camera4DPos])

  const camera3DPos = useMemo(() => [camera4DPos[0], camera4DPos[1], camera4DPos[2]], [camera4DPos])
  const cameraTarget = useMemo(() => [camera4DTarget[0], camera4DTarget[1], camera4DTarget[2]], [camera4DTarget])
  const cameraUp = [0, 1, 0]
  const cameraForward = useMemo(() => [camera4DForward[0], camera4DForward[1], camera4DForward[2]], [camera4DForward])
  const shadowPlaneCenter = [0, 0, 0]
  const shadowPlaneDistance = 2.0

  // Actions (called by aggregator based on input state)
  const orbit = useCallback((deltaX, deltaY) => {
    const cameraSpeed = 0.02
    setCameraParams(prev => ({
      ...prev,
      theta: prev.theta + deltaX * cameraSpeed,
      phi: Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, prev.phi - deltaY * cameraSpeed))
    }))
  }, [])

  const zoom = useCallback((deltaY) => {
    const zoomSpeed = 0.1
    setCameraParams(prev => ({
      ...prev,
      radius: Math.max(1.5, Math.min(10.0, prev.radius + deltaY * zoomSpeed))
    }))
  }, [])

  const moveWTargetW = useCallback((deltaX, deltaY) => {
    const wSpeed = 0.03
    setCameraParams(prev => ({
      ...prev,
      w: prev.w + deltaX * wSpeed,
      targetW: prev.targetW + deltaY * wSpeed
    }))
  }, [])

  const moveWOnly = useCallback((deltaY) => {
    const wCameraSpeed = 0.05
    setCameraParams(prev => ({
      ...prev,
      w: prev.w + deltaY * wCameraSpeed
    }))
  }, [])

  const resetCamera = useCallback(() => {
    setCameraParams({ theta: Math.PI * 0.25, phi: Math.PI * 0.2, radius: 5.0, w: 3.0, targetW: 0.0 })
  }, [])

  const instructions = [
    'Alt+Left drag: Camera orbit (azimuth/elevation)',
    'Alt+Right drag: Camera zoom',
    'Ctrl+Left drag: Camera W and target W',
    'Ctrl+Right drag: Camera W only',
    "Key 'C': Reset camera"
  ]

  const onKeyDown = useCallback((e) => {
    if (e.key === 'c' || e.key === 'C') resetCamera()
  }, [resetCamera])

  return {
    uniforms,
    camera4DPos, camera4DTarget, camera4DForward,
    camera3DPos, cameraTarget, cameraUp, cameraForward, shadowPlaneCenter, shadowPlaneDistance,
    orbit, zoom, moveWTargetW, moveWOnly, resetCamera,
    instructions, onKeyDown
  }
}


