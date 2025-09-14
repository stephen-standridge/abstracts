// Central place to assemble shader sources. For now, re-export existing monolithic shaders.
// Next step: import parts (common4d, sdf4d, wireframe2d, materials) and concatenate.

import vertexShaderSource from '../shaders/hypercube.vert.glsl'
import { uniformRegistry, outVars } from './uniforms/registry'
import { generateHeader, assembleFragment } from './shaderAssembler'
import common4d from '../shaders/frag/common4d.glsl'
import sdf4d from '../shaders/frag/sdf4d.glsl'
import wireframe2d from '../shaders/frag/wireframe2d.glsl'
import mainBody from '../shaders/frag/main_body.glsl'

const header = generateHeader(uniformRegistry, outVars)
const fragmentShaderSource = assembleFragment({ header, modules: [common4d, sdf4d, wireframe2d, mainBody] })

export { vertexShaderSource, fragmentShaderSource }


