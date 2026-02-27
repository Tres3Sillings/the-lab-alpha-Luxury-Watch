import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const SlimeMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00ff88'),
    uGlowColor: new THREE.Color('#003311'),
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec3 newPosition = position;
    // Layered sine waves for organic "slime" movement
    newPosition.x += sin(newPosition.y * 4.0 + uTime) * 0.1;
    newPosition.y += cos(newPosition.x * 3.0 + uTime * 0.5) * 0.05;
    newPosition.z += sin(newPosition.z * 5.0 + uTime) * 0.08;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
  `,
  // Fragment Shader
  `
  varying vec3 vNormal;
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uGlowColor;

  void main() {
    // Fresnel effect for that bioluminescent inner-glow look
    float fresnel = pow(1.2 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    
    // Add a pulsing intensity
    float pulse = (sin(uTime * 1.5) * 0.5 + 0.5) * 0.2;
    vec3 finalColor = mix(uColor, uGlowColor, fresnel + pulse);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
  `
);

// This allows <slimeMaterialImpl /> to be used as a JSX element
extend({ SlimeMaterialImpl });

export default SlimeMaterialImpl;