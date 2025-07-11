import * as THREE from "three";

export function setupLights(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.position.set(-5, 5, 0);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xffffff, 1.5, 10);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.set(1024, 1024);
  pointLight.position.set(0, 0, 5);
  scene.add(pointLight);
}
