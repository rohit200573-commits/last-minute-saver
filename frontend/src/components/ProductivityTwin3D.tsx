'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function DigitalTwin() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef1 = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
    if (meshRef1.current && meshRef2.current) {
      meshRef1.current.rotation.x += delta * 0.5;
      meshRef2.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={meshRef1} position={[-0.5, 0, 0]}>
          <octahedronGeometry args={[1, 1]} />
          <meshPhysicalMaterial 
            color="#00D4FF" 
            wireframe={true} 
            transparent 
            opacity={0.8}
            emissive="#00D4FF"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh ref={meshRef2} position={[0.5, 0, 0]}>
          <octahedronGeometry args={[1, 1]} />
          <meshPhysicalMaterial 
            color="#6D5DFC" 
            wireframe={true} 
            transparent 
            opacity={0.8}
            emissive="#6D5DFC"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function ProductivityTwin3D() {
  return (
    <div className="w-full h-48 relative z-0">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        <DigitalTwin />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
