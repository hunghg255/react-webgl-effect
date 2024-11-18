precision highp float;
precision mediump sampler2D;

varying vec2 coords;
uniform vec2 texelSize;

uniform vec3 color;
uniform sampler2D density;
uniform sampler2D velocity;
uniform sampler2D image;

void main() {
    float offset = texelSize.x > 1.0 / 800.0 ? -8.0 : -8.0;
    float size = texelSize.x > 1.0 / 800.0 ? 64.0 : 64.0;
    vec2 pos = (vec2(offset) + vec2(coords.x, 1.0 - coords.y) / texelSize) / size;
    vec4 logo = texture2D(image, pos);
    vec3 base = texture2D(density, coords).rgb;
    if (logo.a <= 0.0 && (base.r > 0.1 || base.g > 0.1 || base.b > 0.1)) {
        base *= 0.2 / max(base.r, max(base.g, base.b));
    }
    gl_FragColor = vec4(base + color * (1.0 - logo.a) + logo.rgb, 1.0);
}
