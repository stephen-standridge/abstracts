# Shaders overview (4D renderer)

Structure
- `hypercube.vert.glsl`: passthrough vertex shader for fullscreen quad (no changes needed)
- `frag/` modules (assembled in this order):
  - `common4d.glsl`: inverse rotation, inside/frustum checks, ray origin/direction (persp/ortho)
  - `sdf4d.glsl`: SDF for hypercube and sphere tracing (`sphereTrace4D`)
  - `wireframe2d.glsl`: screen-space helpers for 2D wireframe (projection, distances, attenuation)
  - `main_body.glsl`: the `main()` program – calls helpers, shades surfaces, overlays wireframe

How headers/uniforms work
- Do not declare `#version` or uniforms in module files.
- The header (with `#version` and uniforms) is generated at runtime from the hooks’ uniform lists.
- If you need new uniforms:
  1) Add them to the relevant hook (e.g., `useCamera4D`) and return via its `uniforms` array
  2) The app registers them before shader creation; the header is regenerated automatically
  3) Use those uniforms in the appropriate GLSL module

Adding/Editing shader logic
- Put common math/logic in `common4d.glsl`
- Add new SDFs/tracers in `sdf4d.glsl` (or create a new `frag/materials/*.glsl` and import from `shaderSources`)
- Extend wireframe helpers in `wireframe2d.glsl` if you need new screen-space overlays
- Keep `main_body.glsl` focused on orchestration (read uniforms, call helpers, compose color)

Notes for AI/code assistants
- Never add duplicate `#version` or uniform declarations in modules
- Prefer small, composable helpers in the modules; avoid monolithic changes
- When adding features that require uniforms, wire them through a hook first so the header stays accurate
- If a uniform is optional, guard usage with a `bool`/mode uniform checked in `main_body.glsl`

Legacy
- `hypercube.frag.glsl` (monolithic) remains for reference only; the live build uses the `frag/` modules assembled by `renderer/shaderSources.js`.
