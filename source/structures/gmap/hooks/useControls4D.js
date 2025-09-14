import { useMemo, useRef, useCallback, useEffect } from 'react'
import { useCamera4D } from './useCamera4D'
import { useLight4D } from './useLight4D'
import { useRotations4D } from './useRotations4D'
import { useFrustum4D } from './useFrustum4D'
import { useOrtho4D } from './useOrtho4D'
import { useWireframe4D } from './useWireframe4D'

export function useControls4D() {
  const camera = useCamera4D()
  const light = useLight4D()
  const rotations = useRotations4D()
  const frustum = useFrustum4D()
  const ortho = useOrtho4D()
  const wire = useWireframe4D()

  // Provide uniforms used by all subhooks so the caller can register before shader creation
  const uniforms = useMemo(() => {
    const arrays = [camera.uniforms, light.uniforms, rotations.uniforms, frustum.uniforms, ortho.uniforms, wire.uniforms]
    const map = new Map()
    for (const arr of arrays) for (const u of arr) map.set(u.name + (u.size || ''), u)
    return Array.from(map.values())
  }, [camera, light, rotations, frustum, ortho, wire])

  const isDragging = useRef(false)
  const mouseButton = useRef(0)
  const lastMouse = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e) => {
    isDragging.current = true
    mouseButton.current = e.button
    lastMouse.current = { x: e.clientX, y: e.clientY }
    e.preventDefault()
  }, [])

  const onMouseUp = useCallback(() => { isDragging.current = false }, [])

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastMouse.current.x
    const dy = e.clientY - lastMouse.current.y

    if (e.altKey && mouseButton.current === 0) camera.orbit(dx, dy)
    else if (e.altKey && mouseButton.current === 2) camera.zoom(dy)
    else if (e.ctrlKey && mouseButton.current === 0) camera.moveWTargetW(dx, dy)
    else if (e.ctrlKey && mouseButton.current === 2) camera.moveWOnly(dy)
    else if (e.shiftKey && mouseButton.current === 0) light.orbit(dx, dy)
    else if (e.shiftKey && mouseButton.current === 2) light.changeDistanceAndW(dy, dx)
    else if (mouseButton.current === 1) {
      if (ortho.orthographicMode) ortho.adjustOrthoBounds(dx, dy)
      else frustum.adjustSelected(dy)
    } else if (mouseButton.current === 0) rotations.rotatePrimary4D(dx, dy)
    else if (mouseButton.current === 2) rotations.rotate3DLike(dx, dy)

    lastMouse.current = { x: e.clientX, y: e.clientY }
  }, [camera, light, ortho, frustum, rotations])

  useEffect(() => {
    const onKeyDown = (e) => {
      camera.onKeyDown(e); light.onKeyDown(e); rotations.onKeyDown(e); frustum.onKeyDown(e); ortho.onKeyDown(e); wire.onKeyDown(e)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [camera, light, rotations, frustum, ortho, wire])

  const mouseHandlers = useMemo(() => ({ onMouseDown, onMouseMove, onMouseUp, onMouseLeave: onMouseUp, onContextMenu: (e) => e.preventDefault() }), [onMouseDown, onMouseMove, onMouseUp])

  const instructions = useMemo(() => {
    const list = [...camera.instructions, ...light.instructions, ...rotations.instructions, ...frustum.instructions, ...ortho.instructions, ...wire.instructions]
    const seen = new Set(); const out = []
    for (const s of list) { if (!seen.has(s)) { seen.add(s); out.push(s) } }
    return out
  }, [camera, light, rotations, frustum, ortho, wire])

  return {
    uniforms,
    rotation: rotations.rotation,
    light4DPos: light.light4DPos,
    camera4DPos: camera.camera4DPos, camera4DTarget: camera.camera4DTarget, camera4DForward: camera.camera4DForward,
    camera3DPos: camera.camera3DPos, cameraTarget: camera.cameraTarget, cameraUp: camera.cameraUp, cameraForward: camera.cameraForward,
    shadowPlaneCenter: camera.shadowPlaneCenter, shadowPlaneDistance: camera.shadowPlaneDistance,
    frustumParams: frustum.frustumParams, selectedDimension: frustum.selectedDimension,
    orthographicMode: ortho.orthographicMode, orthographicSlice: ortho.orthographicSlice, orthographicBounds: ortho.orthographicBounds,
    showWireframe: wire.showWireframe,
    rotateVertex4D: rotations.rotateVertex4D,
    resetLight: light.resetLight,
    resetCamera: camera.resetCamera,
    resetRotation: rotations.resetRotation,
    resetFrustumBounds: frustum.resetFrustumBounds,
    resetOrthographic: ortho.resetOrthographic,
    mouseHandlers,
    instructions
  }
}


