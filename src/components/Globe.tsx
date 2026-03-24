/* eslint-disable no-unused-vars */
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { useControls } from 'leva';

// Hooks
import { useEarthquakes } from '@hooks/useEarthquakes';

// canvas components
import Earth from './Canvas/Earth';
import Stars from './Canvas/Stars';

// UI Components
import { HomeButton } from './UI/homeButton';
import { Loader } from './UI/Loader';
import OptionsPanel from './UI/OptionsPanel';
import { InfoPanel } from './UI/InfoPanel';


const CameraBridge = ({ onCameraReady }: 
  { onCameraReady: (camera: THREE.Camera) => void }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    onCameraReady(camera);
  }, [camera, onCameraReady]);
  
  return null;
};

const Globe = () => {
  const earthquakeData = useEarthquakes();
  const [camera, setCamera] = useState<THREE.Camera | null>(null);
  
  const controls = useControls({
    RotationSpeed: { value: 0.001, min: 0, max: 0.01 },
    CloudSpeed: { value: 0.0005, min: 0, max: 0.01 },
    StarsSpeed: { value: 0.0001, min: 0, max: 0.01 },
    sunDirection: { value: [-1.5, 1.5, 0.5] },
  });
  
  return (
    <div className="w-full h-screen bg-black relative">
      <Loader />
      <HomeButton />
      <OptionsPanel earthquakeData={earthquakeData} />
      {camera && <InfoPanel {...earthquakeData} camera={camera} />}
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <CameraBridge onCameraReady={setCamera} />
          <Earth controls={controls} earthquakes={earthquakeData.earthquakes} />
          <Stars controls={controls} />
          <ambientLight intensity={0.0005} />
          <directionalLight position={[1, 1, 1]} intensity={1.2} />
          <OrbitControls 
            enableDamping minDistance={2} 
            maxDistance={20} 
            enablePan={false} 
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Globe;