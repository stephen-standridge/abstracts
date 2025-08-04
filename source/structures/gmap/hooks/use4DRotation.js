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

  // Track 4D camera position and orientation
  const [cameraParams, setCameraParams] = useState({
    theta: Math.PI * 0.25,  // Camera azimuth (45 degrees)
    phi: Math.PI * 0.2,     // Camera elevation (better angle to see shadows) 
    radius: 5.0,            // Camera distance from target
    w: 3.0,                 // 4D W coordinate
    targetW: 0.0            // W coordinate of what camera is looking at
  })
  
  // Convert enhanced spherical to cartesian for 4D light position
  const light4DPos = [
    lightParams.radius * Math.cos(lightParams.phi) * Math.cos(lightParams.theta), // X
    lightParams.radius * Math.cos(lightParams.phi) * Math.sin(lightParams.theta), // Y  
    lightParams.radius * Math.sin(lightParams.phi),                               // Z
    lightParams.w                                                                  // W
  ]

  // Define 4D camera target (what the camera looks at)
  const camera4DTarget = [0, 0, 0, cameraParams.targetW]  // Look at origin with specific W
  
  // Convert camera spherical to 4D cartesian, orbiting around the target
  const camera4DPos = [
    camera4DTarget[0] + cameraParams.radius * Math.cos(cameraParams.phi) * Math.cos(cameraParams.theta), // X
    camera4DTarget[1] + cameraParams.radius * Math.cos(cameraParams.phi) * Math.sin(cameraParams.theta), // Y
    camera4DTarget[2] + cameraParams.radius * Math.sin(cameraParams.phi),                                // Z
    cameraParams.w                                                                                        // W
  ]
  
  // Calculate 4D camera direction (from camera to target)
  const camera4DDirection = [
    camera4DTarget[0] - camera4DPos[0],
    camera4DTarget[1] - camera4DPos[1], 
    camera4DTarget[2] - camera4DPos[2],
    camera4DTarget[3] - camera4DPos[3]
  ]
  const dir4DLength = Math.sqrt(camera4DDirection[0]**2 + camera4DDirection[1]**2 + camera4DDirection[2]**2 + camera4DDirection[3]**2)
  const camera4DForward = [
    camera4DDirection[0] / dir4DLength,
    camera4DDirection[1] / dir4DLength,
    camera4DDirection[2] / dir4DLength,
    camera4DDirection[3] / dir4DLength
  ]
  
  // Legacy 3D compatibility (for shadow plane rendering)
  const camera3DPos = [camera4DPos[0], camera4DPos[1], camera4DPos[2]]
  const cameraTarget = [camera4DTarget[0], camera4DTarget[1], camera4DTarget[2]]
  const cameraUp = [0, 1, 0]
  const cameraForward = [camera4DForward[0], camera4DForward[1], camera4DForward[2]]
  
  // Shadow plane distance from camera
  const shadowPlaneDistance = 2.0

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
    const cameraSpeed = 0.02
    
    if (e.altKey && mouseButton.current === 0) {
      // Alt+Left: Camera orbit around hypercube (azimuth + elevation)
      setCameraParams(prev => ({
        ...prev,
        theta: prev.theta + deltaX * cameraSpeed,
        phi: Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, prev.phi - deltaY * cameraSpeed))
      }))
    } else if (e.altKey && mouseButton.current === 2) {
      // Alt+Right: Camera zoom in/out (orbit distance from target)
      const zoomSpeed = 0.1
      setCameraParams(prev => ({
        ...prev,
        radius: Math.max(1.5, Math.min(10.0, prev.radius + deltaY * zoomSpeed)) // Clamp zoom range
      }))
    } else if (e.ctrlKey && mouseButton.current === 0) {
      // Ctrl+Left: 4D Camera movement (W position and target W)
      const wSpeed = 0.03
      setCameraParams(prev => ({
        ...prev,
        w: prev.w + deltaX * wSpeed,           // Camera W position
        targetW: prev.targetW + deltaY * wSpeed // Target W position (what camera looks at)
      }))
    } else if (e.ctrlKey && mouseButton.current === 2) {
      // Ctrl+Right: 4D Camera W positioning only
      const wCameraSpeed = 0.05
      setCameraParams(prev => ({
        ...prev,
        w: prev.w + deltaY * wCameraSpeed // Move camera in W dimension
      }))
    } else if (e.shiftKey && mouseButton.current === 0) {
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

  // Reset camera position (orbit around hypercube center)
  const resetCamera = useCallback(() => {
    setCameraParams({ 
      theta: Math.PI * 0.25, 
      phi: Math.PI * 0.2, 
      radius: 5.0,
      w: 3.0,
      targetW: 0.0
    })
  }, [])

  // Reset hypercube rotation to identity (no rotation)
  const resetRotation = useCallback(() => {
    setRotation({
      xy: 0,
      xz: 0, 
      yz: 0,
      xw: 0,
      yw: 0,
      zw: 0
    })
  }, [])

  // Keyboard handler for reset
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        resetLight()
      }
      if (e.key === 'c' || e.key === 'C') {
        resetCamera()
      }
      if (e.key === 'h' || e.key === 'H') {
        resetRotation()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [resetLight, resetCamera, resetRotation])

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
    // 4D Camera data
    camera4DPos,
    camera4DTarget,
    camera4DForward,
    // Legacy 3D Camera data (for compatibility)
    camera3DPos,
    cameraTarget,
    cameraUp,
    cameraForward,
    shadowPlaneCenter: [0, 0, 0], // Updated shadow plane center
    shadowPlaneDistance,
    rotateVertex4D,
    resetLight,
    resetCamera,
    resetRotation,
    mouseHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp, // Stop dragging if mouse leaves canvas
      onContextMenu: (e) => e.preventDefault(), // Prevent right-click context menu
    }
  }
}