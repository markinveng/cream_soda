import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export function setupAnimations(scene, camera, renderer) {
  const clock = new THREE.Clock();
  let previousTime = 0;

  function animate() {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Render
    renderer.render(scene, camera);

    // 次のフレームをリクエスト
    requestAnimationFrame(animate);
  }

  animate(); // アニメーション開始

  // キービジュアルのフェードイン
  gsap.to(".keyVisual", {
    opacity: 1,
    duration: 2,
    ease: "power2.out",
  });

  // スクロールアニメーション設定
  const colors = {
    cream: new THREE.Color("#d1f07c"),
    grape: new THREE.Color("#7d3cff"),
    blueHawaii: new THREE.Color("#00aaff"),
    sakura: new THREE.Color("#ffb7c5"),
  };

  gsap
    .timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    })
    .to(scene, { backgroundColor: colors.cream, duration: 2 }) // HDR → クリームソーダ
    .to(scene, { backgroundColor: colors.grape, duration: 2 }) // クリームソーダ → グレープソーダ
    .to(scene, { backgroundColor: colors.blueHawaii, duration: 2 }) // グレープソーダ → ブルーハワイ
    .to(scene, { backgroundColor: colors.sakura, duration: 2 }) // ブルーハワイ → サクラ
    .to(scene, { backgroundColor: new THREE.Color(0x000000), duration: 2 }); // 最後は黒背景
}
