// Central place to assemble shader sources. For now, re-export existing monolithic shaders.
// Next step: import parts (common4d, sdf4d, wireframe2d, materials) and concatenate.

import vertexShader from '../shaders/hypercube.vert.glsl'
import { generateHeader, assembleFragment } from './shaderAssembler'
import { getRuntimeUniforms, getRuntimeOuts } from './uniforms/registryRuntime'
import common4d from '../shaders/frag/common4d.glsl'
import sdf4d from '../shaders/frag/sdf4d.glsl'
import wireframe2d from '../shaders/frag/wireframe2d.glsl'
import mainBody from '../shaders/frag/main_body.glsl'

export function buildFragmentShaderSource() {
  const header = generateHeader(getRuntimeUniforms(), getRuntimeOuts())
  return assembleFragment({ header, modules: [common4d, sdf4d, wireframe2d, mainBody] })
}

export const vertexShaderSource = vertexShader


