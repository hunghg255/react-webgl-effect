precision highp float;
precision mediump sampler2D;

varying vec2 coords;
uniform sampler2D x;
uniform vec2 texelSize;
uniform vec3 color;
uniform vec2 point;
uniform float radius;

void main() {
    vec2 p = coords - point.xy;
    p.x *= texelSize.y / texelSize.x;
    float strength = exp(-dot(p, p) / radius);
    vec3 base = texture2D(x, coords).xyz;
    gl_FragColor = vec4(base + strength * color, 1.0);
}
