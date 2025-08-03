import { useState, useRef, useCallback, useEffect } from 'react'

export function use4DRotation() {
  // Track rotation angles for all 6 possible 4D planes
  const [rotation, setRotation] = useState({
    xy: 0,    // XY plane rotation (traditional Z-axis rotation)
    xz: 0,    // XZ plane rotation (traditional Y-axis rotation)  
    yz: 0,    // YZ plane rotation (traditional X-axis rotation)
    xw: 0,    // XW plane rotation (4D rotation)
    yw: 0,    // YW plane rotation (4D rotation)
    zw: 0,    // ZW plane rotation (4D rotation)
  })

  // Track 4D light position using enhanced spherical coordinates
  const [lightParams, setLightParams] = useState({ 
    theta: 0,     // Azimuth angle
    phi: 0,       // Elevation angle  
    radius: 3.0,  // Distance from origin
    w: 3.0        // 4D W coordinate
  })
  
  // Convert enhanced spherical to cartesian for 4D light position
  const light4DPos = [
    lightParams.radius * Math.cos(lightParams.phi) * Math.cos(lightParams.theta), // X
    lightParams.radius * Math.cos(lightParams.phi) * Math.sin(lightParams.theta), // Y  
    lightParams.radius * Math.sin(lightParams.phi),                               // Z
    lightParams.w                                                                  // W
  ]

  const isDragging = useRef(false)
  const mouseButton = useRef(0) // 0 = left, 2 = right
  const lastMouse = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e) => {
    isDragging.current = true
    mouseButton.current = e.button
    lastMouse.current = { x: e.clientX, y: e.clientY }
    e.preventDefault() // Prevent context menu on right click
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return

    const deltaX = e.clientX - lastMouse.current.x
    const deltaY = e.clientY - lastMouse.current.y
    const rotationSpeed = 0.01
    const lightSpeed = 0.02
    
    if (e.shiftKey && mouseButton.current === 0) {
      // Shift+Left: Light orbital motion (azimuth + elevation)
      setLightParams(prev => ({
        ...prev,
        theta: prev.theta + deltaX * lightSpeed,  // Azimuth 
        phi: Math.max(-Math.PI/2, Math.min(Math.PI/2, prev.phi - deltaY * lightSpeed)) // Elevation
      }))
    } else if (e.shiftKey && mouseButton.current === 2) {
      // Shift+Right: Light distance and 4D W positioning
      const radiusSpeed = 0.05
      const wSpeed = 0.03
      setLightParams(prev => ({
        ...prev,
        radius: Math.max(0.5, prev.radius + deltaY * radiusSpeed), // Zoom in/out (clamped to min distance)
        w: prev.w + deltaX * wSpeed // 4D W coordinate movement
      }))
    } else if (mouseButton.current === 0) {
      // Left button: XW and YW rotations (primary 4D rotations)
      setRotation(prev => ({
        ...prev,
        xw: prev.xw - deltaX * rotationSpeed, // XW plane rotation (4D)
        yw: prev.yw - deltaY * rotationSpeed, // YW plane rotation (4D)
      }))
    } else if (mouseButton.current === 2) {
      // Right button: XY and XZ rotations (3D-like rotations)
      setRotation(prev => ({
        ...prev,
        xy: prev.xy - deltaX * rotationSpeed, // XY plane rotation (Z-axis)
        xz: prev.xz - deltaY * rotationSpeed, // XZ plane rotation (Y-axis)
      }))
    }

    lastMouse.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  // Reset light position and parameters
  const resetLight = useCallback(() => {
    setLightParams({ theta: 0, phi: 0, radius: 3.0, w: 3.0 })
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

  // Apply all 6 rotation planes sequentially to a 4D vertex
  const rotateVertex4D = useCallback((vertex) => {
    const { xy, xz, yz, xw, yw, zw } = rotation
    let [x, y, z, w] = vertex
    
    // Apply XY rotation (around Z axis)
    if (xy !== 0) {
      const cosXY = Math.cos(xy), sinXY = Math.sin(xy)
      const newX = x * cosXY - y * sinXY
      const newY = x * sinXY + y * cosXY
      x = newX; y = newY
    }
    
    // Apply XZ rotation (around Y axis)  
    if (xz !== 0) {
      const cosXZ = Math.cos(xz), sinXZ = Math.sin(xz)
      const newX = x * cosXZ - z * sinXZ
      const newZ = x * sinXZ + z * cosXZ
      x = newX; z = newZ
    }
    
    // Apply YZ rotation (around X axis)
    if (yz !== 0) {
      const cosYZ = Math.cos(yz), sinYZ = Math.sin(yz)
      const newY = y * cosYZ - z * sinYZ
      const newZ = y * sinYZ + z * cosYZ
      y = newY; z = newZ
    }
    
    // Apply XW rotation (4D rotation)
    if (xw !== 0) {
      const cosXW = Math.cos(xw), sinXW = Math.sin(xw)
      const newX = x * cosXW - w * sinXW
      const newW = x * sinXW + w * cosXW
      x = newX; w = newW
    }
    
    // Apply YW rotation (4D rotation)  
    if (yw !== 0) {
      const cosYW = Math.cos(yw), sinYW = Math.sin(yw)
      const newY = y * cosYW - w * sinYW
      const newW = y * sinYW + w * cosYW
      y = newY; w = newW
    }
    
    // Apply ZW rotation (4D rotation)
    if (zw !== 0) {
      const cosZW = Math.cos(zw), sinZW = Math.sin(zw)
      const newZ = z * cosZW - w * sinZW
      const newW = z * sinZW + w * cosZW
      z = newZ; w = newW
    }
    
    return [x, y, z, w]
  }, [rotation])

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
      onContextMenu: (e) => e.preventDefault(), // Prevent right-click context menu
    }
  }
}