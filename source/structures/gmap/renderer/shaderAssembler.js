import headerTemplate from '../shaders/frag/header.glsl'

function glslType({ type, size }) {
  if (size && size > 1) return `${type} ${size > 1 ? '' : ''}`
  return type
}

function emitUniform(u) {
  if (u.size && u.size > 1) return `uniform ${u.type} ${u.name}[${u.size}];`
  return `uniform ${u.type} ${u.name};`
}

export function generateHeader(uniforms, outVars) {
  const lines = ['#version 300 es', 'precision highp float;', '', '// Generated header']
  for (const u of uniforms) lines.push(emitUniform(u))
  lines.push('')
  for (const o of outVars) lines.push(`out ${o.type} ${o.name};`)
  lines.push('')
  return lines.join('\n')
}

export function assembleFragment({ header, modules }) {
  return [header, ...modules].join('\n\n')
}


