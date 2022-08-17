import "./style.css";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

//* SETUP
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas, scene, and light
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75, // Field of view (FOV) - degrees of vertical field of view - how much we can see
  window.innerWidth / window.innerHeight, // Aspect ratio - ratio between widt and height of scene
  0.6, // Near clipping plane - boundary plane closest to camera - we can't see anything closer than this
  1200 // Far clipping plane - boundary plane furthest from camera - we can't see anything beyond this
);
camera.position.z = 5; // Offset camera position
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true, // Antialias = smooth edges
});
renderer.setClearColor("#233143"); // Set backgorund color of scene
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Make responsive
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

//* LIGHTS
const lights = [];
const lightHelpers = [];
const lightValues = [
  { colour: 0x14d14a, intensity: 8, dist: 12, x: 1, y: 0, z: 8 },
  { colour: 0xbe61cf, intensity: 6, dist: 12, x: -2, y: 1, z: -10 },
  { colour: 0x00ffff, intensity: 3, dist: 10, x: 0, y: 10, z: 1 },
  { colour: 0x00ff00, intensity: 6, dist: 12, x: 0, y: -10, z: -1 },
  { colour: 0x16a7f5, intensity: 6, dist: 12, x: 10, y: 3, z: 0 },
  { colour: 0x90f615, intensity: 6, dist: 12, x: -10, y: -1, z: 0 },
];
for (let i = 0; i < lightValues.length; i++) {
  lights[i] = new THREE.PointLight(
    lightValues[i]["colour"],
    lightValues[i]["intensity"],
    lightValues[i]["dist"]
  );
  lights[i].position.set(
    lightValues[i]["x"],
    lightValues[i]["y"],
    lightValues[i]["z"]
  );
  scene.add(lights[i]);
  lightHelpers[i] = new THREE.PointLightHelper(lights[i], 0.7);
  //   scene.add(lightHelpers[i]);
}

//* CREATE BOX
const boxGeometry = new THREE.BoxGeometry(2, 2, 2); // width, height, depth
const boxMatieral = new THREE.MeshLambertMaterial({ color: 0xffffff }); // material for non-shiny surfaces (untreated wood or stone)
const boxMesh = new THREE.Mesh(boxGeometry, boxMatieral); // make mesh with geometry and material
boxMesh.rotation.set(40, 0, 40); // x, y, z
scene.add(boxMesh);

// CREATE SPHERES
const sphereMeshes = [];
const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xc56cef });
for (let i = 0; i < 4; i++) {
  sphereMeshes[i] = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMeshes[i].position.set(0, 0, 0);
  scene.add(sphereMeshes[i]);
}

//* AXES HELPER
const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper); // X == red, Y == green, Z == blue

//* CAMERA TRACKBALL CONTROLS
const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 4;
controls.dynamicDampingFactor = 0.15;

//* Trigonometry Constants for Orbital Paths
let theta = 0; // Angle
const dTheta = (2 * Math.PI) / 200; // Change in theta every timeframe

//* ANIMATE
// Animation loop - redraws scene every time screen refreshes
const tick = () => {
  // Constantly rotate box
  boxMesh.rotation.y -= 0.005;
  boxMesh.rotation.x -= 0.001;

  // Update trackball controls
  controls.update();

  // Update spheres  orbital path
  theta += dTheta;
  const trigs = [
    {
      x: Math.cos(theta * 1.05),
      y: Math.sin(theta * 1.05),
      z: Math.cos(theta * 1.05),
      r: 2,
    },
    {
      x: Math.cos(theta * 0.8),
      y: Math.sin(theta * 0.8),
      z: Math.sin(theta * 0.8),
      r: 2.25,
    },
    {
      x: Math.cos(theta * 1.25),
      y: Math.cos(theta * 1.25),
      z: Math.sin(theta * 1.25),
      r: 2.5,
    },
    {
      x: Math.sin(theta * 0.6),
      y: Math.cos(theta * 0.6),
      z: Math.sin(theta * 0),
      r: 2.75,
    },
  ];
  for (let i = 0; i < trigs.length; i++) {
    sphereMeshes[i].position.x = trigs[i]["r"] * trigs[i]["x"];
    sphereMeshes[i].position.y = trigs[i]["r"] * trigs[i]["y"];
    sphereMeshes[i].position.z = trigs[i]["r"] * trigs[i]["z"];
  }

  // Render
  renderer.render(scene, camera); // Render scene using camera

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
