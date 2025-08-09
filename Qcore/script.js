/*********
 * made by Matthias Hurrle (@atzedent)
 */

/** @type {HTMLCanvasElement} */
const canvas = window.canvas
const gl = canvas.getContext("webgl2")
const dpr = Math.max(.5, .5*window.devicePixelRatio)
/** @type {Map<string,PointerEvent>} */
const touches = new Map()

const vertexSource = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

in vec2 position;

void main(void) {
    gl_Position = vec4(position, 0., 1.);
}
`
const fragmentSource = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
*/

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;
uniform int pointerCount;
uniform vec2 touch;

#define T mod(23.+time,300.)
#define S smoothstep

#define P pointerCount
#define mouse (touch/resolution)

#define PI 3.14159265
#define TAU 6.283182
#define ESN 1.57075
#define repf(p,l,c) (p-c*clamp(round(p/c),-l,l))

vec3 lp = vec3(0, 2, 0);

mat2 rot(float a) {
  float c = cos(a),
  s = sin(a); return mat2(c, -s, s, c);
}

vec2 pmod(vec2 p, float r) {
  float
  a = atan(p.x, p.y) + PI / r,
  n = TAU / r;

  a = floor(a / n) * n;

  return rot(-a)*p;
}

float box(vec3 p, vec3 s) {
  p = abs(p)-s; return length(max(p,.0))-min(.0, max(max(p.x, p.y), p.z))-.125;
}

float glow = .0;

vec2 map(vec3 p) {
  vec3 q = p,
  st = abs(p)-lp;
  st.xz = pmod(st.xz, 6.);
  p.y = repf(p.y, 5., 2.);
  p.xz = pmod(p.xz, 6.);

  vec2 a = vec2(box(p-vec3(0, 0, 1.8), vec3(.5, .75,.05)), 1.),
  light = vec2(length(abs(q)+lp)-.1, 2),
  laser = vec2(box(st, vec3(0,0,1.5)), 2);

  glow += .05/(.05+light.x*light.x*40.);
  glow += .05/(.05+laser.x*laser.x*80.);

  a = a.x < light.x?a: light;
  a = a.x < laser.x?a: laser;

  return a;
}

float scene = 1.;
void cam(inout vec3 p) {
  if (P > 0) {
    p.yz *= rot(-mouse.y*PI+ESN);
    p.xz *= rot(PI-mouse.x*TAU);
  } else {
    if (scene == .0) {
        p.yz *= rot(-T*.2);
        p.xy *= rot(ESN+.707);
    } else {
        p.yz *= rot(1.4);
        p.xz *= rot(T/3.);
    }
  }
}

vec3 norm(vec3 p) {
  vec2 e = vec2(1e-3, 0);
  float d = map(p).x;
  vec3 n = d-vec3(
    map(p-e.xyy).x,
    map(p-e.yxy).x,
    map(p-e.yyx).x
  );

  return normalize(n);
}

void main(void) {
  vec2 uv = (
    gl_FragCoord.xy-.5*resolution
  )/min(resolution.x, resolution.y);
  
  // anim
  vec2 st = abs(uv);
  
  float
  num = 2.,
  t = .25*T,
  prog = t*.25,
  preanim = P>0?.0:floor(mod(prog, num));
  prog += max(st.x, st.y) * .08;

  float
  anim = mod(prog, num);
  scene = P>0?.0:floor(anim);

  vec3 col = vec3(0),
  ro = vec3(0, 0, -8),
  rd = normalize(vec3(uv, 1));

  lp *= sin(T)*4.;

  cam(ro);
  cam(rd);

  vec3 p = ro,
  tint = vec3(.95,.85,.9);

  const float steps = 400.,maxd = 20.;

  float dd = .0,
  at = .0,
  side = 1.;

  for (float i = .0; i < steps; i++) {
    vec2 d = map(p)*side;

    if (d.x < 1e-3) {
      vec3 r = normalize(rd);
      vec3 n = norm(p)*side;
      vec3 l0 = normalize(abs(lp)-p),
      l1 = normalize(abs(lp)+p);

      if (dot(l0, n) < .0) l0 = -l0;
      if (dot(l1, n) < .0) l1 = -l1;

      vec3 h0 = normalize(l0-r);
      vec3 h1 = normalize(l1-r);

      float diff = .5*(max(.0, dot(l0, n))+max(.0, dot(l1, n))),
      fres = pow(.25-max(.0, dot(n, r)), 9.),
      dnh0 = max(.0, dot(n, h0)),
      dnh1 = max(.0, dot(n, h1)),
      fade = pow(S(.0, 1.,1./dot(abs(p)-lp, abs(p)-lp)),.25),
      shds0 = pow(dnh0, 128.)*.5,
      shds1 = pow(dnh1, 128.)*.5;

      col += diff*vec3(1.5,2,1.95)*(
        5.*fres+.24*pow(dnh0, 32.)+
        5.*fres+.24*pow(dnh1, 32.)+
        .125*shds0+
        .125*shds1
      )*fade*10.;

      col += shds0*tint*.5;
      col += shds1*tint*.5;

      side = -side;
      d.x = 1e-1;

      rd = refract(rd, n, 1.+.45*side);
    }
    if (dd > maxd) {
      dd = maxd;
      break;
    }

    p += rd*d.x;
    dd += d.x;
    at += .05*(.05/dd);
  }


  col += tint*at;
  col += 1.-max(dd/maxd, .0);
  col += tint*glow*5.;
  
  fragColor = vec4(col, 1);
}
`
let time
let buffer
let program
let touch
let resolution
let pointerCount
let vertices = []
let touching = false

function resize() {
    const { innerWidth: width, innerHeight: height } = window

    canvas.width = width * dpr
    canvas.height = height * dpr

    gl.viewport(0, 0, width * dpr, height * dpr)
}

function compile(shader, source) {
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader))
    }
}

function setup() {
    const vs = gl.createShader(gl.VERTEX_SHADER)
    const fs = gl.createShader(gl.FRAGMENT_SHADER)

    program = gl.createProgram()

    compile(vs, vertexSource)
    compile(fs, fragmentSource)

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program))
    }

    vertices = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]

    buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    const position = gl.getAttribLocation(program, "position")

    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    time = gl.getUniformLocation(program, "time")
    touch = gl.getUniformLocation(program, "touch")
    pointerCount = gl.getUniformLocation(program, "pointerCount")
    resolution = gl.getUniformLocation(program, "resolution")
}

function draw(now) {
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

    gl.uniform1f(time, now * 0.001)
    gl.uniform2f(touch, ...getTouches())
    gl.uniform1i(pointerCount, touches.size)
    gl.uniform2f(resolution, canvas.width, canvas.height)
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length * 0.5)
}

function getTouches() {
    if (!touches.size) {
        return [0, 0]
    }

    for (let [id, t] of touches) {
        const result = [dpr * t.clientX, dpr * (innerHeight - t.clientY)]

        return result
    }
}

function loop(now) {
    draw(now)
    requestAnimationFrame(loop)
}

function init() {
    setup()
    resize()
    loop(0)
}

document.body.onload = init
window.onresize = resize
canvas.onpointerdown = e => {
    touching = true
    touches.set(e.pointerId, e)
}
canvas.onpointermove = e => {
    if (!touching) return
    touches.set(e.pointerId, e)
}
canvas.onpointerup = e => {
    touching = false
    touches.clear()
}
canvas.onpointerout = e => {
    touching = false
    touches.clear()
}