/* GLSL for the contact scene's gold dust. */

export const dustVertex = /* glsl */ `
  uniform float uTime, uPixelRatio, uSize, uIntro;
  attribute vec4 aRand;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * (0.04 + aRand.x * 0.1) + 5.0, 10.0) - 5.0;
    p.x += sin(uTime * 0.3 + aRand.y * 6.2831) * 0.3;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.35 + aRand.w) * uPixelRatio / -mv.z;
    vAlpha = (0.5 + 0.5 * sin(uTime * (0.8 + aRand.x * 2.0) + aRand.y * 20.0)) * uIntro * smoothstep(14.0, 3.0, -mv.z);
  }
`;

export const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(uColor, a * a * vAlpha);
  }
`;
