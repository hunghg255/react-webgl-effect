precision highp float;
precision mediump sampler2D;

varying vec2 coords; // grid coordinates    
uniform sampler2D velocity;
uniform vec2 texelSize;
uniform float timestep;
uniform float curl;

const float EPSILON = 2.4414e-4; // 2^-12

float vort(vec2 coords) {
  float L = texture2D(velocity, coords - vec2(texelSize.x, 0.0)).y;
  float R = texture2D(velocity, coords + vec2(texelSize.x, 0.0)).y;
  float B = texture2D(velocity, coords - vec2(0.0, texelSize.y)).x;
  float T = texture2D(velocity, coords + vec2(0.0, texelSize.y)).x;

  return 0.5 * ((R - L) - (T - B));
}

void main() {
  float L = vort(coords - vec2(texelSize.x, 0.0));
  float R = vort(coords + vec2(texelSize.x, 0.0));
  float B = vort(coords - vec2(0.0, texelSize.y));
  float T = vort(coords + vec2(0.0, texelSize.y));

  float vC = vort(coords);

  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(L) - abs(R));
  force *= curl * vC / max(length(force), EPSILON);

  vec2 vel = texture2D(velocity, coords).xy;
  gl_FragColor = vec4(vel + timestep * force, 0.0, 1.0);
}
