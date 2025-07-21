import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';

interface Scene3DProps {
  children: React.ReactNode;
  camera?: {
    position?: [number, number, number];
    fov?: number;
  };
  controls?: boolean;
  className?: string;
}

export const Scene3D = ({ 
  children, 
  camera = { position: [0, 0, 5], fov: 75 }, 
  controls = true,
  className = "w-full h-full"
}: Scene3DProps) => {
  return (
    <div className={className}>
      <Canvas>
        <PerspectiveCamera
          makeDefault
          position={camera.position}
          fov={camera.fov}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        {/* Controls */}
        {controls && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        )}
        
        {/* Scene content */}
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};