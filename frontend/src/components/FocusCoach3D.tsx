'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Brain() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshPhysicalMaterial 
          color="#7CFF6B" 
          metalness={0.9} 
          roughness={0.1} 
          transmission={0.5} 
          thickness={0.5}
          emissive="#7CFF6B"
          emissiveIntensity={0.5}
          clearcoat={1}
        />
      </mesh>
    </Float>
  );
}

export default function FocusCoach3D() {
  return (
    <div className="w-full h-40 relative z-0">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#6D5DFC" />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#00D4FF" />
        
        <Brain />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
