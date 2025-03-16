import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas取得
const canvas = document.querySelector("canvas.webgl");

// シーン
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// HDRIをロード
const rgbeLoader = new RGBELoader();
let hdrTexture;
rgbeLoader.load("/hdr/background.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    hdrTexture = texture;
    scene.environment = texture;
    scene.background = texture; // 初期状態はHDR
});

// クリームソーダ、グレープソーダ、ブルーハワイ、サクラの色
const colors = {
  cream: new THREE.Color("#d1f07c"),
  grape: new THREE.Color("#7d3cff"),
  blueHawaii: new THREE.Color("#00aaff"),
  sakura: new THREE.Color("#ffb7c5"),
};

// スクロールアニメーション設定
gsap.timeline({
  scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1, // スクロールに合わせて動く
  }
})
.to(scene, { backgroundColor: colors.cream, duration: 2 })      // HDR → クリームソーダ
.to(scene, { backgroundColor: colors.grape, duration: 2 })      // クリームソーダ → グレープソーダ
.to(scene, { backgroundColor: colors.blueHawaii, duration: 2 }) // グレープソーダ → ブルーハワイ
.to(scene, { backgroundColor: colors.sakura, duration: 2 })     // ブルーハワイ → サクラ
.to(scene, { backgroundColor: hdrTexture, duration: 2 });

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

//animate();

