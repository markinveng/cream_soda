import { scene, camera, renderer, canvas } from "./js/scene.js";
import { setupLights } from "./js/lights.js";
import { loadModels } from "./js/models.js";
import { setupAnimations } from "./js/animations.js";
import { setupLoading } from "./js/loading.js";

// **🔹 ページロード時にスクロールをトップに設定**
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

// **ローディング処理をセットアップ**
const assetLoaded = setupLoading();

// **ライトを追加**
setupLights(scene);

// **モデル読み込み¥
loadModels(scene, (model) => {
  assetLoaded();
  setupAnimations(scene, camera, renderer, model); // **モデルをアニメーションに渡す**
});