uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec2 vUv;

// --- Simplex Noise Helper Functions (Standard Boilerplate) ---
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
// -------------------------------------------------------------

void main() {
    vec2 uv = vUv;

    // 1. Mouse Interaction: Calculate distance from mouse
    // We adjust uMouse aspect ratio if needed, but for full screen:
    // Convert uv to -1 to 1 to match uMouse
    vec2 normalizedUv = uv * 2.0 - 1.0; 
    float dist = distance(normalizedUv, uMouse);
    
    // Create a localized distortion strength based on mouse distance
    float mouseStrength = smoothstep(0.5, 0.0, dist) * 0.5; 

    // 2. Domain Warping (The Liquid Effect)
    // We add noise to the UV coordinates themselves before sampling the color
    
    // Layer 1: Base movement
    float noise1 = snoise(uv * 3.0 + uTime * 0.1);
    
    // Layer 2: Warping the coordinate with the previous noise + Mouse
    vec2 warpedUv = uv + vec2(noise1) * 0.2;
    
    // Add mouse distortion to the warped coordinates
    warpedUv += (normalizedUv - uMouse) * mouseStrength;

    // Layer 3: Final Detail Noise on warped coordinates
    float pattern = snoise(warpedUv * 6.0 - uTime * 0.2);

    // 3. Mixing Colors
    // Remap pattern from [-1, 1] to [0, 1] for mixing
    float mixStrength = (pattern + 1.0) / 2.0;
    
    // Add some sharpness to make it look like liquid lines
    mixStrength = smoothstep(0.3, 0.7, mixStrength);

    vec3 finalColor = mix(uColorA, uColorB, mixStrength);

    gl_FragColor = vec4(finalColor, 1.0);
}