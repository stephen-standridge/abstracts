// 4D vector math functions for GLSL

float dot4d(vec4 a, vec4 b) {
  return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
}

float length4d(vec4 v) {
  return sqrt(dot4d(v, v));
}

vec4 normalize4d(vec4 v) {
  float len = length4d(v);
  return len > 0.0 ? v / len : v;
}

vec4 add4d(vec4 a, vec4 b) {
  return vec4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
}

vec4 subtract4d(vec4 a, vec4 b) {
  return vec4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
}

vec4 scale4d(vec4 v, float s) {
  return vec4(v.x * s, v.y * s, v.z * s, v.w * s);
}

float distance4d(vec4 a, vec4 b) {
  return length4d(subtract4d(a, b));
}