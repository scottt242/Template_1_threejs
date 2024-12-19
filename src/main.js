// Import Three.js and OrbitControls
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import {Pane} from "tweakpane"
// Select custom canvas element
const canvas = document.querySelector('.canvas');

// Set up renderer with the custom canvas
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Set up the scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const loader=new THREE.TextureLoader()
const lensflare0=loader.load( "https://threejs.org/examples/textures/lensflare/lensflare0.png")
const lensflare1=loader.load("https://threejs.org/examples/textures/lensflare/lensflare3.png")
const star = loader.load("../images/Texturelabs_LensFX_234S.jpg")
const sunMap=loader.load("../images/sun.jpg")


const background=new THREE.CubeTextureLoader()
.setPath("../cubeMap/")
.load([
  'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'
])



const boxGeo=new THREE.BoxGeometry(2,2,2)
const boxMat=new THREE.MeshStandardMaterial({color:"green"})
boxMat.roughness=.5
boxMat.metalness=.5
boxMat.envMap=background
const box = new THREE.Mesh(boxGeo, boxMat)
box.position.set(0,0,0)
scene.add(box)

const pane=new Pane()
pane.addBinding(boxMat,"roughness",{
  min:0,
  max:1,
  step:0.01,
  value:0.5,
})
pane.addBinding(boxMat,"metalness",{
  min:0,
  max:1,
  step:0.01,
  value:0.5,
})



let positions=[]
for(let i=0;i<1000;i++){//1000 point
  let x=Math.random()*2000 - 1000//distance
  let y=Math.random()*2000 - 1000
  let z=Math.random()*2000 - 1000
  //1000 cord(x,y,z)
  positions.push(x,y,z)
}
const geometry = new THREE.BufferGeometry()
geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions),3))
const material = new THREE.PointsMaterial({size:1,  blending: THREE.AdditiveBlending,transparent:true,map:star})//blending like brightness
const points=new THREE.Points(geometry,material)//put point in buffer points
scene.add(points)
// Add ambient light for subtle background lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 10);
scene.add(ambientLight);
//point material is not an environment material
const axes=new THREE.AxesHelper(5)
scene.add(axes)
// Create a point light with increased distance and intensity
const pointLight = new THREE.PointLight(0xffffff, 500,50); // Intensity 1, distance 50
pointLight.position.set(5, 5, 5);
scene.add(pointLight);
const lightAxes=new THREE.PointLightHelper(pointLight,2)
scene.add(lightAxes)


const lensflare=new Lensflare()
lensflare.addElement(new LensflareElement(lensflare0, 1000, 0.0))
lensflare.addElement(new LensflareElement(lensflare1, 60, 0.6))
lensflare.addElement(new LensflareElement(lensflare1, 90, 0.7))
lensflare.addElement(new LensflareElement(lensflare1, 80, .8))
pointLight.add(lensflare)
// Position the camera
camera.position.z = 5;

// Set up OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.autoRotate = false;

// Animation loop
function animate() {
//   let time=new Date()*0.0005
//   for ( let i = 0; i < scene.children.length; i ++ ) {
//     const object = scene.children[ i ];
//     if ( object instanceof THREE.Points ) {
       //  points.rotation.z +=0.01
//     }
// }
//sun.rotation.x+=0.01

  window.requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
