import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { HyperCube } from './hypercubegmap'

const Gmap = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl2')
    
    if (!gl) {
      console.error('WebGL2 not supported')
      return
    }

    // Set canvas size to match display size
    const shadowResolution = 512
    canvas.width = shadowResolution
    canvas.height = shadowResolution
    
    gl.viewport(0, 0, shadowResolution, shadowResolution)
    gl.clearColor(0.1, 0.1, 0.15, 1.0)

    // Vertex shader - simple pass-through
    const vertexShaderSource = `#version 300 es
      in vec4 position;
      
      void main() {
        gl_Position = position;
      }
    `

    // Fragment shader with 4D shadow casting
    const fragmentShaderSource = `#version 300 es
      precision highp float;
      
      // 4D vector math functions (inline for now)
      float dot4d(vec4 a, vec4 b) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
      }
      
      float length4d(vec4 v) {
        return sqrt(dot4d(v, v));
      }
      
      vec4 normalize4d(vec4 v) {
        float len = length4d(v);
        return len > 0.0 ? v / len : vec4(0.0);
      }
      
      uniform vec4 light4DPos;
      uniform vec4 vertices[16];
      uniform int edges[96]; // 32 edges * 3 values each
      uniform float shadowPlaneW;
      uniform vec2 resolution;
      
      out vec4 outColor;
      
      float distanceToLineSegment(vec2 point, vec2 start, vec2 end) {
        vec2 line = end - start;
        float lineLength2 = dot(line, line);
        if (lineLength2 < 1e-6) return distance(point, start);
        
        float t = max(0.0, min(1.0, dot(point - start, line) / lineLength2));
        vec2 projection = start + t * line;
        return distance(point, projection);
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        vec2 coord = (uv - 0.5) * 4.0; // View range [-2, 2]
        
        vec3 color = vec3(0.1, 0.1, 0.15); // Dark background
        
        // Render edges as lines
        for (int i = 0; i < 32; i++) {
          int idx = i * 3;
          int vertex1Idx = edges[idx];
          int vertex2Idx = edges[idx + 1];
          int dimension = edges[idx + 2];
          
          vec4 v1 = vertices[vertex1Idx];
          vec4 v2 = vertices[vertex2Idx];
          
          // 4D perspective projection for both vertices
          float perspective4D = 2.0;
          vec2 p1 = v1.xy / (perspective4D - v1.w) + v1.z * 0.3;
          vec2 p2 = v2.xy / (perspective4D - v2.w) + v2.z * 0.3;
          
          // Distance to line segment
          float lineDistance = distanceToLineSegment(coord, p1, p2);
          if (lineDistance < 0.02) {
            // Color based on dimension
            if (dimension == 0) color = vec3(1.0, 0.2, 0.2); // X edges - red
            else if (dimension == 1) color = vec3(0.2, 1.0, 0.2); // Y edges - green  
            else if (dimension == 2) color = vec3(0.2, 0.2, 1.0); // Z edges - blue
            else if (dimension == 3) color = vec3(1.0, 1.0, 0.2); // W edges - yellow
          }
        }
        
        // Still render vertices as dots on top
        for (int i = 0; i < 16; i++) {
          vec4 vertex4D = vertices[i];
          
          // 4D perspective projection
          float perspective4D = 2.0;
          vec2 projected = vertex4D.xy / (perspective4D - vertex4D.w) + vertex4D.z * 0.3;
          
          float dist = distance(coord, projected);
          if (dist < 0.05) {
            color = vec3(1.0, 1.0, 1.0); // White dots
          }
        }
        
        outColor = vec4(color, 1.0);
      }
    `

    // Compile shaders
    function compileShader(type, source) {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }

      return shader
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) return

    // Create program
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program))
      return
    }

    gl.useProgram(program)

    // Get uniform locations
    const light4DPosLocation = gl.getUniformLocation(program, 'light4DPos')
    const verticesLocation = gl.getUniformLocation(program, 'vertices')
    const edgesLocation = gl.getUniformLocation(program, 'edges')
    const shadowPlaneWLocation = gl.getUniformLocation(program, 'shadowPlaneW')
    const resolutionLocation = gl.getUniformLocation(program, 'resolution')

    // Create hypercube data
    const hypercube = new HyperCube()
    hypercube.makeHypercube()
    
    // Get all 16 vertex coordinates
    const vertex4DCoords = []
    for (let i = 0; i < 16; i++) {
      vertex4DCoords.push(hypercube.getVertexCoords(i))
    }
    const edges = hypercube.getEdges()



    // Upload uniforms
    gl.uniform4f(light4DPosLocation, 0.0, 0.0, 0.0, 3.0)
    gl.uniform1f(shadowPlaneWLocation, 0.0)
    gl.uniform2f(resolutionLocation, 512, 512)
    
    // Upload vertex data
    const flatVertices = new Float32Array(vertex4DCoords.flat())
    gl.uniform4fv(verticesLocation, flatVertices)
    
    // Upload edge data
    const flatEdges = new Int32Array(edges.flat())
    gl.uniform1iv(edgesLocation, flatEdges)

    // Create fullscreen quad
    const quadVertices = new Float32Array([
      -1, -1, 0, 1,
       1, -1, 0, 1,
      -1,  1, 0, 1,
       1,  1, 0, 1
    ])

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0)

    // Render
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

  }, [])

  return (
    <PageWrapper style={{ padding: '2rem' }}>
      <h2>Gmap </h2>
      <p>An implementation of a generalized map</p>
      <Canvas ref={canvasRef} width={512} height={512} />
      <Link to="/">← Back to Home</Link>
    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const Canvas = styled.canvas`
  border: 2px solid #333;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  background-color: #1a1a2e;
`

export default Gmap