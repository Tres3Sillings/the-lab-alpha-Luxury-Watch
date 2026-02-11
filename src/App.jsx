import { Suspense } from 'react' // <--- IMPORT THIS
import { Canvas } from '@react-three/fiber'
import { Environment, Center } from '@react-three/drei'
import Background from './components/Background'
import WatchModel from './components/Mainwatchfileforthelab' // Make sure filename matches exactly

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas 
        shadows
        camera={{ position: [0, 0, 10], fov: 30 }} 
      >
        {/* FIX 2: Wrap everything 3D in Suspense */}
        <Suspense fallback={null}>
            
            <Background />
            <Environment preset="city" />
            
            <Center>
                {/* Check your scale! If the model is huge/tiny it might vanish. 
                   Start with scale={1} if 15 is too big. 
                */}
                <WatchModel scale={30} rotation={[0.2, -0.5, 0]} /> 
            </Center>

        </Suspense>
      </Canvas>
    </div>
  )
}