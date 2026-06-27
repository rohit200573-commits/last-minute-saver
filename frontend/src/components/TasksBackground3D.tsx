'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function MouseParticles({ count = 1500, color = "#6D5DFC" }) {
  const meshRef = useRef<THREE.Points>(null);
  const isMouseDown = useRef(false);

  useMemo(() => {
    if (typeof window !== 'undefined') {
      const handleDown = () => isMouseDown.current = true;
      const handleUp = () => isMouseDown.current = false;
      window.addEventListener('mousedown', handleDown);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchstart', handleDown);
      window.addEventListener('touchend', handleUp);
    }
  }, []);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5; // z
    }
    return positions;
  }, [count]);

  const originalPositions = useMemo(() => new Float32Array(particlesPosition), [particlesPosition]);
  const velocities = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    const mouseX = (state.pointer.x * state.viewport.width) / 2;
    const mouseY = (state.pointer.y * state.viewport.height) / 2;
    
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      
      const x = originalPositions[ix];
      const y = originalPositions[iy];
      
      const currX = positions[ix];
      const currY = positions[iy];
      
      const dx = mouseX - currX;
      const dy = mouseY - currY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const interactionRadius = isMouseDown.current ? 10 : 6;
      if (dist < interactionRadius) {
        const force = (interactionRadius - dist) / interactionRadius;
        if (isMouseDown.current) {
          // Attract when clicked
          velocities[ix] += (dx / dist) * force * 0.5;
          velocities[iy] += (dy / dist) * force * 0.5;
        } else {
          // Repel when hovering
          velocities[ix] -= (dx / dist) * force * 0.8;
          velocities[iy] -= (dy / dist) * force * 0.8;
        }
      }
      
      // Swirling field animation: slowly rotate the base positions around the center
      const angle = Math.atan2(y, x);
      const radius = Math.sqrt(x * x + y * y);
      const speed = 0.001 * (15 / (radius + 1)); // Faster near center, slower at edges
      
      originalPositions[ix] = Math.cos(angle + speed) * radius;
      originalPositions[iy] = Math.sin(angle + speed) * radius;

      // Spring back to (new) original position
      const springTension = isMouseDown.current ? 0.01 : 0.02;
      const damping = isMouseDown.current ? 0.85 : 0.90;
      
      velocities[ix] += (originalPositions[ix] - currX) * springTension;
      velocities[iy] += (originalPositions[iy] - currY) * springTension;
      
      velocities[ix] *= damping;
      velocities[iy] *= damping;
      
      positions[ix] += velocities[ix];
      positions[iy] += velocities[iy];
      
      // Add slight idle float for Z-axis depth breathing
      positions[iy] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.01;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1} 
        color={color} 
        transparent 
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function TasksBackground3D() {
  return (
    <div className="absolute inset-0 z-0 opacity-60">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Stars radius={50} depth={20} count={3000} factor={3} saturation={0} fade speed={0.5} />
        <MouseParticles count={1000} color="#6D5DFC" />
        <MouseParticles count={800} color="#7CFF6B" />
      </Canvas>
    </div>
  );
}
