import * as THREE from "three";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

// 背景を透明にする
scene.background = null;

// カメラの設定
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0.4, 4);
scene.add(camera);

// 修正: AxesHelperを使用
//const axesHelper = new THREE.AxesHelper(5);
//scene.add(axesHelper);

// レンダラーの設定
if (!canvas) {
  throw new Error("Canvas not found!");
}
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true, // 透過を有効化
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ウィンドウサイズ変更時の処理
window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

export { scene, camera, renderer, canvas };
