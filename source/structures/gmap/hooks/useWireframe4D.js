import { useState, useCallback } from 'react'

export function useWireframe4D() {
  const uniforms = [ { name: 'showWireframe', type: 'bool' }, { name: 'wireDebugCompare', type: 'bool' }, { name: 'useCPUWireframe', type: 'bool' }, { name: 'projected2D', type: 'vec2', size: 16 }, { name: 'vertices', type: 'vec4', size: 16 }, { name: 'edges', type: 'int', size: 96 } ]
  const [showWireframe, setShowWireframe] = useState(false)
  const toggleWireframe = useCallback(() => setShowWireframe(v => !v), [])
  const onKeyDown = useCallback((e) => { if (e.key.toLowerCase() === 'w') toggleWireframe() }, [toggleWireframe])
  const instructions = ["Key 'W': Toggle wireframe"]
  return { uniforms, showWireframe, toggleWireframe, onKeyDown, instructions }
}


