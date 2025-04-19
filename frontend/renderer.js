// 确保 THREE 已通过 CDN 全局注入
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// 控制器
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 加载模型
const loader = new THREE.GLTFLoader();
loader.load(
  'assets/shiba.glb',
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    
    // 自动调整相机
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    camera.position.copy(center);
    camera.position.z = box.getSize(new THREE.Vector3()).length() * 1.5;
    controls.update();
  },
  undefined,
  (error) => console.error('模型加载失败:', error)
);

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 响应窗口大小变化
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
