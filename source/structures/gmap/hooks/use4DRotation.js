import { useState, useRef, useCallback, useEffect } from 'react'

export function use4DRotation() {
  // Track rotation angles for different 4D planes
  const [rotation, setRotation] = useState({
    xy: 0,    // XY plane rotation (traditional Z-axis rotation)
    xz: 0,    // XZ plane rotation (traditional Y-axis rotation)
    xw: 0,    // XW plane rotation (4D rotation)
    yw: 0,    // YW plane rotation (4D rotation)
  })

  // Track 4D light position using spherical coordinates for orbital motion
  const [lightAngles, setLightAngles] = useState({ theta: 0, phi: 0 }) // theta = azimuth, phi = elevation
  const lightRadius = 3.0
  const lightW = 3.0
  
  // Convert spherical to cartesian for 4D light position
  const light4DPos = [
    lightRadius * Math.cos(lightAngles.phi) * Math.cos(lightAngles.theta), // X
    lightRadius * Math.cos(lightAngles.phi) * Math.sin(lightAngles.theta), // Y  
    lightRadius * Math.sin(lightAngles.phi),                               // Z
    lightW                                                                  // W
  ]

  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e) => {
    isDragging.current = true
    lastMouse.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return

    const deltaX = e.clientX - lastMouse.current.x
    const deltaY = e.clientY - lastMouse.current.y
    
    if (e.shiftKey) {
      // Shift+drag: Rotate light around center (orbital motion)
      const lightSpeed = 0.02
      setLightAngles(prev => ({
        theta: prev.theta + deltaX * lightSpeed,  // Azimuth (horizontal rotation)
        phi: Math.max(-Math.PI/2, Math.min(Math.PI/2, prev.phi - deltaY * lightSpeed)) // Elevation (clamped)
      }))
    } else {
      // Normal drag: Rotate hypercube
      const rotationSpeed = 0.01
      setRotation(prev => ({
        ...prev,
        // Map mouse X to XW rotation (4D rotation around W axis)
        xw: prev.xw - deltaX * rotationSpeed,
        // Map mouse Y to YW rotation (4D rotation around W axis)  
        yw: prev.yw - deltaY * rotationSpeed,
      }))
    }

    lastMouse.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  // Reset light position
  const resetLight = useCallback(() => {
    setLightAngles({ theta: 0, phi: 0 })
  }, [])

  // Keyboard handler for reset
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        resetLight()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [resetLight])

  // Generate 4D rotation matrix
  const getRotationMatrix4D = useCallback(() => {
    const { xy, xz, xw, yw } = rotation
    
    // Create individual rotation matrices for each plane
    const cosXY = Math.cos(xy), sinXY = Math.sin(xy)
    const cosXZ = Math.cos(xz), sinXZ = Math.sin(xz)
    const cosXW = Math.cos(xw), sinXW = Math.sin(xw)
    const cosYW = Math.cos(yw), sinYW = Math.sin(yw)
    
    // Combined 4D rotation matrix (simplified for XW and YW rotations)
    return [
      cosXW * cosYW,  -sinXW * cosYW,  0,           sinYW,
      sinXW,          cosXW,           0,           0,
      0,              0,               1,           0,
      -sinYW * cosXW, sinYW * sinXW,   0,           cosYW
    ]
  }, [rotation])

  // Apply rotation to a 4D vertex
  const rotateVertex4D = useCallback((vertex) => {
    const matrix = getRotationMatrix4D()
    const [x, y, z, w] = vertex
    
    return [
      matrix[0] * x + matrix[1] * y + matrix[2] * z + matrix[3] * w,
      matrix[4] * x + matrix[5] * y + matrix[6] * z + matrix[7] * w,
      matrix[8] * x + matrix[9] * y + matrix[10] * z + matrix[11] * w,
      matrix[12] * x + matrix[13] * y + matrix[14] * z + matrix[15] * w
    ]
  }, [getRotationMatrix4D])

  return {
    rotation,
    light4DPos,
    rotateVertex4D,
    resetLight,
    mouseHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp, // Stop dragging if mouse leaves canvas
    }
  }
}