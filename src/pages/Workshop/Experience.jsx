import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, Text, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// 1. Define your projects here
export const projectsData = [
  {
    id: 'forge',
    title: 'THE FORGE',
    url: '/forge', // Internal link
    // Using high-quality abstract placeholders until you replace them with screenshots
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    isExternal: false
  },
  {
    id: 'agentic-ai',
    title: 'AGENTIC AI',
    url: '/agenticai', // Internal link
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    isExternal: false
  },
  {
    id: 'EditorDemo',
    title: '3D Room Editor',
    url: '/editor-demo',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    isExternal: false
  },
  {
    id: 'project-4',
    title: 'COMING SOON',
    url: '#',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    isExternal: false
  },
  {
    id: 'project-5',
    title: 'EXTERNAL DEMO',
    url: 'https://github.com', // External link
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    isExternal: true
  },
  {
    id: 'project-6',
    title: 'SECRET PROJECT',
    url: '#',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    isExternal: false
  }
];

// 2. Individual Project Card Component
function ProjectCard({ project, position, rotation }) {
  const imageRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Smooth hover animation for scaling the card
  useFrame((state, delta) => {
    if (imageRef.current) {
      const targetScale = hovered ? 1.1 : 1; // Grow by 10% on hover
      // Base size is 3x2, we scale that
      imageRef.current.scale.x = THREE.MathUtils.lerp(imageRef.current.scale.x, 3 * targetScale, delta * 6);
      imageRef.current.scale.y = THREE.MathUtils.lerp(imageRef.current.scale.y, 2 * targetScale, delta * 6);
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = () => {
    document.body.style.cursor = 'auto'; // Reset cursor before navigating
    if (project.isExternal) {
      window.open(project.url, '_blank');
    } else {
      window.location.href = project.url;
    }
  };

  return (
    <group position={position} rotation={rotation}>
      <Image
        ref={imageRef}
        url={project.image}
        transparent
        opacity={hovered ? 1 : 0.85}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
      {/* Project Title rendered underneath the image */}
      <Text
        position={[0, -1.4, 0]}
        fontSize={0.18}
        color={hovered ? '#ffffff' : '#aaaaaa'}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontWeight={800}
        letterSpacing={0.05}
      >
        {project.title}
      </Text>
    </group>
  );
}

// 3. Carousel Logic
function Carousel({ radius = 4.5 }) {
  const count = projectsData.length;
  
  return (
    <group>
      {projectsData.map((project, i) => {
        // Calculate position in a circle
        const angle = (i / count) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        // Rotate the cards so they face outwards from the center
        const rotation = [0, angle, 0];

        return <ProjectCard key={project.id} project={project} position={[x, 0, z]} rotation={rotation} />;
      })}
    </group>
  );
}

// 4. Main Experience View
export default function Experience() {
  // Optional: Clean up cursor on unmount
  useEffect(() => {
    return () => { document.body.style.cursor = 'auto'; };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'relative', overflow: 'hidden' }}>
      {/* UI Overlay */}
      <div style={{ position: 'absolute', top: 40, left: 40, zIndex: 10, color: 'white', fontFamily: 'sans-serif' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 900, letterSpacing: '2px' }}>THE WORKSHOP.</h1>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#888' }}>Drag horizontally to explore the lab's projects</p>
      </div>

      <Canvas camera={{ position: [0, 0, 7.5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <Environment preset="city" />
        <Carousel />
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} far={4} color="#000000" />
        
        {/* OrbitControls configured for a horizontal 'globe drag' feel */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          // Lock vertical rotation (polar angles) to keep it perfectly horizontal like a carousel
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.6} // Adjust sensitivity
          dampingFactor={0.05} // Smooth inertia
          makeDefault
        />
      </Canvas>
    </div>
  );
}