import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingElementsProps {
  count?: number;
  spread?: number;
}

export const FloatingElements = ({ count = 12, spread = 8 }: FloatingElementsProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => (
        <FloatingElement
          key={i}
          position={[
            (Math.random() - 0.5) * spread,
            (Math.random() - 0.5) * spread,
            (Math.random() - 0.5) * spread
          ]}
          delay={i * 0.2}
        />
      ))}
    </group>
  );
};

const FloatingElement = ({ position, delay }: { position: [number, number, number]; delay: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.5;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  
  const shapes = ['box', 'sphere', 'octahedron'];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const color = ['#2563eb', '#7c3aed', '#06b6d4'][Math.floor(Math.random() * 3)];
  
  return (
    <mesh
      ref={meshRef}
      position={position}
    >
      {shape === 'box' && <boxGeometry args={[0.2, 0.2, 0.2]} />}
      {shape === 'sphere' && <sphereGeometry args={[0.15, 8, 8]} />}
      {shape === 'octahedron' && <octahedronGeometry args={[0.15]} />}
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
};