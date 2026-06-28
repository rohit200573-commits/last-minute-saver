'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, Stars, PerspectiveCamera, Sparkles, Grid } from '@react-three/drei';
import * as THREE from 'three';

function FloatingCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x -= delta * 0.5;
      ringRef.current.rotation.y += delta * 0.1;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 0.1;
      outerRingRef.current.rotation.y -= delta * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshPhysicalMaterial 
          color="#6D5DFC" 
          metalness={0.8} 
          roughness={0.1} 
          transmission={0.9} 
          thickness={0.5}
          emissive="#6D5DFC"
          emissiveIntensity={0.5}
          wireframe={true}
        />
      </mesh>
      
      {/* Inner Data Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.6} />
      </mesh>

      {/* Outer Data Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[3.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#7CFF6B" transparent opacity={0.4} />
      </mesh>
    </Float>
  );
}

function OrbitingTasks() {
  const groupRef = useRef<THREE.Group>(null);
  
  const cards = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      position: [
        Math.cos((i / 8) * Math.PI * 2) * 5,
        Math.sin((i / 8) * Math.PI * 4) * 1.5,
        Math.sin((i / 8) * Math.PI * 2) * 5,
      ] as [number, number, number],
      rotation: [0, (i / 8) * Math.PI * 2, 0] as [number, number, number],
    }));
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      // Gentle floating up and down
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {cards.map((props, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={props.position} rotation={props.rotation}>
            <boxGeometry args={[1.2, 0.6, 0.05]} />
            <meshPhysicalMaterial 
              color="#ffffff" 
              transparent 
              transmission={0.9}
              opacity={1}
              metalness={0.1}
              roughness={0.2}
              ior={1.5}
              thickness={0.5}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

const vertexShader = `
precision mediump float;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseDown;
attribute float aRandom;
varying float vAlpha;

void main() {
  vec3 pos = position;
  
  // Swirl effect
  float angle = atan(pos.y, pos.x);
  float radius = length(pos.xy);
  float speed = 0.001 * (15.0 / (radius + 1.0));
  angle += speed * uTime * 60.0;
  
  vec3 swirlPos = vec3(cos(angle) * radius, sin(angle) * radius, pos.z);
  
  // Mouse interaction
  float dist = distance(swirlPos.xy, uMouse);
  
  float interactionRadius = uMouseDown > 0.5 ? 12.0 : 6.0;
  if (dist < interactionRadius) {
    vec2 dir = normalize(swirlPos.xy - uMouse);
    float force = (interactionRadius - dist) / interactionRadius;
    if (uMouseDown > 0.5) {
       swirlPos.xy -= dir * force * 1.5; // Attract
    } else {
       swirlPos.xy += dir * force * 2.0; // Repel
    }
  }
  
  // Idle float
  swirlPos.y += sin(uTime * 2.0 + aRandom * 100.0) * 0.5;

  vec4 mvPosition = modelViewMatrix * vec4(swirlPos, 1.0);
  // Prevent divide by zero or extreme sizes which can crash WebGL drivers
  gl_PointSize = (10.0 * aRandom + 2.0) * (10.0 / max(0.1, -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;
  
  vAlpha = 0.5 + 0.5 * sin(uTime + aRandom * 10.0);
}
`;

const fragmentShader = `
precision mediump float;
uniform vec3 uColor;
varying float vAlpha;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (dist > 0.5) discard;
  
  // Soft glowing edge
  float strength = 1.0 - (dist * 2.0);
  strength = pow(strength, 1.5);
  
  gl_FragColor = vec4(uColor, strength * vAlpha * 0.8);
}
`;

function GPUParticles({ count = 5000, color = "#00D4FF" }) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
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

  const [positions, randoms] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 2; // z
      randoms[i] = Math.random();
    }
    return [positions, randoms];
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseDown: { value: 0 },
    uColor: { value: new THREE.Color(color) }
  }), [color]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      const mouseX = (state.pointer.x * state.viewport.width) / 2;
      const mouseY = (state.pointer.y * state.viewport.height) / 2;
      materialRef.current.uniforms.uMouse.value.set(mouseX, mouseY);
      materialRef.current.uniforms.uMouseDown.value = isMouseDown.current ? 1.0 : 0.0;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aRandom" count={count} array={randoms} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial 
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  
  useFrame(() => {
    // Smooth camera parallax based on mouse pointer
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 2, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 2, 0.05);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0 w-full h-[100vh]">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          <color attach="background" args={['#050505']} />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} color="#6D5DFC" />
          <directionalLight position={[-10, -10, -5]} intensity={1} color="#00D4FF" />
          <pointLight position={[0, 0, 0]} intensity={2} color="#7CFF6B" distance={5} />
          
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          
          {/* Interactive Swarm Particles (GPU Accelerated) */}
          <GPUParticles count={5000} color="#00D4FF" />
          
          {/* Futuristic glowing grid floor */}
          <Grid 
            position={[0, -4, 0]} 
            args={[30, 30]} 
            cellSize={1} 
            cellThickness={1} 
            cellColor="#6D5DFC" 
            sectionSize={3} 
            sectionThickness={1.5} 
            sectionColor="#00D4FF" 
            fadeDistance={20} 
          />
          
          <FloatingCore />
          <OrbitingTasks />
          <Rig />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
