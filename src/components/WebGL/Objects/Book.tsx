"use client";

import { forwardRef, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { brandCover, clothTexture, pageEdgeTexture, pageTexture, spineTexture } from "./textures";

export const BOOK = { w: 1.36, h: 2, d: 0.3, t: 0.045, oh: 0.035 };

/** Mutable control object: scenes write targets, the book eases toward them. */
export type BookControl = { open: number; page?: "text" | "redline" | "plate" };

type Props = {
  control: RefObject<BookControl>;
  /** Portfolio cover image; omit for the gold-foil brand cover. */
  coverMap?: THREE.Texture | null;
  spineLabel?: string;
} & React.JSX.IntrinsicElements["group"];

/**
 * Procedural hardcover: cloth boards, gold-foil cover (metalness/roughness
 * masks), page block with edge texture, typeset first page, hinged front cover.
 */
const Book = forwardRef<THREE.Group, Props>(function Book({ control, coverMap, spineLabel, ...group }, ref) {
  const hinge = useRef<THREE.Group>(null);
  const pageMesh = useRef<THREE.Mesh>(null);
  const { w, h, d, t, oh } = BOOK;

  const mats = useMemo(() => {
    const cloth = new THREE.MeshStandardMaterial({ map: clothTexture(), roughness: 0.82, metalness: 0 });
    const endpaper = new THREE.MeshStandardMaterial({ color: "#efe8da", roughness: 0.9 });
    const edge = new THREE.MeshStandardMaterial({ map: pageEdgeTexture(), roughness: 0.95 });
    const brand = brandCover();
    const front = coverMap
      ? new THREE.MeshPhysicalMaterial({ map: coverMap, roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.35 })
      : new THREE.MeshPhysicalMaterial({
          map: brand.map,
          metalnessMap: brand.metalnessMap,
          roughnessMap: brand.roughnessMap,
          metalness: 0.9,
          roughness: 1,
          clearcoat: 0.06,
          envMapIntensity: 1.8,
        });
    const spine = new THREE.MeshStandardMaterial({ map: spineTexture(spineLabel), roughness: 0.6, metalness: 0.2 });
    const page = new THREE.MeshStandardMaterial({ map: pageTexture("text"), roughness: 0.92 });
    return {
      // box faces: +x, -x, +y, -y, +z, -z
      front: [cloth, cloth, cloth, cloth, front, endpaper],
      back: [cloth, cloth, cloth, cloth, endpaper, cloth],
      spine: [cloth, spine, cloth, cloth, cloth, cloth],
      block: [edge, edge, edge, edge, endpaper, endpaper],
      page,
      all: [cloth, endpaper, edge, front, spine, page],
    };
  }, [coverMap, spineLabel]);

  useLayoutEffect(() => () => mats.all.forEach((m) => m.dispose()), [mats]);

  useFrame((_, dt) => {
    if (hinge.current) easing.damp(hinge.current.rotation, "y", -control.current.open * Math.PI * 0.94, 0.32, dt);
    if (pageMesh.current) {
      const mat = pageMesh.current.material as THREE.MeshStandardMaterial;
      const want = pageTexture(control.current.page ?? "text");
      if (mat.map !== want) {
        mat.map = want;
        mat.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={ref} {...group}>
      {/* back board */}
      <mesh material={mats.back} position={[oh / 2, 0, -d / 2 + t / 2]} castShadow>
        <boxGeometry args={[w + oh, h + oh * 2, t]} />
      </mesh>
      {/* spine */}
      <mesh material={mats.spine} position={[-w / 2 - t / 2, 0, 0]} castShadow>
        <boxGeometry args={[t, h + oh * 2, d]} />
      </mesh>
      {/* page block */}
      <mesh material={mats.block} position={[0.01, 0, 0]}>
        <boxGeometry args={[w - 0.03, h, d - t * 2]} />
      </mesh>
      {/* first page */}
      <mesh ref={pageMesh} material={mats.page} position={[0.01, 0, d / 2 - t + 0.002]}>
        <planeGeometry args={[w - 0.06, h - 0.04]} />
      </mesh>
      {/* front board, hinged at the spine */}
      <group ref={hinge} position={[-w / 2, 0, d / 2 - t / 2]}>
        <mesh material={mats.front} position={[(w + oh) / 2, 0, 0]} castShadow>
          <boxGeometry args={[w + oh, h + oh * 2, t]} />
        </mesh>
      </group>
    </group>
  );
});

export default Book;
