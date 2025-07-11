import * as THREE from "three";
import gsap from "gsap";

/**
 * シーンのアニメーションをセットアップ
 * @param {THREE.Scene} scene - Three.js のシーン
 * @param {THREE.Camera} camera - Three.js のカメラ
 * @param {THREE.WebGLRenderer} renderer - Three.js のレンダラー
 * @param {THREE.Object3D} model - クリームソーダのモデル
 */
export function setupAnimations(scene, camera, renderer, model) {
  const clock = new THREE.Clock();

  window.scrollTo(0, 0);

  if (!model) {
    return;
  }

  // **背景色のRGBリスト**
  const backgroundColors = [
    [255, 255, 255], // KeyVisual（白）
    [87, 200, 130], // Melon
    [125, 60, 255], // Grape
    [0, 170, 255], // Blue Hawaii
    [255, 183, 197], // Sakura
    [87, 200, 130], // Footer (Melon)
  ];

  // **ソーダのRGBリスト**
  const sodaColors = [
    [0, 255, 0], // KeyVisual（Melon）
    [0, 255, 0], // Melon
    [125, 60, 255], // Grape
    [0, 170, 255], // Blue Hawaii
    [255, 183, 197], // Sakura
    [0, 255, 0], // Footer (Melon)
  ];

  // **ソーダのマテリアルを取得**
  let sodaMaterial = null;
  model.traverse((child) => {
    if (child.isMesh && child.name.includes("soda")) {
      sodaMaterial = child.material;
    }
  });

  // **モデルの初期位置を `window.innerWidth * 0.0012` に戻す**
  const rightPosX = window.innerWidth * 0.0009; // **右側の中心**
  const leftPosX = -window.innerWidth * 0.0009; // **左側の中心**

  // **デバイスの幅をチェック**
  const isSP = window.innerWidth <= 768;
  const isPC = window.innerWidth > 768;

  // **モデルの初期角度とサイズを設定**
  model.rotation.set(0.4, 0, 0);
  if (isSP) {
    model.position.set(-10, -1.1, 0);
    model.scale.set(0.4, 0.4, 0.4);
  } else {
    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(rightPosX, -1.0, 0); // **初期位置を右側に固定**
  }

  let rotationSpeed = 0.5; // **通常の回転速度**
  let lastCycleIndex = -1; // **前回のサイクルを記録（切り返し検知用）**
  let lastScrollY = window.scrollY || window.pageYOffset; // **前回のスクロール位置**

  function rotationSpeedUpAndBack() {
    gsap.to(
      { speed: rotationSpeed },
      {
        speed: 30.0,
        duration: 0.5,
        onUpdate: function () {
          rotationSpeed = this.targets()[0].speed;
        },
        onComplete: () => {
          // スピードダウンをフェードアウト
          gsap.to(
            { speed: rotationSpeed },
            {
              speed: 0.5,
              duration: 0.5,
              onUpdate: function () {
                rotationSpeed = this.targets()[0].speed;
              },
            }
          );
        },
      }
    );
  }

  function tick() {
    const elapsedTime = clock.getElapsedTime();

    // **時間に沿ってY軸回転**
    model.rotation.y += rotationSpeed * 0.01;

    // **スクロール位置に応じて `X` を更新**
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollDirection = scrollY > lastScrollY ? 1 : -1; // **1: 下スクロール, -1: 上スクロール**
    lastScrollY = scrollY;

    const sectionHeight = window.innerHeight;
    const totalSections = backgroundColors.length;
    const currentSection = Math.floor(scrollY / sectionHeight) % totalSections;
    const nextSection = (currentSection + 1) % totalSections;

    // **現在のスクロール位置を 0 〜 1 に正規化**
    const normalizedScroll = (scrollY % sectionHeight) / sectionHeight;

    // **モデルの移動ロジック**
    let isSwitching = false;
    if (isPC) {
      if (currentSection % 2 === 0) {
        model.position.x = THREE.MathUtils.lerp(rightPosX, leftPosX, normalizedScroll);
        if (normalizedScroll >= 0.99 || normalizedScroll <= 0.01) isSwitching = true;
      } else {
        model.position.x = THREE.MathUtils.lerp(leftPosX, rightPosX, normalizedScroll);
        if (normalizedScroll >= 0.99 || normalizedScroll <= 0.01) isSwitching = true;
      }
    } else if (isSP) {
      model.position.x = 0;
      if (normalizedScroll >= 0.99 || normalizedScroll <= 0.01) isSwitching = true;
    }

    // **切り返しのタイミングを検出**
    if (isSwitching && lastCycleIndex !== currentSection) {
      lastCycleIndex = currentSection;

      //下スクロール(Keyvisual → Melon)
      if (currentSection === 1 && scrollDirection === 1) {
        if (sodaMaterial) {
          const newColor = sodaColors[1]; // **Melon の色**
          sodaMaterial.color.setRGB(newColor[0] / 255, newColor[1] / 255, newColor[2] / 255);
        }
        //下スクロール(Melon → Grape)
      } else if (currentSection === 2 && scrollDirection === 1) {
        if (sodaMaterial) {
          const newColor = sodaColors[2]; // **Grape の色**
          sodaMaterial.color.setRGB(newColor[0] / 255, newColor[1] / 255, newColor[2] / 255);
          rotationSpeedUpAndBack();
        }
        //下スクロール(Grape → BlueHawaii)
      } else if (currentSection === 3 && scrollDirection === 1) {
        if (sodaMaterial) {
          const newColor = sodaColors[3]; // **BlueHawaii の色**
          sodaMaterial.color.setRGB(newColor[0] / 255, newColor[1] / 255, newColor[2] / 255);
          rotationSpeedUpAndBack();
        }
        //下スクロール(BlueHawaii → Sakura)
      } else if (currentSection === 4 && scrollDirection === 1) {
        if (sodaMaterial) {
          const newColor = sodaColors[4]; // **BlueHawaii の色**
          sodaMaterial.color.setRGB(newColor[0] / 255, newColor[1] / 255, newColor[2] / 255);
          rotationSpeedUpAndBack();
        }
        //下スクロール(Sakura → Footer)
      } else if (currentSection === 5 && scrollDirection === 1) {
        if (sodaMaterial) {
          const newColor = sodaColors[1]; // **Melon の色**
          sodaMaterial.color.setRGB(newColor[0] / 255, newColor[1] / 255, newColor[2] / 255);
          rotationSpeedUpAndBack();
        }
      }
      // 上スクロール(Footer → Sakura)
      else if (currentSection === 4 && scrollDirection === -1) {
        if (sodaMaterial) {
          const newColor = sodaColors[1]; // **Melon の色**
          sodaMaterial.color.setRGB(newColor[0] / 255, newColor[1] / 255, newColor[2] / 255);
        }
        //上スクロール(Sakura → BlueHawaii)
      } else if (currentSection === 3 && scrollDirection === -1) {
        if (sodaMaterial) {
          const newColor = sodaColors[4]; // **Sakura の色**
          sodaMaterial.color.setRGB(newColor[0] / 255, newColor[1] / 255, newColor[2] / 255);
          rotationSpeedUpAndBack();
        }
        //上スクロール(BlueHawaii → Grape)
      } else if (currentSection === 2 && scrollDirection === -1) {
        if (sodaMaterial) {
          const newColor = sodaColors[3]; // **BlueHawaii の色**
          sodaMaterial.color.setRGB(newColor[0] / 255, newColor[1] / 255, newColor[2] / 255);
          rotationSpeedUpAndBack();
        }
        //上スクロール(Grape → Melon)
      } else if (currentSection === 1 && scrollDirection === -1) {
        if (sodaMaterial) {
          const newColor = sodaColors[2]; // **Grape の色**
          sodaMaterial.color.setRGB(newColor[0] / 255, newColor[1] / 255, newColor[2] / 255);
          rotationSpeedUpAndBack();
        }
        //上スクロール(Melon → KeyVisual)
      } else if (currentSection === 0 && scrollDirection === -1) {
        if (sodaMaterial) {
          const newColor = sodaColors[0]; // **Melon の色**
          sodaMaterial.color.setRGB(newColor[0] / 255, newColor[1] / 255, newColor[2] / 255);
          rotationSpeedUpAndBack();
        }
      }
      // **通常の切り返し時に色変更**
      else {
        if (sodaMaterial) {
          const newColor = sodaColors[currentSection]; // **現在のセクションの色を適用**
          sodaMaterial.color.setRGB(newColor[0] / 255, newColor[1] / 255, newColor[2] / 255);
        }
      }
    }

    // **RGB を補間して背景色を変化**
    const fromColor = backgroundColors[currentSection];
    const toColor = backgroundColors[nextSection];

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
