import { useState, useRef, useCallback } from 'react'

export function use4DRotation() {
  // Track rotation angles for different 4D planes
  const [rotation, setRotation] = useState({
    xy: 0,    // XY plane rotation (traditional Z-axis rotation)
    xz: 0,    // XZ plane rotation (traditional Y-axis rotation)
    xw: 0,    // XW plane rotation (4D rotation)
    yw: 0,    // YW plane rotation (4D rotation)
  })

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
    
    // Scale down the rotation speed
    const rotationSpeed = 0.01
    
    setRotation(prev => ({
      ...prev,
      // Map mouse X to XW rotation (4D rotation around W axis)
      xw: prev.xw - deltaX * rotationSpeed,
      // Map mouse Y to YW rotation (4D rotation around W axis)  
      yw: prev.yw - deltaY * rotationSpeed,
    }))

    lastMouse.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

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
    rotateVertex4D,
    mouseHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp, // Stop dragging if mouse leaves canvas
    }
  }
}