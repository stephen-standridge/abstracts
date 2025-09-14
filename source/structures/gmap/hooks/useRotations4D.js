import { useState, useCallback } from 'react'

export function useRotations4D() {
  const uniforms = [
    { name: 'rotationXY', type: 'float' },
    { name: 'rotationXZ', type: 'float' },
    { name: 'rotationYZ', type: 'float' },
    { name: 'rotationXW', type: 'float' },
    { name: 'rotationYW', type: 'float' },
    { name: 'rotationZW', type: 'float' }
  ]

  const [rotation, setRotation] = useState({ xy: 0, xz: 0, yz: 0, xw: 0, yw: 0, zw: 0 })

  const rotatePrimary4D = useCallback((dx, dy) => {
    const rotationSpeed = 0.01
    setRotation(prev => ({ ...prev, xw: prev.xw - dx * rotationSpeed, yw: prev.yw - dy * rotationSpeed }))
  }, [])

  const rotate3DLike = useCallback((dx, dy) => {
    const rotationSpeed = 0.01
    setRotation(prev => ({ ...prev, xy: prev.xy - dx * rotationSpeed, xz: prev.xz - dy * rotationSpeed }))
  }, [])

  const resetRotation = useCallback(() => setRotation({ xy: 0, xz: 0, yz: 0, xw: 0, yw: 0, zw: 0 }), [])

  const rotateVertex4D = useCallback((vertex) => {
    const { xy, xz, yz, xw, yw, zw } = rotation
    let [x, y, z, w] = vertex
    if (xy !== 0) { const c = Math.cos(xy), s = Math.sin(xy); const nx = x * c - y * s; const ny = x * s + y * c; x = nx; y = ny }
    if (xz !== 0) { const c = Math.cos(xz), s = Math.sin(xz); const nx = x * c - z * s; const nz = x * s + z * c; x = nx; z = nz }
    if (yz !== 0) { const c = Math.cos(yz), s = Math.sin(yz); const ny = y * c - z * s; const nz = y * s + z * c; y = ny; z = nz }
    if (xw !== 0) { const c = Math.cos(xw), s = Math.sin(xw); const nx = x * c - w * s; const nw = x * s + w * c; x = nx; w = nw }
    if (yw !== 0) { const c = Math.cos(yw), s = Math.sin(yw); const ny = y * c - w * s; const nw = y * s + w * c; y = ny; w = nw }
    if (zw !== 0) { const c = Math.cos(zw), s = Math.sin(zw); const nz = z * c - w * s; const nw = z * s + w * c; z = nz; w = nw }
    return [x, y, z, w]
  }, [rotation])

  const onKeyDown = (e) => { if (e.key === 'h' || e.key === 'H') resetRotation() }

  const instructions = [
    'Left drag: XW + YW rotations (primary 4D)',
    'Right drag: XY + XZ rotations (3D-like)',
    "Key 'H': Reset rotations"
  ]

  return { uniforms, rotation, rotatePrimary4D, rotate3DLike, resetRotation, rotateVertex4D, onKeyDown, instructions }
}


