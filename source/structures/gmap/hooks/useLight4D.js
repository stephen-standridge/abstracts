import { useState, useMemo, useCallback } from 'react'

export function useLight4D() {
  const uniforms = [{ name: 'light4DPos', type: 'vec4' }]

  const [lightParams, setLightParams] = useState({ theta: 0, phi: 0, radius: 3.0, w: 3.0 })

  const light4DPos = useMemo(() => ([
    lightParams.radius * Math.cos(lightParams.phi) * Math.cos(lightParams.theta),
    lightParams.radius * Math.cos(lightParams.phi) * Math.sin(lightParams.theta),
    lightParams.radius * Math.sin(lightParams.phi),
    lightParams.w
  ]), [lightParams])

  const orbit = useCallback((dx, dy) => {
    const speed = 0.02
    setLightParams(prev => ({ ...prev, theta: prev.theta + dx * speed, phi: Math.max(-Math.PI/2, Math.min(Math.PI/2, prev.phi - dy * speed)) }))
  }, [])

  const changeDistanceAndW = useCallback((dy, dx) => {
    const rSpeed = 0.05, wSpeed = 0.03
    setLightParams(prev => ({ ...prev, radius: Math.max(0.5, prev.radius + dy * rSpeed), w: prev.w + dx * wSpeed }))
  }, [])

  const resetLight = useCallback(() => setLightParams({ theta: 0, phi: 0, radius: 3.0, w: 3.0 }), [])

  const onKeyDown = useCallback((e) => { if (e.key === 'r' || e.key === 'R') resetLight() }, [resetLight])

  const instructions = [
    'Shift+Left drag: Light orbit (azimuth/elevation)',
    'Shift+Right drag: Light distance and W',
    "Key 'R': Reset light"
  ]

  return { uniforms, light4DPos, orbit, changeDistanceAndW, resetLight, onKeyDown, instructions }
}


