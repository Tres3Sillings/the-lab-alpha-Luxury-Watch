import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER_SOURCE = `
  attribute vec2 position;
  varying vec2 v_uv;
  void main() {
    v_uv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_points[40]; // x, y (normalized), z (age/alpha)

  // Simple 2D Pseudo-Random Noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  // Fractal Brownian Motion (FBM) for organic smoke shapes
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; ++i) {
      value += amplitude * noise(p);
      p = rot * p * 2.0 + shift;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    
    // Correct aspect ratio for distance calculation
    vec2 st = uv;
    st.x *= aspect;

    // Domain warp the space using FBM noise to create smoky currents
    // Drift upwards and slightly sideways over time
    vec2 wind = vec2(u_time * 0.15, u_time * 0.25);
    vec2 noise_offset = vec2(
      fbm(st * 3.5 - wind),
      fbm(st * 3.5 + wind * 0.7)
    ) * 0.09; // Vapor turbulence strength
    
    vec2 displaced_st = st + noise_offset;

    float density = 0.0;
    
    // Accumulate vapor density from cursor history points
    for (int i = 0; i < 40; i++) {
      vec3 pt = u_points[i];
      if (pt.z <= 0.001) continue; // Skip dead points
      
      vec2 pt_st = pt.xy;
      pt_st.x *= aspect;
      
      float dist = distance(displaced_st, pt_st);
      
      // Points fade out and expand slightly as they age
      float age = pt.z; 
      float radius = 0.02 + (1.0 - age) * 0.06; 
      
      float pt_density = smoothstep(radius, 0.0, dist) * age;
      density = max(density, pt_density);
    }

    // Enhance smoke edge structures
    density = smoothstep(0.05, 0.75, density);
    
    // Create organic wispy holes in the smoke
    float wisps = fbm(st * 12.0 - vec2(0.0, u_time * 0.8));
    density *= (0.3 + 0.7 * wisps);

    // Luxury gold smoke palette (#c5a880) transitioning to light warm vapor (#ebdcb9)
    vec3 smoke_gold = vec3(0.77, 0.66, 0.50);
    vec3 smoke_light = vec3(0.92, 0.86, 0.73);
    vec3 final_color = mix(smoke_gold, smoke_light, density * 0.4);

    // Fade out towards the screen edges to prevent hard clipping lines
    float edge_mask = smoothstep(0.0, 0.08, uv.x) * smoothstep(1.0, 0.92, uv.x) *
                      smoothstep(0.0, 0.08, uv.y) * smoothstep(1.0, 0.92, uv.y);
    density *= edge_mask;

    // Render with smooth transparency
    gl_FragColor = vec4(final_color, density * 0.45);
  }
`;

export default function VaporCursor() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, hasMoved: false });
  const pointsRef = useRef(Array(40).fill(null).map(() => ({ x: 0.5, y: 0.5, age: 0 })));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn("WebGL not supported, disabling cursor shader.");
      return;
    }

    // Compile Shader Helper
    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation failed: ", gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(FRAGMENT_SHADER_SOURCE, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    // Link Program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking failed: ", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry (2 triangles covering fullscreen)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uPointsLoc = gl.getUniformLocation(program, 'u_points');

    // Handle Window Resizing
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.useProgram(program);
      gl.uniform2f(uResolutionLoc, width, height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse Move & Touch Listeners
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1.0 - (e.clientY / window.innerHeight);
      mouseRef.current.hasMoved = true;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current.x = touch.clientX / window.innerWidth;
        mouseRef.current.y = 1.0 - (touch.clientY / window.innerHeight);
        mouseRef.current.hasMoved = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });

    // Track mouse history and tick simulation
    let animationFrameId;
    const startTime = Date.now();
    const flatPointsArray = new Float32Array(120); // 40 points * 3 components

    const render = () => {
      const time = (Date.now() - startTime) * 0.001;

      // Update points history
      const points = pointsRef.current;
      const mouse = mouseRef.current;

      // Shift history array
      for (let i = 39; i > 0; i--) {
        points[i] = { ...points[i - 1] };
      }

      // Interpolate the leading point towards the cursor
      if (mouse.hasMoved) {
        const prev = points[1] || { x: mouse.x, y: mouse.y };
        points[0] = {
          x: prev.x + (mouse.x - prev.x) * 0.22,
          y: prev.y + (mouse.y - prev.y) * 0.22,
          age: 1.0
        };
      } else {
        // Let it decay and sit still if mouse is inactive
        points[0] = {
          ...points[0],
          age: Math.max(0, points[0].age - 0.03)
        };
      }

      // Decay age of all points in the tail
      for (let i = 0; i < 40; i++) {
        points[i].age = Math.max(0, points[i].age - 0.015);
      }

      // Pack points into flat Float32Array for uniform passing
      for (let i = 0; i < 40; i++) {
        flatPointsArray[i * 3] = points[i].x;
        flatPointsArray[i * 3 + 1] = points[i].y;
        flatPointsArray[i * 3 + 2] = points[i].age;
      }

      // WebGL Draw call
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform1f(uTimeLoc, time);
      gl.uniform3fv(uPointsLoc, flatPointsArray);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999, // Ensure it's on top of standard elements
      }}
    />
  );
}
