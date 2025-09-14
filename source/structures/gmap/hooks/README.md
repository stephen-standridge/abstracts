# Hooks overview (4D controls)

Purpose: Split interaction, state, and uniforms into focused hooks. Each hook:
- Owns its own state and input semantics
- Declares the exact GLSL uniforms it needs (returned as `uniforms` array)
- Returns human-readable `instructions` to surface in UI
- Exposes small actions (e.g., `orbit`, `zoom`) so an aggregator can wire inputs

Exports
- `useCamera4D`
  - State: camera params, derived `camera4DPos`, `camera4DTarget`, `camera4DForward`, legacy 3D camera
  - Uniforms: resolution, 3D camera, 4D camera, `wVariationScale`
  - Inputs: `orbit(dx,dy)`, `zoom(dy)`, `moveWTargetW(dx,dy)`, `moveWOnly(dy)`; `onKeyDown` (C to reset)
  - Instructions: camera-related lines

- `useLight4D`
  - State: light spherical + w, derived `light4DPos`
  - Uniforms: `light4DPos`
  - Inputs: `orbit(dx,dy)`, `changeDistanceAndW(dy,dx)`; `onKeyDown` (R to reset)
  - Instructions: light-related lines

- `useRotations4D`
  - State: 6-plane rotation object, `rotateVertex4D(vertex)`
  - Uniforms: six rotation floats
  - Inputs: `rotatePrimary4D(dx,dy)`, `rotate3DLike(dx,dy)`; `onKeyDown` (H to reset)
  - Instructions: rotation lines

- `useFrustum4D`
  - State: `frustumParams`, `selectedDimension`
  - Uniforms: `frustumBounds`, `selectedDim`
  - Inputs: `adjustSelected(dy)`; `onKeyDown` (1..4 select, 5 reset)
  - Instructions: frustum lines

- `useOrtho4D`
  - State: `orthographicMode`, `orthographicSlice`, `orthographicBounds`
  - Uniforms: `orthographicMode`, `orthographicSlice`, `orthographicBounds`
  - Inputs: `adjustOrthoBounds(dx,dy)`; `onKeyDown` (A/S/D/F/G)
  - Instructions: ortho lines

- `useWireframe4D`
  - State: `showWireframe`
  - Uniforms: `showWireframe`, `wireDebugCompare`, `useCPUWireframe`, `projected2D`, plus geometry arrays (`vertices`, `edges`)
  - Inputs: `toggleWireframe()`; `onKeyDown` (W toggle)
  - Instructions: wireframe line

- `useControls4D` (aggregator)
  - Composes all hooks
  - Merges `mouseHandlers` and keyboard via per-hook `onKeyDown`
  - Dedupes and returns `instructions`
  - Aggregates all `uniforms` from subhooks so the caller (e.g., `gmap.jsx`) can register them before shader creation

How uniforms flow
1) Each hook returns its own `uniforms` spec (name, type, optional size)
2) `useControls4D` merges them (deduped)
3) The caller registers them with the runtime registry before initializing the renderer/shaders
4) The shader header is generated from the runtime registry to match exactly what hooks need

Notes for code assistants
- Add new inputs or features by creating a new hook or extending an existing one
- Keep uniforms co-located with the hook that needs them—do not hardcode in shaders
- Update UI instructions via the hook’s `instructions` list; they are auto-aggregated


