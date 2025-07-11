import gsap from "gsap";

/**
 * 画面ローディング処理
 * @param {Function} onLoadComplete - ロード完了時のコールバック関数
 * @returns {Function} - 読み込み完了を通知する関数
 */

export function setupLoading(onLoadComplete) {
  const loadingScreen = document.getElementById("loading-screen");
  let loadedAssets = 0;
  const totalAssets = 1;
  function assetLoaded() {
    loadedAssets++;
    if (loadedAssets === totalAssets) {
      gsap.to(loadingScreen, {
        opacity: 0,
        duration: 1,
        ease: "power1.inOut",
        onComplete: () => {
          loadingScreen.style.display = "none"; // フェードアウト完了後に非表示
          if (onLoadComplete) onLoadComplete();
        },
      });
    }
  }
  return assetLoaded;
}
