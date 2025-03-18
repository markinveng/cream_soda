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

  // **背景色を変化させるセクションカラー**
  const sectionColors = [
    [255, 183, 197], // Sakura
    [87, 200, 130],  // Melon
    [125, 60, 255],  // Grape
    [0, 170, 255],   // Blue Hawaii
    [255, 183, 197], // Sakura（最後は最初の色とループ）
  ];

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
    const totalSections = sectionColors.length - 1;
    const currentSection = Math.floor(scrollY / sectionHeight) % totalSections;
    const nextSection = (currentSection + 1) % totalSections;

    // **現在のスクロール位置を 0 〜 1 に正規化**
    const normalizedScroll = (scrollY % sectionHeight) / sectionHeight;

    // **モデルの移動ロジック**
    if (currentSection % 2 === 0) {
      model.position.x = THREE.MathUtils.lerp(rightPosX, leftPosX, normalizedScroll);
    } else {
      model.position.x = THREE.MathUtils.lerp(leftPosX, rightPosX, normalizedScroll);
    }

    // **RGB を補間して背景色を変化**
    const fromColor = sectionColors[currentSection];
    const toColor = sectionColors[nextSection];

    const r = Math.round(THREE.MathUtils.lerp(fromColor[0], toColor[0], normalizedScroll));
    const g = Math.round(THREE.MathUtils.lerp(fromColor[1], toColor[1], normalizedScroll));
    const b = Math.round(THREE.MathUtils.lerp(fromColor[2], toColor[2], normalizedScroll));

    document.querySelector(".content").style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  tick(); // **tick() を開始**
}