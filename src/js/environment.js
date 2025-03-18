import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import * as THREE from "three";

export function setupEnvironment(scene, renderer, onLoad) {
  const rgbeLoader = new RGBELoader();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    rgbeLoader.load("/hdr/background2.hdr", (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        // **🔹 HDRを加工して暗くする**
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        envMap.encoding = THREE.sRGBEncoding;

        scene.environment = envMap;
        scene.background = envMap;

        // **PMREM のメモリを開放**
        texture.dispose();
        pmremGenerator.dispose();

        if (onLoad) onLoad();
    });
}
