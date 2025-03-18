import * as THREE from "three";

export function getMaterials() {
  const textureLoader = new THREE.TextureLoader();

  // ストローのテクスチャ
  const strawTexture = textureLoader.load("/models/creamSoda/straw_bake.png", (texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  });

  // クリームのテクスチャ
  const creamDefuseTexture = textureLoader.load("/models/creamSoda/cream_bake_defuse.png", (texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  });

  const creamNormalTexture = textureLoader.load("/models/creamSoda/cream_bake_normal.png", (texture) => {
    texture.flipY = false;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  });
  return {
    glassMaterial: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      transmission: 1.0,
      roughness: 0.1,
      metalness: 0.1,
      ior: 1.52,
      thickness: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),

    sodaMaterial: new THREE.MeshPhysicalMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.5,
      transmission: 0.95,
      roughness: 0.05,
      metalness: 0.0,
      ior: 1.33,
      thickness: 1.0,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),

    strawMaterial: new THREE.MeshStandardMaterial({
      map: strawTexture,
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.0,
    }),

    creamMaterial: new THREE.MeshStandardMaterial({
      map: creamDefuseTexture,
      normalMap: creamNormalTexture,
      color: 0xffddaa,
      roughness: 0.5,
      metalness: 0.0,
    }),

    iceMaterial: new THREE.MeshPhysicalMaterial({
      color: 0xe0ffff,
      transparent: true,
      opacity: 0.5,
      transmission: 1.0,
      roughness: 0.05,
      metalness: 0.0,
      ior: 1.31,
      thickness: 0.5,
      side: THREE.DoubleSide,
      depthWrite: true,
    }),

    bubbleMaterial: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
      transmission: 0.9,
      roughness: 0.2,
      metalness: 0.0,
      ior: 1.05,
      thickness: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  };
}
