// 从CDN导入Three.js核心库和插件（兼容ES模块）
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/controls/OrbitControls.js';

// 初始化场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

// 初始化相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 添加光源
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 添加控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 加载模型
const loader = new GLTFLoader();
loader.load(
  './assets/shiba.glb', // 注意使用相对路径
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // 自动调整相机位置
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    camera.position.copy(center);
    camera.position.z = size.length() * 1.5;
    controls.target.copy(center);
    controls.update();
  },
  undefined,
  (error) => {
    console.error('模型加载失败:', error);
    // 可选：显示错误提示
    document.body.innerHTML = `<div style="color:red;padding:20px;">模型加载失败，请检查控制台</div>`;
  }
);

// 窗口大小调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // 只在启用阻尼时需要
  renderer.render(scene, camera);
}
animate();