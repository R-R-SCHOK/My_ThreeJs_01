//use tree.js
import * as THREE from "three";

//link css
import "./style.css";

//import gsap
import gsap from "gsap";

//import controls
import { OrbitControls } from "three/examples/jsm/Addons.js";

//Scene
const scene = new THREE.Scene();

//setup sphere (radius, w segments, h segments) and material
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color:"#33aaff",
  roughness: .5,
});
//create the mesh by joining geometry and material
const mesh = new THREE.Mesh(geometry, material);
//add mesh to the scene
scene.add(mesh);

//Browser Sizes to use by camera and renderer
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//create camera (fov, aspect ratio v/h, close vanish point, far vanish point)
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
//camera position
camera.position.z = 20;
//add camera to scene
scene.add(camera);

//create light
const light = new THREE.PointLight(0xffffff, 500, 100);
light.position.set(0, 10, 10);
scene.add(light);

//add canvas to js
const canvas = document.querySelector('.webgl');
//create renderer
const renderer = new THREE.WebGLRenderer({canvas});
//define renderer size
renderer.setSize(sizes.width, sizes.height);
//make render smoother
renderer.setPixelRatio(2);
//what renderer must show
renderer.render(scene, camera);

//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
//desable panning
controls.enablePan = false;
//desable zoom
controls.enableZoom = false;
//add auto rotate
controls.autoRotate = true;
//speed of auto rotate
controls.autoRotateSpeed = 3;

//refresh at resize
window.addEventListener("resize", ()=>{
  //update new windows sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //update camera aspect
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  //update renderer sizes
  renderer.setSize(sizes.width, sizes.height);
})

//loop to refresh more that once
const loop = () =>{
  //makes sphere move after release (damp effet)
  controls.update();

  //update renderer
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

//call function to do fps
loop();

//gsap animation
const timeLine = gsap.timeline({defaults: {duration: 1}})
//(what, {from}, {to})
timeLine.fromTo(mesh.scale, {z:0, y:0, x:0}, {z:1, y:1, x:1})
timeLine.fromTo("nav", {y:-100}, {y:10})
timeLine.fromTo(".title", {opacity:0}, {opacity:1})


//mouse down animation
let mouseDown = false;
//colors variable array
let rgb = []
//figure if user holds mouse down!
window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))
//run function when mouse moving only if mouse down
window.addEventListener("mousemove", (e)=>{
if (mouseDown){

  //change R color based on x location of mouse
  rgb = [
    //round number from current page / page size * max-rgb value 255
    Math.round((e.pageX / sizes.width) * 255),
    //do same for G color on Y
    Math.round((e.pageY / sizes.height) * 255),
    150
  ]
  //store colors in new variables
  let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
  //use the RGB values now
  gsap.to(mesh.material.color, {
    r: newColor.r, 
    g: newColor.g, 
    b: newColor.b
  })
}
})