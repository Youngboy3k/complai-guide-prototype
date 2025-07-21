import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface ComplianceRingProps {
  score: number;
  size?: number;
  animated?: boolean;
}

export const ComplianceRing = ({ score, size = 2, animated = true }: ComplianceRingProps) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef<THREE.Mesh>(null);
  
  const normalizedScore = Math.min(Math.max(score, 0), 100) / 100;
  
  // Create ring geometry
  const ringGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(size * 0.8, size, 0, Math.PI * 2, 32);
    return geometry;
  }, [size]);
  
  // Create progress arc geometry
  const progressGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(
      size * 0.8, 
      size, 
      0, 
      Math.PI * 2 * normalizedScore, 
      32
    );
    return geometry;
  }, [size, normalizedScore]);
  
  // Color based on score
  const progressColor = useMemo(() => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  }, [score]);
  
  useFrame((state) => {
    if (animated && ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
    if (animated && progressRef.current) {
      progressRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });
  
  return (
    <group>
      {/* Background ring */}
      <mesh ref={ringRef} geometry={ringGeometry}>
        <meshBasicMaterial color="#e5e7eb" transparent opacity={0.3} />
      </mesh>
      
      {/* Progress ring */}
      <mesh ref={progressRef} geometry={progressGeometry}>
        <meshBasicMaterial color={progressColor} />
      </mesh>
      
      {/* Score text */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={size * 0.4}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff2"
      >
        {Math.round(score)}%
      </Text>
      
      {/* Floating particles for celebration effect */}
      {score >= 80 && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 8) * Math.PI * 2) * size * 1.2,
                Math.sin((i / 8) * Math.PI * 2) * size * 1.2,
                0.2
              ]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color={progressColor} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};