export function projectVerticesCPU(rotatedVertices, camera4DPos, camera4DForward, { fov = 0.8 } = {}) {
  const screenX4 = [1.0, 0.0, 0.0, 0.3]
  const screenY4 = [0.0, 1.0, 0.2, 0.0]
  const eps = 1e-3

  function dot4(a, b) { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3] }
  function sub4(a, b) { return [a[0]-b[0], a[1]-b[1], a[2]-b[2], a[3]-b[3]] }
  function add4(a, b) { return [a[0]+b[0], a[1]+b[1], a[2]+b[2], a[3]+b[3]] }
  function mul4(a, s) { return [a[0]*s, a[1]*s, a[2]*s, a[3]*s] }
  function norm4(a) { const l=Math.hypot(a[0],a[1],a[2],a[3])||1; return [a[0]/l,a[1]/l,a[2]/l,a[3]/l] }

  const fwdN = norm4(camera4DForward)
  function rayDir(u, v) {
    const sx = mul4(screenX4, fov * u)
    const sy = mul4(screenY4, fov * v)
    return norm4(add4(fwdN, add4(sx, sy)))
  }

  function solveUVForPoint(p) {
    const cam = camera4DPos
    const tDir = norm4(sub4(p, cam))
    let u = 0, v = 0
    // Initial guess using linear perspective approximation
    const vRel = sub4(p, cam)
    const depth = Math.max(1e-4, dot4(vRel, fwdN))
    const vperp = sub4(vRel, mul4(fwdN, depth))
    const axp = sub4(screenX4, mul4(fwdN, dot4(screenX4, fwdN)))
    const axl = Math.hypot(axp[0],axp[1],axp[2],axp[3])||1
    const axn = [axp[0]/axl, axp[1]/axl, axp[2]/axl, axp[3]/axl]
    let byp = sub4(screenY4, mul4(fwdN, dot4(screenY4, fwdN)))
    byp = sub4(byp, mul4(axn, dot4(byp, axn)))
    const byl = Math.hypot(byp[0],byp[1],byp[2],byp[3])||1
    const byn = [byp[0]/byl, byp[1]/byl, byp[2]/byl, byp[3]/byl]
    u = (dot4(vperp, axn) / (depth * fov)) * 2.0
    v = (dot4(vperp, byn) / (depth * fov)) * 2.0
    for (let it = 0; it < 6; it++) {
      const F = (() => { const r = rayDir(u, v); return [r[0]-tDir[0], r[1]-tDir[1], r[2]-tDir[2], r[3]-tDir[3]] })()
      const Fu = (() => { const r = rayDir(u+eps, v); return [r[0]-tDir[0], r[1]-tDir[1], r[2]-tDir[2], r[3]-tDir[3]] })()
      const Fv = (() => { const r = rayDir(u, v+eps); return [r[0]-tDir[0], r[1]-tDir[1], r[2]-tDir[2], r[3]-tDir[3]] })()
      const Ju = [(Fu[0]-F[0])/eps, (Fu[1]-F[1])/eps, (Fu[2]-F[2])/eps, (Fu[3]-F[3])/eps]
      const Jv = [(Fv[0]-F[0])/eps, (Fv[1]-F[1])/eps, (Fv[2]-F[2])/eps, (Fv[3]-F[3])/eps]
      const a11 = Ju[0]*Ju[0]+Ju[1]*Ju[1]+Ju[2]*Ju[2]+Ju[3]*Ju[3]
      const a12 = Ju[0]*Jv[0]+Ju[1]*Jv[1]+Ju[2]*Jv[2]+Ju[3]*Jv[3]
      const a22 = Jv[0]*Jv[0]+Jv[1]*Jv[1]+Jv[2]*Jv[2]+Jv[3]*Jv[3]
      const b1 = -(Ju[0]*F[0]+Ju[1]*F[1]+Ju[2]*F[2]+Ju[3]*F[3])
      const b2 = -(Jv[0]*F[0]+Jv[1]*F[1]+Jv[2]*F[2]+Jv[3]*F[3])
      const det = a11*a22 - a12*a12
      if (Math.abs(det) < 1e-10) break
      const du = ( a22*b1 - a12*b2) / det
      const dv = (-a12*b1 + a11*b2) / det
      u += du; v += dv
      if (Math.abs(du)+Math.abs(dv) < 1e-4) break
    }
    return [u, v]
  }

  const projected = new Float32Array(rotatedVertices.length * 2)
  for (let i = 0; i < rotatedVertices.length; i++) {
    projected[i*2+0] = 0.0
    projected[i*2+1] = 0.0
  }
  for (let i = 0; i < rotatedVertices.length; i++) {
    const p = rotatedVertices[i]
    const uv = solveUVForPoint(p)
    projected[i*2+0] = uv[0]
    projected[i*2+1] = uv[1]
  }
  return projected
}