/**
 * モデル読み込み
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;

//クリームソーダ
const textureLoader = new THREE.TextureLoader();
const strawTexture = textureLoader.load("/models/straw/straw_bake.png");
const creamDefuseTexture = textureLoader.load("/models/creamSoda/cream_bake_defuse.png");
const creamNormalTexture = textureLoader.load("/models/creamSoda/cream_bake_normal.png");

// テクスチャの設定
creamDefuseTexture.flipY = false;
creamDefuseTexture.minFilter = THREE.LinearFilter;
creamDefuseTexture.magFilter = THREE.LinearFilter;
creamNormalTexture.flipY = false;

const iceMaterial = new THREE.MeshPhysicalMaterial({
	color: 0xe0ffff,        // 氷っぽい薄い青
	transparent: true,       // 透明を有効化
	opacity: 0.5,            // 適度な透明感
	transmission: 1.0,       // 光の透過（1.0 で完全に透明）
	roughness: 0.05,         // 表面を滑らかに（0.0～0.1推奨）
	metalness: 0.0,          // 金属感なし
	ior: 1.31,              // 屈折率（氷のIOR: 1.31）
	thickness: 0.5,         // 厚み（屈折の強さ）
	side: THREE.DoubleSide,  // 両面描画
	depthWrite: false,       // 深度バッファ無効（奥のオブジェクトを表示）
});

strawTexture.flipY = false;
gltfLoader.load("/models/creamSoda/creamSoda_web.glb", (gltf) => {
  const glassMesh = gltf.scene.children[0];
  const sodaMesh = gltf.scene.children[1];
  const ice1Mesh = gltf.scene.children[2];
	ice1Mesh.position.y += 0.1;
  const ice2Mesh = gltf.scene.children[3];
  const ice3Mesh = gltf.scene.children[4];
  const ice4Mesh = gltf.scene.children[5];
  const bubbleMesh = gltf.scene.children[6];
  const creamMesh = gltf.scene.children[7];
  const strawMesh = gltf.scene.children[8];
  const cherryMesh = gltf.scene.children[9];

	glassMesh.depthWrite = false;
	sodaMesh.depthWrite = false;

	ice1Mesh.renderOrder = 4;
	ice2Mesh.renderOrder = 4;
	ice3Mesh.renderOrder = 4;
	ice4Mesh.renderOrder = 4;

	sodaMesh.renderOrder = 2;
	

	glassMesh.material = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,       // 白色（ガラスの反射色）
		transparent: true,     // 透明を有効化
		opacity: 0.5,         // 透明度（0 にすると完全に透明）
		transmission: 1.0,    // 光の透過率（1.0 で完全に光を通す）
		roughness: 0.1,       // 少しだけザラザラ感を加える
		metalness: 0.1,       // 金属感なし
		ior: 1.52,            // ガラスの屈折率（1.52 は標準的なガラスのIOR）
		thickness: 0.1,       // 厚み（屈折の強度に影響）
		side: THREE.DoubleSide, // 両面レンダリング
		depthWrite: false,    // 背後のオブジェクトを正しく描画するため
	});


	sodaMesh.material = new THREE.MeshPhysicalMaterial({
		color: 0x00ff00,
		transparent: true,      // 透明を有効化
    opacity: 0.5,          // 透明度を少し調整（水っぽく見せる）
    transmission: 0.95,     // 光の透過（1.0で完全に光を通す）
    roughness: 0.05,       // 表面の滑らかさ（水はほぼ0に近い）
    metalness: 0.0,        // 金属感なし
    ior: 1.33,            // 屈折率（水のIOR: 1.33）
    thickness: 1.0,       // 液体の厚み（0.5～1.5推奨）
    side: THREE.DoubleSide, // 両面レンダリング
    depthWrite: false,  
	});

	strawMesh.material = new THREE.MeshStandardMaterial({
		map: strawTexture,
		roughness: 0.5,
		metalness: 0.0,
	});

	creamMesh.material = new THREE.MeshStandardMaterial({
		map: creamDefuseTexture, 
    normalMap: creamNormalTexture,  // ノーマルマップ
    roughness: 0.5,  // 適宜調整
    metalness: 0.0   // 金属感なし
	});

	bubbleMesh.material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,        // 泡は白っぽい色
    transparent: true,       // 透明を有効化
    opacity: 1.0,            // 透明度（泡は半透明）
    transmission: 0.9,       // 光の透過率（1.0 で完全に光を通す）
    roughness: 0.2,         // 泡の表面は少し粗い
    metalness: 0.0,         // 金属感なし
    ior: 1.05,              // 屈折率（泡は空気と近いので1.05）
    thickness: 0.1,         // 厚み（泡は薄い）
    side: THREE.DoubleSide,  // 両面描画
    depthWrite: false,       // 背後のオブジェクトを描画
});

	ice1Mesh.material = iceMaterial
	ice2Mesh.material = iceMaterial
	ice3Mesh.material = iceMaterial
	ice4Mesh.material = iceMaterial


  gltf.scene.scale.set(1, 1, 1);
	gltf.scene.rotateY(Math.PI*-0.5);
  scene.add(gltf.scene);
});


/**
 * 地面
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0,
    roughness: 0.5,
		side: THREE.DoubleSide,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * 壁1
 */
const wall1 = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#ffffff",
    metalness: 0,
    roughness: 0.5,
		side: THREE.DoubleSide,
  })
);
wall1.receiveShadow = true;
wall1.position.x = 0;
wall1.position.y = 5;
wall1.position.z = -5;
scene.add(wall1);

// 壁2
const wall2 = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#ffffff",
    metalness: 0,
    roughness: 0.5,
		side: THREE.DoubleSide,
  })
);
wall2.rotation.y = -Math.PI * 0.5;
wall2.position.x = -5;
wall2.position.y = 5;
wall2.position.z = 0;
scene.add(wall2);

/**
 * 全体ライト
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.position.set(-5, 5, 0);
scene.add(directionalLight);

/**
 * ポイントライト
 */
const pointLight = new THREE.PointLight(0xffffff, 1.5, 10);
pointLight.castShadow = true;
pointLight.shadow.mapSize.set(1024, 1024);
pointLight.position.set(0, 0, 5);
scene.add(pointLight);



/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * カメラ
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 6, 4);
scene.add(camera);

// コントロール
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * レンダリング
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * アニメーション
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Model animation
  if (mixer) {
    mixer.update(deltaTime);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
