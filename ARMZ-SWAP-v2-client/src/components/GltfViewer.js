import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF , } from '@react-three/drei';
import styled from 'styled-components';

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={[0, -2, 0]} />;
};

const GltfViewer = ({ modelUrl, width, height }) => {
  return (
    <Canvas>
      {/* Ambient light to provide a basic level of illumination */}
      <ambientLight intensity={50} />
      {/* Bright directional light to simulate strong sunlight or artificial lighting */}
      <directionalLight position={[0, 0, 0]} intensity={40} />
      
      {/* Additional point light for extra brightness from multiple angles */}
      <pointLight position={[2, 2, 2]} intensity={50} distance={20} />
      
      <pointLight position={[0, 2, 0]} intensity={50} distance={20} />

      {/* Optional: Another point light for additional illumination */}
      <pointLight position={[-2, -2, -2]} intensity={50} distance={20} />
      <pointLight position={[0, -2, 0]} intensity={50} distance={20} />
      
      {/* Centering the model */}
      <Model url={modelUrl} />
      
      {/* Adding controls to navigate around the model */}
      <OrbitControls />
    </Canvas>
  );
};

const CustomizedCanvas = styled(Canvas)`
  width: 250px;
  height: 250px;
  background: transparent;
  @media (max-width: 550px) {
    width: 200px;
    height: 200px;
  }
`

export default GltfViewer;