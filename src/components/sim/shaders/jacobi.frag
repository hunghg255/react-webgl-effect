precision highp float;
precision mediump sampler2D;

varying vec2 coords; // grid coordinates    
uniform vec2 texelSize;
uniform sampler2D pressure;
uniform sampler2D divergence;

void main() {
  // left, right, bottom, and top pressure samples
  float L = texture2D(pressure, coords - vec2(texelSize.x, 0.0)).x;
  float R = texture2D(pressure, coords + vec2(texelSize.x, 0.0)).x;
  float B = texture2D(pressure, coords - vec2(0.0, texelSize.y)).x;
  float T = texture2D(pressure, coords + vec2(0.0, texelSize.y)).x;

  // divergence sample, from center
  float bC = texture2D(divergence, coords).x;

  // evaluate Jacobi iteration
  gl_FragColor = vec4(0.25 * (L + R + B + T - bC), 0, 0, 1);
}
