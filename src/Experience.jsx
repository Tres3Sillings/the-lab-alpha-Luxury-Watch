import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ScrollControls, Hud, OrthographicCamera, Center } from '@react-three/drei'
import Background from './components/Background'
import WatchModel from './components/WatchModel'

export default function Experience() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas 
        shadows
        camera={{ position: [0, 0, 10], fov: 30 }} 
      >
        <Suspense fallback={null}>
            
            {/* 1. BACKGROUND LAYER (HUD)
               This sits "behind" the world. 
               renderPriority={-1} forces it to render first.
            */}
            <Hud renderPriority={-1}>
              <OrthographicCamera makeDefault manual top={1} bottom={-1} left={-1} right={1} near={0} far={1} />
              <Background />
            </Hud>

            {/* 2. SCROLLABLE CONTENT LAYER */}
            <Environment preset="city" />
            
            {/* pages={5} makes the scroll area very tall (5 screens) for a long animation */}
            <ScrollControls pages={5} damping={0.2}>
                <Center>
                   {/* Scale 15 might be huge depending on file, feel free to adjust to 10 or 12 */}
                   <WatchModel scale={12} /> 
                </Center>
            </ScrollControls>

        </Suspense>
      </Canvas>
    </div>
  )
}