import { useState, useCallback } from 'react'

export function useFrustum4D() {
  const uniforms = [ { name: 'frustumBounds', type: 'mat4' }, { name: 'selectedDim', type: 'int' } ]

  const [frustumParams, setFrustumParams] = useState({
    x: { min: -2.0, max: 2.0 },
    y: { min: -2.0, max: 2.0 },
    z: { min: -2.0, max: 2.0 },
    w: { min: -4.0, max: 4.0 }
  })
  const [selectedDimension, setSelectedDimension] = useState('x')

  const adjustSelected = useCallback((deltaY) => {
    const speed = 0.02
    const delta = deltaY * speed
    setFrustumParams(prev => {
      const curr = prev[selectedDimension]
      return { ...prev, [selectedDimension]: { min: curr.min - delta, max: curr.max + delta } }
    })
  }, [selectedDimension])

  const resetFrustumBounds = useCallback(() => {
    setFrustumParams({ x: { min: -2.0, max: 2.0 }, y: { min: -2.0, max: 2.0 }, z: { min: -2.0, max: 2.0 }, w: { min: -4.0, max: 4.0 } })
  }, [])

  const onKeyDown = useCallback((e) => {
    if (e.key === '1') setSelectedDimension('x')
    if (e.key === '2') setSelectedDimension('y')
    if (e.key === '3') setSelectedDimension('z')
    if (e.key === '4') setSelectedDimension('w')
    if (e.key === '5') resetFrustumBounds()
  }, [resetFrustumBounds])

  const instructions = [
    "Keys '1'..'4': Select X/Y/Z/W for frustum",
    "Key '5': Reset frustum",
    'Middle drag (normal mode): Adjust selected frustum bounds'
  ]

  return { uniforms, frustumParams, selectedDimension, adjustSelected, resetFrustumBounds, setSelectedDimension, onKeyDown, instructions }
}


