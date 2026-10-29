// Diwali loader atmosphere: one small WebGL fragment shader that lives only
// inside the Diwali loader and is destroyed as soon as the reveal finishes.
// It paints the loader's dark background and provides:
//   - warmth: slow drifting amber/antique-gold illumination with fine grain;
//   - light:  a localized glow that follows the light travelling the artwork;
//   - reveal: an organic, noise-edged dissolve (with an amber rim) that
//             uncovers the website underneath.
// Rendered at half resolution (it's soft, low-frequency light) to stay cheap.
// Returns null when WebGL isn't available — the caller then falls back to
// the plain CSS background and CSS mask reveal.

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uWarm;
uniform float uReveal;
uniform vec2 uLight;
uniform float uLightI;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  // The loader's existing look: ink with a faint lift at the centre.
  vec3 col = vec3(0.067, 0.075, 0.082) + vec3(0.035) * smoothstep(1.1, 0.0, length(p));

  // Warm, slowly drifting illumination — strongest around the artwork,
  // fading well before the edges so the screen never turns gold.
  vec3 amber = vec3(0.95, 0.63, 0.22);
  vec3 gold = vec3(0.86, 0.70, 0.40);
  float n = fbm(p * 2.1 + vec2(uTime * 0.035, -uTime * 0.025));
  float n2 = fbm(p * 3.7 - vec2(uTime * 0.02, uTime * 0.04));
  float halo = smoothstep(0.95, 0.05, length(p * vec2(0.85, 1.0)));
  col += amber * uWarm * halo * (0.13 * n + 0.06 * n2);
  col += gold * uWarm * 0.025 * smoothstep(0.6, 0.0, length(p));

  // Light travelling through the artwork: tight core + wide warm bloom,
  // with a slight wobble so it reads as a flame-lit glow, not a dot.
  vec2 lp = (uLight - 0.5 * uRes) / uRes.y;
  vec2 q = p - lp + 0.012 * vec2(noise(p * 9.0 + uTime), noise(p * 9.0 - uTime)) * uLightI;
  float d2 = dot(q, q);
  col += gold * uLightI * (0.42 * exp(-d2 * 260.0) + 0.14 * exp(-d2 * 22.0));

  // Fine film grain.
  col += (hash(gl_FragCoord.xy + fract(uTime * 7.0) * 61.0) - 0.5) * 0.03 * (0.4 + uWarm);

  // Organic reveal: a noise-distorted radius grows from the centre; inside
  // it the loader is transparent, with a warm rim riding the edge.
  float edge = length(p) * 1.05 + (fbm(p * 3.2 + uTime * 0.2) - 0.5) * 0.42;
  float alpha = smoothstep(uReveal - 0.05, uReveal + 0.05, edge);
  // A fine antique-gold rim on the dissolving edge — a glint, not a flame.
  float rim = (1.0 - smoothstep(0.0, 0.035, abs(edge - uReveal))) * step(0.0, uReveal);
  vec3 rimCol = mix(amber, gold, 0.6) * rim * 0.5;
  // Premultiplied alpha output.
  gl_FragColor = vec4(col * alpha + rimCol, clamp(alpha + rim * 0.3, 0.0, 1.0));
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

/**
 * Starts the atmosphere on `canvas` (sized by CSS to fill the loader).
 * @returns {null | { state: {warm:number, reveal:number, lightI:number, lightX:number, lightY:number}, render: (time:number) => void, resize: () => void, destroy: () => void }}
 *   lightX/lightY are in CSS pixels from the top-left of the viewport.
 */
export function createDiwaliAtmosphere(canvas) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false, preserveDrawingBuffer: false });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (name) => gl.getUniformLocation(program, name);
  const uRes = u("uRes");
  const uTime = u("uTime");
  const uWarm = u("uWarm");
  const uReveal = u("uReveal");
  const uLight = u("uLight");
  const uLightI = u("uLightI");

  // Soft light needs little resolution: render at half of CSS pixels.
  const SCALE = 0.5;
  let scale = SCALE;
  function resize() {
    const w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
    const h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    scale = w / Math.max(1, canvas.clientWidth);
  }
  resize();

  const state = { warm: 0, reveal: -0.3, lightI: 0, lightX: 0, lightY: 0 };

  function render(time) {
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, time);
    gl.uniform1f(uWarm, state.warm);
    gl.uniform1f(uReveal, state.reveal);
    // CSS px (top-left origin) → drawing-buffer px (bottom-left origin).
    gl.uniform2f(uLight, state.lightX * scale, canvas.height - state.lightY * scale);
    gl.uniform1f(uLightI, state.lightI);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function destroy() {
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

  return { state, render, resize, destroy };
}
