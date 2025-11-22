
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Cylinder, Torus, Sphere, Environment, MeshTransmissionMaterial, Points, PointMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

// Add type definitions for React Three Fiber intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      cylinderGeometry: any;
      meshPhysicalMaterial: any;
      meshStandardMaterial: any;
      torusGeometry: any;
      boxGeometry: any;
      meshBasicMaterial: any;
      planeGeometry: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      fog: any;
      color: any;
    }
  }
}

// --- HERO ROBOT VISUALIZATION ---
const RobotBody = () => {
  const group = useRef<THREE.Group>(null);
  const sensorRef = useRef<THREE.Group>(null);
  const wheelRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime();
      // Gentle hover float
      group.current.rotation.y = Math.sin(t * 0.1) * 0.1;
      group.current.position.y = Math.sin(t * 0.5) * 0.1 + 0.2;
      group.current.rotation.z = Math.sin(t * 0.3) * 0.02;
    }
    if (sensorRef.current) {
        sensorRef.current.rotation.y -= 0.02;
    }
  });

  return (
    <group ref={group} scale={1.2}>
        {/* Main Chassis Body - Glossy White with Ceramic feel */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[1.8, 1.7, 0.5, 64]} />
            <meshPhysicalMaterial 
                color="#ffffff" 
                roughness={0.2} 
                metalness={0.1} 
                clearcoat={1}
                clearcoatRoughness={0.1}
            />
        </mesh>

        {/* Top Cap Detail */}
        <mesh position={[0, 0.26, 0]}>
             <cylinderGeometry args={[1.65, 1.75, 0.05, 64]} />
             <meshPhysicalMaterial color="#f0f0f0" roughness={0.5} />
        </mesh>

        {/* Center Dome (Z Branding) */}
        <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 0.02, 32]} />
            <meshStandardMaterial color="#1c1917" />
        </mesh>
        <Text 
            position={[0, 0.30, 0.2]} 
            rotation={[-Math.PI / 2, 0, 0]} 
            fontSize={0.4} 
            color="#fb923c"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        >
            Z
        </Text>

        {/* Side Bumper Ring - Sleek Dark */}
        <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.82, 0.08, 16, 100]} />
            <meshStandardMaterial color="#292524" roughness={0.4} />
        </mesh>

        {/* Front Sensor Window */}
        <mesh position={[0, -0.05, 1.7]} rotation={[0, 0, 0]}>
             <boxGeometry args={[1, 0.2, 0.2]} />
             <meshPhysicalMaterial color="black" roughness={0} transmission={0.5} thickness={1} />
        </mesh>

        {/* Orange LED Strip / Status Light - Pulsing */}
        <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.72, 0.015, 16, 100]} />
            <meshBasicMaterial color="#fb923c" toneMapped={false} />
        </mesh>

        {/* Lidar / Sensor Tower */}
        <group position={[0, 0.25, 0]}>
             {/* Base of tower */}
             <mesh position={[0, 0, 0]}>
                 <cylinderGeometry args={[0.35, 0.45, 0.3, 32]} />
                 <meshStandardMaterial color="#e7e5e4" />
             </mesh>
             
             {/* Rotating Sensor Head */}
             <group ref={sensorRef} position={[0, 0.2, 0]}>
                <mesh>
                    <cylinderGeometry args={[0.35, 0.35, 0.2, 32]} />
                    <meshStandardMaterial color="#fb923c" roughness={0.3} metalness={0.8} />
                </mesh>
                {/* The "Eyes" of the Lidar */}
                <mesh position={[0, 0, 0.25]}>
                    <boxGeometry args={[0.3, 0.1, 0.1]} />
                    <meshBasicMaterial color="#000000" />
                </mesh>
                 {/* Scanning Laser visual */}
                 <mesh position={[0, 0, 1.5]} rotation={[Math.PI/2, 0, 0]}>
                    <planeGeometry args={[0.05, 3]} />
                    <meshBasicMaterial color="#fb923c" transparent opacity={0.2} side={THREE.DoubleSide} />
                 </mesh>
             </group>
        </group>

        {/* Wheels (suggested underneath) */}
        <group position={[0, -0.3, 0]}>
            <mesh rotation={[0, 0, Math.PI/2]} position={[1.2, 0, 0]}>
                 <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
                 <meshStandardMaterial color="#333" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI/2]} position={[-1.2, 0, 0]}>
                 <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
                 <meshStandardMaterial color="#333" />
            </mesh>
        </group>
    </group>
  );
};

const FloatingParticles = () => {
    const ref = useRef<THREE.Points>(null);
    const count = 200;
    const [positions] = React.useState(() => {
        const pos = new Float32Array(count * 3);
        for(let i=0; i<count; i++) {
            pos[i*3] = (Math.random() - 0.5) * 10; 
            pos[i*3+1] = (Math.random() - 0.5) * 6; 
            pos[i*3+2] = (Math.random() - 0.5) * 6; 
        }
        return pos;
    });

    useFrame((state) => {
        if(ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#fb923c"
                size={0.03}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.3}
            />
        </Points>
    )
}

export const HeroScene: React.FC<{ isDarkMode?: boolean }> = ({ isDarkMode = false }) => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 4, 7], fov: 40 }} shadows>
        <ambientLight intensity={isDarkMode ? 0.5 : 1.2} />
        {/* Key Light */}
        <spotLight 
            position={[6, 8, 6]} 
            angle={0.4} 
            penumbra={1} 
            intensity={2} 
            color="#ffffff" 
            castShadow 
            shadow-bias={-0.0001}
        />
        {/* Rim Light (Warm) */}
        <spotLight position={[-5, 2, -5]} angle={0.5} penumbra={1} intensity={3} color="#fb923c" />
        {/* Fill Light (Cool) */}
        <pointLight position={[-5, 5, 5]} intensity={0.8} color={isDarkMode ? "#1e293b" : "#e0f2fe"} />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <RobotBody />
        </Float>

        <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.5} 
            scale={12} 
            blur={2} 
            far={5} 
            color={isDarkMode ? '#000000' : '#000000'}
        />

        <FloatingParticles />

        <Environment preset={isDarkMode ? "night" : "city"} />
        {/* Use fog to blend the floor seamlessly into the background */}
        <fog attach="fog" args={[isDarkMode ? '#0c0a09' : '#f5f5f4', 5, 25]} />
      </Canvas>
    </div>
  );
};

// --- INTERIOR SCANNING VISUALIZATION ---

const LidarPoints = () => {
    const ref = useRef<THREE.Points>(null);
    const count = 3000; 
    
    const [positions] = React.useState(() => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        // Create a room-like structure
        const r = 8 + Math.random() * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        // Flatten to floor/walls
        if (Math.random() > 0.5) {
            // Floor
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = -3 + Math.random() * 0.2;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
        } else {
            // Walls
            pos[i * 3] = r * Math.cos(theta);
            pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
            pos[i * 3 + 2] = r * Math.sin(theta);
        }
      }
      return pos;
    });
  
    useFrame((state) => {
      if (ref.current) {
        const t = state.clock.getElapsedTime();
        ref.current.rotation.y = t * 0.05;
      }
    });
  
    return (
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#fb923c"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    );
};

export const QuantumComputerScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0 bg-stone-950">
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <color attach="background" args={['#0c0a09']} />
        <ambientLight intensity={0.5} />
        <LidarPoints />
        <fog attach="fog" args={['#0c0a09', 5, 30]} />
      </Canvas>
    </div>
  );
}
