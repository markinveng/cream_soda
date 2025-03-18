import * as THREE from "three";

/**
 * シーンのアニメーションをセットアップ
 * @param {THREE.Scene} scene - Three.js のシーン
 * @param {THREE.Camera} camera - Three.js のカメラ
 * @param {THREE.WebGLRenderer} renderer - Three.js のレンダラー
 * @param {THREE.Object3D} model - クリームソーダのモデル
 */
export function setupAnimations(scene, camera, renderer, model) {
  const clock = new THREE.Clock();

  if (!model) {
    console.error("Error: Model is undefined in setupAnimations!");
    return;
  }

  // **モデルの初期角度とサイズを設定**
  model.rotation.set(0, THREE.MathUtils.degToRad(30), 0);
  model.scale.set(0.6, 0.6, 0.6);

  // **モデルの初期位置を `window.innerWidth * 0.0012` に戻す**
  const rightPosX = window.innerWidth * 0.0012; // **右側の中心**
  const leftPosX = -window.innerWidth * 0.0012; // **左側の中心**
  model.position.set(rightPosX, -1.0, 0); // **初期位置を右側に固定**

  function tick() {
    const elapsedTime = clock.getElapsedTime();

    // **時間に沿ってY軸回転**
    model.rotation.y = elapsedTime * 0.5;

    // **スクロール位置に応じて `X` を更新**
    const scrollY = window.scrollY || window.pageYOffset;
    const sectionHeight = window.innerHeight;
    const cycleIndex = Math.floor(scrollY / sectionHeight) % 2; // **0: 右 → 左, 1: 左 → 右**

    // **スクロール量を 0 〜 1 に正規化**
    const normalizedScroll = (scrollY % sectionHeight) / sectionHeight;

    // **スクロールの進行度に応じて徐々に移動**
    if (cycleIndex === 0) {
      model.position.x = THREE.MathUtils.lerp(rightPosX, leftPosX, normalizedScroll);
    } else {
      model.position.x = THREE.MathUtils.lerp(leftPosX, rightPosX, normalizedScroll);
    }

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  tick(); // **tick() を開始**
}