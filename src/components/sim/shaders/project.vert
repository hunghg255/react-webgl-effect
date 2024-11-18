precision highp float;

attribute vec2 points;
varying vec2 coords;

void main() {
    coords = points * 0.5 + 0.5;
    gl_Position = vec4(points, 0.0, 1.0);
}
