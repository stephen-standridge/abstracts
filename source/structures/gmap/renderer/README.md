# Renderer overview (4D pipeline)

Modules
- `webglContext.js`: creates WebGL2 context, viewport and blend state
- `programFactory.js`: compile/link helpers, fetch uniform/attrib locations
- `fullscreenQuad.js`: uploads and draws a screen-filling quad
- `uniforms/registryRuntime.js`: runtime registry for uniforms/outs
  - `registerUniform(name,type,size?)`, `resetRuntimeUniforms()`, `getRuntimeUniforms()`
- `shaderAssembler.js`: generates header and concatenates shader modules
- `shaderSources.js`: builds fragment shader from runtime registry and module sources; exports vertex shader
- `renderer4d.js`: renderer orchestrator (init → render → dispose)

Flow
1) Hooks declare needed uniforms and return them via `useControls4D().uniforms`
2) Caller resets and registers these uniforms with the runtime registry
3) `initRenderer4D` builds the fragment shader from the registry and initializes the program
4) `renderFrame4D` uploads all values (camera, frustum, ortho, rotations, geometry) and draws the quad

Design principles
- No static uniform lists: everything comes from hooks at runtime
- Modular GLSL: common 4D helpers, SDF/tracing, wireframe helpers, main body
- Single-pass screen renderer; wireframe rendered in-fragment (with CPU-projected vertices for perspective)

Adding features
- Add a hook for new state and inputs; have it return its `uniforms`
- Register these uniforms before calling `initRenderer4D`
- In shaders, read the new uniforms in the appropriate module (no `#version` or uniform duplicates)

Performance tips
- Cache CPU wireframe projections until camera/rotation change
- Lower Gauss–Newton iterations if residual is small
- Prefer disabling wireframe when not needed
