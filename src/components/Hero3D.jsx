import { useState, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload, Float } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { BufferGeometry, Float32BufferAttribute } from 'three';

// --- Componente de Partículas Estelares --- //
function Stars(props) {
  const ref = useRef();
  // Genera posiciones aleatorias para las partículas en una esfera
  const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 1.2 }), []);

  // Animación de rotación para las partículas
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffa0e0"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

// --- Componente del Dashboard 3D --- //
const Dashboard3D = () => {
  const ref = useRef();
  const [isHovered, setIsHovered] = useState(false);

  // Movimiento sutil con el ratón
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = (state.mouse.x * Math.PI) / 20;
      ref.current.rotation.x = (-state.mouse.y * Math.PI) / 20;
    }
  });

  const geometry = useMemo(() => {
    const geom = new BufferGeometry();
    const vertices = new Float32Array([
      -1, 1, 0,  1, 1, 0,  -1, -1, 0,  1, -1, 0
    ]);
    const uvs = new Float32Array([0, 1,  1, 1,  0, 0,  1, 0]);
    geom.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    geom.setIndex([0, 2, 1, 1, 2, 3]);
    return geom;
  }, []);

  return (
    <Float speed={isHovered ? 2 : 1} rotationIntensity={isHovered ? 2 : 1} floatIntensity={isHovered ? 2 : 1}>
      <mesh 
        ref={ref} 
        onPointerOver={() => setIsHovered(true)} 
        onPointerOut={() => setIsHovered(false)}
        geometry={geometry}        
      >
        <meshBasicMaterial>
           <videoTexture attach="map" args={[document.getElementById('dash-video')]} />
        </meshBasicMaterial>
      </mesh>
    </Float>
  );
};


// --- Componente Principal de la Escena 3D --- //
export default function Hero3D() {
  return (
    <>
     <video id="dash-video" loop muted autoPlay playsInline style={{display: 'none'}}>
        <source src="/assets/videos/dashboard-loop.mp4" type="video/mp4" />
      </video>
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 2.5] }}>
          <Suspense fallback={null}>
            <Stars />
            <Dashboard3D />
          </Suspense>
          <Preload all />
        </Canvas>
      </div>
    </>
  );
}
