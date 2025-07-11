import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * カメラコントロールをセットアップ
 * @param {THREE.Camera} camera - Three.js のカメラ
 * @param {HTMLElement} canvas - Three.js のキャンバス
 */
export function setupControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);

  // 初期ターゲット位置
  //controls.target.set(0, 0.75, 0);

  // カメラの移動を滑らかにする
  controls.enableDamping = true;

  // ズーム制限
  controls.minDistance = 2; // 最小ズーム距離
  controls.maxDistance = 10; // 最大ズーム距離

  // 角度制限
  controls.minPolarAngle = Math.PI / 4; // 下向きに制限
  controls.maxPolarAngle = Math.PI / 2; // 水平以上を向かせない

  // カメラの操作を無効化する場合（必要に応じて）
  // controls.enableRotate = false;  // 回転を無効化
  // controls.enableZoom = false;    // ズームを無効化
  // controls.enablePan = false;     // パンを無効化

  // アニメーションループで制御を更新
  function updateControls() {
    controls.update();
    requestAnimationFrame(updateControls);
  }
  updateControls();
}
