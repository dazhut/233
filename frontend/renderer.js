// 从 CDN 导入 Three.js 核心库和插件（ES Modules 版本）
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/controls/OrbitControls.js';

// 初始化场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

// 初始化相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 初始化渲染器（启用抗锯齿和物理校正光照）
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace; // 更自然的颜色
document.body.appendChild(renderer.domElement);

// 添加光源
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 添加控制器（带阻尼效果）
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false; // 更自然的平移

// 加载进度提示
const loadingElement = document.getElementById('loading');

// 加载模型（使用相对路径）
const loader = new GLTFLoader();
loader.load(
  './assets/shiba.glb',
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    loadingElement.style.display = 'none';

    // 自动调整相机位置
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    camera.position.copy(center);
    camera.position.z = size.length() * 1.5;
    controls.target.copy(center);
    controls.update();

    // 模型加载后添加点击事件示例
    model.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  },
  (xhr) => {
    // 加载进度更新
    const percent = Math.round((xhr.loaded / xhr.total) * 100);
    loadingElement.textContent = `加载中... ${percent}%`;
  },
  (error) => {
    console.error('模型加载失败:', error);
    loadingElement.innerHTML = `
      <div style="color:red;">
        <p>模型加载失败</p>
        <button onclick="window.location.reload()">重试</button>
      </div>
    `;
  }
);

// 响应式布局
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 动画循环（使用 requestAnimationFrame）
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
