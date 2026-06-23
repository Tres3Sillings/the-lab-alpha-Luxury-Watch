export const BackgroundShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#ff0000") }, // Deep dark base
    uAccent: { value: new THREE.Color("#00f2ff") }, // Match your pointLight
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uAccent;
    varying vec2 vUv;

    // Simple noise for that CRT/Grain grit
    float noise(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      float n = noise(uv + uTime * 0.05);
      
      // Create a subtle radial vignette
      float dist = distance(uv, vec2(0.5));
      vec3 color = mix(uAccent * 0.05, uColor, dist * 1.5);
      
      // Add "Technical Grain"
      color += n * 0.02;

      gl_FragColor = vec4(color, 1.0);
    }
  `
};