import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { getMaterials } from "./materials.js";
import * as THREE from "three";

export function loadModels(scene, onLoad) {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  gltfLoader.load("/models/creamSoda/creamSoda_web.glb", (gltf) => {
    const materials = getMaterials();
    const meshes = gltf.scene.children;
    const model = gltf.scene;

    meshes.forEach((mesh) => {
      if (mesh.name.includes("glass")) {
        mesh.material = materials.glassMaterial;
        mesh.material.transparent = true;
        mesh.material.depthWrite = false; // **背後のオブジェクトを隠さない**
        mesh.renderOrder = 0; // **ガラスを一番最後に描画**
      } 
      else if (mesh.name.includes("soda")) {
        mesh.material = materials.sodaMaterial;
        mesh.material.transparent = true;
        mesh.material.depthWrite = false;
        mesh.renderOrder = 1; // **ガラスの前に描画**
      } 
      else if (mesh.name.includes("straw")) {
        mesh.material = materials.strawMaterial;
      } 
      else if (mesh.name.includes("cream")) {
        mesh.material = materials.creamMaterial;
      } 
      else if (mesh.name.includes("ice")) {
        mesh.material = materials.iceMaterial;
        mesh.material.side = THREE.DoubleSide;
        mesh.material.transparent = true;
        mesh.material.depthWrite = false;
        mesh.renderOrder = 2; // **液体の前に氷を描画**
      } 
      else if (mesh.name.includes("bubble")) {
        mesh.material = materials.bubbleMaterial;
        mesh.material.transparent = true;
        mesh.material.depthWrite = false;
        mesh.renderOrder = 3; // **最初に泡を描画**
      }
    });

    scene.add(model);
    if (onLoad) onLoad(model); // **修正: modelを渡す**
  });
}
