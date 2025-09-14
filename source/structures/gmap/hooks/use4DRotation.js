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

  // Track 4D camera frustum bounds for collapsing (relative to camera position)
  const [frustumParams, setFrustumParams] = useState({
    x: { min: -2.0, max: 2.0 },  // X dimension viewing bounds
    y: { min: -2.0, max: 2.0 },  // Y dimension viewing bounds
    z: { min: -2.0, max: 2.0 },  // Z dimension viewing bounds
    w: { min: -4.0, max: 4.0 }   // W dimension viewing bounds (wider for better initial visibility)
  })

  // Track which dimension is currently selected for editing
  const [selectedDimension, setSelectedDimension] = useState('x') // 'x', 'y', 'z', or 'w'
  
  // Track orthographic/flattening mode
  const [orthographicMode, setOrthographicMode] = useState(null) // null, 'x', 'y', 'z', or 'w'
  const [orthographicSlice, setOrthographicSlice] = useState(0.0) // Which slice/plane to show when flattened
  
  // Track wireframe visibility
  const [showWireframe, setShowWireframe] = useState(false) // Whether to show 4D hypercube wireframe
  
  // Track orthographic viewing bounds (scale of the orthographic projection)
  const [orthographicBounds, setOrthographicBounds] = useState({
    x: { min: -3.0, max: 3.0 },  // X viewing bounds for orthographic projection
    y: { min: -3.0, max: 3.0 },  // Y viewing bounds for orthographic projection  
    z: { min: -3.0, max: 3.0 },  // Z viewing bounds for orthographic projection
    w: { min: -3.0, max: 3.0 }   // W viewing bounds for orthographic projection
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
                  } else if (mouseButton.current === 1) {
                // Middle mouse: Adjust bounds based on current mode
                const speed = 0.02
                const deltaXBounds = deltaX * speed // Left/right mouse controls first visible dimension
                const deltaYBounds = deltaY * speed // Up/down mouse controls second visible dimension
                
                if (orthographicMode) {
                  // In orthographic mode: adjust the two visible dimensions for the flattened view
                  setOrthographicBounds(prev => {
                    let firstDim, secondDim
                    
                    // Determine which two dimensions are visible for each orthographic mode
                    if (orthographicMode === 'x') { // X-flattened: Y and Z are visible
                      firstDim = 'y'  // Screen X controls Y bounds
                      secondDim = 'z' // Screen Y controls Z bounds
                    } else if (orthographicMode === 'y') { // Y-flattened: X and Z are visible
                      firstDim = 'x'  // Screen X controls X bounds
                      secondDim = 'z' // Screen Y controls Z bounds
                    } else if (orthographicMode === 'z') { // Z-flattened: X and Y are visible
                      firstDim = 'x'  // Screen X controls X bounds
                      secondDim = 'y' // Screen Y controls Y bounds
                    } else if (orthographicMode === 'w') { // W-flattened: X and Y are visible
                      firstDim = 'x'  // Screen X controls X bounds
                      secondDim = 'y' // Screen Y controls Y bounds
                    }
                    
                    const newFirstBounds = {
                      min: prev[firstDim].min - deltaXBounds,
                      max: prev[firstDim].max + deltaXBounds
                    }
                    const newSecondBounds = {
                      min: prev[secondDim].min - deltaYBounds,
                      max: prev[secondDim].max + deltaYBounds
                    }
                    
                    console.log(`Adjusting orthographic bounds: ${firstDim.toUpperCase()} by ${deltaXBounds.toFixed(3)} -> [${newFirstBounds.min.toFixed(2)}, ${newFirstBounds.max.toFixed(2)}], ${secondDim.toUpperCase()} by ${deltaYBounds.toFixed(3)} -> [${newSecondBounds.min.toFixed(2)}, ${newSecondBounds.max.toFixed(2)}]`)
                    
                    return {
                      ...prev,
                      [firstDim]: newFirstBounds,
                      [secondDim]: newSecondBounds
                    }
                  })
                } else {
                  // In perspective mode: adjust frustum bounds (clipping) - single dimension selected
                  const delta = deltaYBounds // Use Y movement for perspective mode
                  setFrustumParams(prev => {
                    const newBounds = {
                      min: prev[selectedDimension].min - delta,
                      max: prev[selectedDimension].max + delta
                    }
                    console.log(`Adjusting frustum ${selectedDimension.toUpperCase()} bounds by ${delta.toFixed(3)} -> [${newBounds.min.toFixed(2)}, ${newBounds.max.toFixed(2)}]`)
                    return {
                      ...prev,
                      [selectedDimension]: newBounds
                    }
                  })
                }
              } else if (e.shiftKey && mouseButton.current === 1) {
                // Shift+Middle mouse: Adjust orthographic projection offset when in orthographic mode
                // Note: Currently disabled for true orthographic projection, but orthographic bounds work!
                if (orthographicMode) {
                  console.log(`Orthographic projection offset control - currently disabled, but use middle mouse (no shift) to adjust orthographic viewing bounds!`)
                  // const sliceSpeed = 0.05
                  // const sliceDelta = deltaY * sliceSpeed
                  // setOrthographicSlice(prev => {
                  //   const newSlice = prev + sliceDelta
                  //   console.log(`Adjusting ${orthographicMode.toUpperCase()} projection offset by ${sliceDelta.toFixed(3)} -> ${newSlice.toFixed(2)}`)
                  //   return newSlice
                  // })
                }
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
    }, [selectedDimension, orthographicMode]) // Add selectedDimension and orthographicMode to dependencies

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
    // Also reset frustum bounds when camera resets
    setFrustumParams({
      x: { min: -2.0, max: 2.0 },
      y: { min: -2.0, max: 2.0 },
      z: { min: -2.0, max: 2.0 },
      w: { min: -4.0, max: 4.0 }  // Wider W bounds for better visibility
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

  // Removed adjustFrustumBounds function - now handled inline to avoid stale closure

  // Reset frustum bounds to default
  const resetFrustumBounds = useCallback(() => {
    console.log('Resetting all frustum bounds to default (W: [-4.0, 4.0], others: [-2.0, 2.0])')
    setFrustumParams({
      x: { min: -2.0, max: 2.0 },
      y: { min: -2.0, max: 2.0 },
      z: { min: -2.0, max: 2.0 },
      w: { min: -4.0, max: 4.0 }  // Wider W bounds for better visibility
    })
  }, [])

  // Reset orthographic mode
  const resetOrthographic = useCallback(() => {
    console.log('Resetting orthographic mode to normal 4D view')
    setOrthographicMode(null)
    setOrthographicSlice(0.0)
    // Also reset orthographic bounds
    setOrthographicBounds({
      x: { min: -3.0, max: 3.0 },
      y: { min: -3.0, max: 3.0 },
      z: { min: -3.0, max: 3.0 },
      w: { min: -3.0, max: 3.0 }
    })
  }, [])

  // Keyboard handler for reset and dimension selection
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Reset keys
      if (e.key === 'r' || e.key === 'R') {
        resetLight()
      }
      if (e.key === 'c' || e.key === 'C') {
        resetCamera()
      }
      if (e.key === 'h' || e.key === 'H') {
        resetRotation()
      }
      
              // Dimension selection keys (1,2,3,4 for X,Y,Z,W)
        if (e.key === '1') {
          setSelectedDimension('x')
          console.log('Selected X dimension for bounds adjustment')
        }
        if (e.key === '2') {
          setSelectedDimension('y')
          console.log('Selected Y dimension for bounds adjustment')
        }
        if (e.key === '3') {
          setSelectedDimension('z')
          console.log('Selected Z dimension for bounds adjustment')
        }
        if (e.key === '4') {
          setSelectedDimension('w')
          console.log('Selected W dimension for bounds adjustment')
        }
      
              // Reset frustum bounds (5)
        if (e.key === '5') resetFrustumBounds()
        
        // Orthographic/Flattening mode selection (A,S,D,F,G)
        if (e.key.toLowerCase() === 'a') {
          setOrthographicMode('x')
          console.log('Orthographic mode: X-dimension flattened')
        }
        if (e.key.toLowerCase() === 's') {
          setOrthographicMode('y')
          console.log('Orthographic mode: Y-dimension flattened')
        }
        if (e.key.toLowerCase() === 'd') {
          setOrthographicMode('z')
          console.log('Orthographic mode: Z-dimension flattened')
        }
        if (e.key.toLowerCase() === 'f') {
          setOrthographicMode('w')
          console.log('Orthographic mode: W-dimension flattened')
        }
        if (e.key.toLowerCase() === 'g') {
          setOrthographicMode(null)
          console.log('Orthographic mode: Disabled (normal 4D view)')
        }
        
        // Wireframe toggle (W key)
        if (e.key.toLowerCase() === 'w') {
          setShowWireframe(prev => {
            const newValue = !prev
            console.log(`4D Hypercube wireframe: ${newValue ? 'Enabled' : 'Disabled'}`)
            return newValue
          })
        }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [resetLight, resetCamera, resetRotation, resetFrustumBounds, orthographicMode, selectedDimension])

  // No longer need wheel handler - using middle mouse drag instead

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
    // 4D Frustum data for collapsing
    frustumParams,
    selectedDimension,
    // Orthographic/Flattening mode data
    orthographicMode,
    orthographicSlice,
    orthographicBounds,
    // Wireframe data
    showWireframe,
    rotateVertex4D,
    resetLight,
    resetCamera,
    resetRotation,
    resetFrustumBounds,
    resetOrthographic,
    mouseHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp, // Stop dragging if mouse leaves canvas
      onContextMenu: (e) => e.preventDefault(), // Prevent right-click context menu
    }
  }
}