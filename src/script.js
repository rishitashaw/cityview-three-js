import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { CubeTexture, CubeTextureLoader, TorusBufferGeometry } from "three";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader()
  .setPath("texture/cube-map/")
  .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

/**
 * textures
 */
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
  "/texture/cube-map/px.png",
  "/texture/cube-map/nx.png",
  "/texture/cube-map/py.png",
  "/texture/cube-map/ny.png",
  "/texture/cube-map/pz.png",
  "/texture/cube-map/nz.png",
]);

/**
 * object
 */

//const material = new THREE.MeshNormalMaterial();
const material = new THREE.MeshStandardMaterial();
material.metalness = 1;
material.roughness = 0;
material.envMap = environmentMapTexture;

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  material
);
const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), material);
const torus = new THREE.Mesh(
  new TorusBufferGeometry(0.3, 0.2, 16, 32),
  material
);

scene.add(sphere, plane, torus);
/**
 * light
 */
const ambientLight = new THREE.AmbientLight(0xfff, 0.7);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xff0000);
document.addEventListener("mousemove", (event) => {
  var mouseX = event.clientX * 0.5;
  var mouseY = -event.clientY * 0.5;
  pointLight.position.x = mouseX;
  pointLight.position.y = mouseY;
  pointLight.position.z = 100;
});

scene.add(pointLight);

/**
 * positions
 * */
sphere.position.x = -1.5;
torus.position.x = 1.5;
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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // update objects
  sphere.rotation.x = 0.1 * elapsedTime;
  plane.rotation.x = 0.1 * elapsedTime;
  torus.rotation.x = 0.1 * elapsedTime;

  sphere.rotation.y = 0.15 * elapsedTime;
  plane.rotation.y = 0.15 * elapsedTime;
  torus.rotation.y = 0.15 * elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Update Orbital Controls
  controls.update();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
