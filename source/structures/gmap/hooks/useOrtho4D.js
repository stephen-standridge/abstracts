import { useState, useCallback } from 'react'

export function useOrtho4D() {
  const uniforms = [ { name: 'orthographicMode', type: 'int' }, { name: 'orthographicSlice', type: 'float' }, { name: 'orthographicBounds', type: 'mat4' } ]

  const [orthographicMode, setOrthographicMode] = useState(null)
  const [orthographicSlice, setOrthographicSlice] = useState(0.0)
  const [orthographicBounds, setOrthographicBounds] = useState({ x: { min: -3.0, max: 3.0 }, y: { min: -3.0, max: 3.0 }, z: { min: -3.0, max: 3.0 }, w: { min: -3.0, max: 3.0 } })

  const adjustOrthoBounds = useCallback((dx, dy) => {
    const speed = 0.02
    const deltaXBounds = dx * speed
    const deltaYBounds = dy * speed
    setOrthographicBounds(prev => {
      let firstDim, secondDim
      if (orthographicMode === 'x') { firstDim = 'y'; secondDim = 'z' }
      else if (orthographicMode === 'y') { firstDim = 'x'; secondDim = 'z' }
      else if (orthographicMode === 'z') { firstDim = 'x'; secondDim = 'y' }
      else { firstDim = 'x'; secondDim = 'y' }
      const n1 = { min: prev[firstDim].min - deltaXBounds, max: prev[firstDim].max + deltaXBounds }
      const n2 = { min: prev[secondDim].min - deltaYBounds, max: prev[secondDim].max + deltaYBounds }
      return { ...prev, [firstDim]: n1, [secondDim]: n2 }
    })
  }, [orthographicMode])

  const resetOrthographic = useCallback(() => {
    setOrthographicMode(null); setOrthographicSlice(0.0); setOrthographicBounds({ x: { min: -3.0, max: 3.0 }, y: { min: -3.0, max: 3.0 }, z: { min: -3.0, max: 3.0 }, w: { min: -3.0, max: 3.0 } })
  }, [])

  const onKeyDown = useCallback((e) => {
    const k = e.key.toLowerCase()
    if (k === 'a') setOrthographicMode('x')
    if (k === 's') setOrthographicMode('y')
    if (k === 'd') setOrthographicMode('z')
    if (k === 'f') setOrthographicMode('w')
    if (k === 'g') setOrthographicMode(null)
  }, [])

  const instructions = [
    "Keys 'A/S/D/F/G': Ortho flatten X/Y/Z/W or disable",
    'Middle drag (ortho): Adjust visible bounds'
  ]

  return { uniforms, orthographicMode, orthographicSlice, orthographicBounds, setOrthographicMode, setOrthographicSlice, setOrthographicBounds, resetOrthographic, adjustOrthoBounds, onKeyDown, instructions }
}


