"use client";

import { Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";

/**
 * Shared product-photography lighting: a camera plus a procedural studio
 * environment (no HDR download) so gold foil and clearcoat read as premium.
 */
export default function Studio({ fov = 30, z = 7, intensity = 1 }: { fov?: number; z?: number; intensity?: number }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, z]} fov={fov} near={0.1} far={60} />
      <ambientLight intensity={0.55 * intensity} />
      <directionalLight position={[2.5, 3, 6]} intensity={2.6 * intensity} color="#fff3df" />
      <directionalLight position={[-4, 1, 3]} intensity={0.9 * intensity} color="#c9d3e3" />
      <spotLight position={[-3, 5, 4]} angle={0.5} penumbra={1} intensity={30 * intensity} color="#e3c993" />
      <Environment frames={1} resolution={256} environmentIntensity={1.2}>
        <Lightformer form="rect" intensity={5} color="#fff1d6" position={[0, 2, 5]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={3} color="#e3c993" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[4, 6, 1]} />
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[3, 5, 1]} />
        <Lightformer form="ring" intensity={2} color="#d4b373" position={[2, 3, -5]} scale={3} />
      </Environment>
    </>
  );
}
