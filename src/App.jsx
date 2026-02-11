import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ScrollControls, Center } from '@react-three/drei'
import WatchModel from './components/Mainwatchfileforthelab'
import Overlay from './components/Overlay'

export default function Experience() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)',
    }}>
      <Canvas 
        shadows
        gl={{ alpha: true }} 
        camera={{ position: [0, 0, 12], fov: 30 }} 
      >
        <Suspense fallback={null}>
            <Environment preset="city" />
            
            <ScrollControls pages={5} damping={0.3}>
                
                {/* 3D CONTENT (Fixed in Center) */}
                <Center>
                    <WatchModel scale={15} /> 
                </Center>

                {/* HTML OVERLAY (Fixed on Screen) 
                    Notice: NO <Scroll> wrapper here. 
                */}
                <Overlay />

            </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  )
}