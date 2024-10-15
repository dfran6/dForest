import * as THREE from 'three';
import "./style.css";
import gsap from 'gsap';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

// Create the scene
const scene = new THREE.Scene();

// Add camera
const camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 5500);
camera.position.set(0.5, 40, 25);
scene.add(camera);


//model

let land;
let car;
let tire1,tire2,tire3,tire4;

const loader = new GLTFLoader();
 loader.load('/glt/dforest2.gltf',(gltf) => {
    let model = gltf.scene
    scene.add(model)

    car = model.getObjectByName('car');
    car.rotation.set(0,Math.PI /2, 0);

    land =model.getObjectByName('floor001')

    //car tires
    tire1 = model.getObjectByName('tire1')
    tire2 = model.getObjectByName('tire2')
    tire3 = model.getObjectByName('tire3')
    tire4 = model.getObjectByName('tire4')
    console.log(model);
 }, undefined, (error) => {
    console.error(error);
});

// Add renderer
const canvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Add basic light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 10);
scene.add(light);

// Add ambient light
const dayAmbientLight = new THREE.AmbientLight(0xADD8E6, 0.7);
scene.add(dayAmbientLight);

// Window resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Ground
// const groundGeometry = new THREE.PlaneGeometry(5000,5000);
// const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x025902, });
// const ground = new THREE.Mesh(groundGeometry, groundMaterial);
// ground.rotation.x = -Math.PI / 2;
// scene.add(ground);


//carBody

//carBodyTop
const carTopGeo = new THREE.BoxGeometry(2,2,4);
const carTopMat = new THREE.MeshStandardMaterial({
  color:'yellow',
})

const carTopMesh = new THREE.Mesh(carTopGeo,carTopMat);
scene.add(carTopMesh);

// //poles
// const poleGeo = new THREE.BoxGeometry(4,24,4);
// const poleMat = new THREE.MeshStandardMaterial({
//   color:'red',
// });

// const poleMesh = new THREE.Mesh(poleGeo,poleMat);
// scene.add(poleMesh)


//plank stuff
const plankGeo = new THREE.BoxGeometry(8,28,40);
const plankMat = new THREE.MeshStandardMaterial({
  color:'red',
});

const plankMesh = new THREE.Mesh(plankGeo,plankMat);
scene.add(plankMesh)


//Controls 
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 2



//////////////////////////////////////////////////////////
//////////////////////////////////////////////



// Cannon.js World
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Cannon.js Ground
const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane()
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// Car body
const carBody = new CANNON.Body({
    mass: 1000,
    position: new CANNON.Vec3(0, 25, 0),
    shape: new CANNON.Box(new CANNON.Vec3(10, 3, 5))
});

const vehicle = new CANNON.RigidVehicle({
    chassisBody: carBody,
});

// Wheels
const mass = 500;
const axisWidth = 9.7;
const wheelShape = new CANNON.Sphere(1);
const wheelMaterial = new CANNON.Material('wheel');
const down = new CANNON.Vec3(0, -1, 0);

const wheelBody1 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody1.addShape(wheelShape);
wheelBody1.angularDamping = 0.4;
vehicle.addWheel({
    body: wheelBody1,
    position: new CANNON.Vec3(-9, -3, axisWidth / 2),
    axis: new CANNON.Vec3(0, 0, 1),
    direction: down,
});

const wheelBody2 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody2.addShape(wheelShape);
wheelBody2.angularDamping = 0.4;
vehicle.addWheel({
    body: wheelBody2,
    position: new CANNON.Vec3(-9, -3, -axisWidth / 2),
    axis: new CANNON.Vec3(0, 0, 1),
    direction: down,
});

const wheelBody3 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody3.addShape(wheelShape);
wheelBody3.angularDamping = 0.4;
vehicle.addWheel({
    body: wheelBody3,
    position: new CANNON.Vec3(7, -3, -axisWidth / 2),
    axis: new CANNON.Vec3(0, 0, 1),
    direction: down,
});

const wheelBody4 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody4.addShape(wheelShape);
wheelBody4.angularDamping = 0.4;
vehicle.addWheel({
    body: wheelBody4,
    position: new CANNON.Vec3(7, -3, axisWidth / 2),
    axis: new CANNON.Vec3(0, 0, 1),
    direction: down,
});

const wheelBody5 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody5.addShape(wheelShape);
wheelBody4.angularDamping = 0.4;
vehicle.addWheel({
    body: wheelBody5,
    position: new CANNON.Vec3(9, 3, -0.4),
    axis: new CANNON.Vec3(0, 0, 1),
    direction: down,
});

vehicle.addToWorld(world);



//stoppers

const poleBody = new CANNON.Body({
    mass:10000,
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(2, 12, 2)),
    position: new CANNON.Vec3(18,13,-33),
}) ;

world.addBody(poleBody);


const poleBody1 = new CANNON.Body({
    mass:10000,
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(2, 12, 2)),
    position: new CANNON.Vec3(110,13,-125),
}) ;

world.addBody(poleBody1)

const poleBody2 = new CANNON.Body({
    mass:10000,
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(2, 12, 2)),
    position: new CANNON.Vec3(155,13,70),
}) ;

world.addBody(poleBody2)

const poleBody3 = new CANNON.Body({
    mass:10000,
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(2, 12, 2)),
    position: new CANNON.Vec3(-250,13,-33),
}) ;

world.addBody(poleBody3);


const poleBody4 = new CANNON.Body({
    mass:10000,
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(2, 12, 2)),
    position: new CANNON.Vec3(20,13,207),
}) ;

world.addBody(poleBody4)


const poleBody5 = new CANNON.Body({
    mass:10000,
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(2, 12, 2)),
    position: new CANNON.Vec3(-70,13,207),
}) ;

world.addBody(poleBody5)

const wallBody1 = new CANNON.Body({
    mass:10000,
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(2, 9, 370)),
    position: new CANNON.Vec3(-373,1,0),
}) ;

world.addBody(wallBody1)

const wallBody2 = new CANNON.Body({
    mass:10000,
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(2, 9, 370)),
    position: new CANNON.Vec3(373,13,0),
}) ;

world.addBody(wallBody2)

const wallBody3 = new CANNON.Body({
    mass:10000,
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(379, 9, 3)),
    position: new CANNON.Vec3(0,13,373),
}) ;

world.addBody(wallBody3)


const wallBody4 = new CANNON.Body({
    mass:10000,
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(379, 9, 3)),
    position: new CANNON.Vec3(0,13,-375),
}) ;

world.addBody(wallBody4)

const wallBody5 = new CANNON.Body({
    mass:10000,
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(4, 4, 4)),
    position: new CANNON.Vec3(-350,5,20),
}) ;

world.addBody(wallBody5)

const rampFloor = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(4, 14, 20)),
    position: new CANNON.Vec3(-330,4,20),
    
});

rampFloor.quaternion.setFromEuler(-Math.PI / 2, 2, 0);
world.addBody(rampFloor);


//cannonDebu
const cannonDebugger = new CannonDebugger(scene, world, {
    color: 'red'
});

// Keyboard controls
const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

window.addEventListener('keydown', (e) => {
    if (e.key in keysPressed) keysPressed[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key in keysPressed) keysPressed[e.key] = false;
});

// Speed and turning
const maxSteerVal = 0.3;
const maxForce = 15000;

function handleControls() {
    if (keysPressed.ArrowUp) {
        vehicle.setWheelForce(maxForce, 2);
        vehicle.setWheelForce(maxForce, 3);
    } else if (keysPressed.ArrowDown) {
        vehicle.setWheelForce(-maxForce, 2);
        vehicle.setWheelForce(-maxForce, 3);
    } else {
        vehicle.setWheelForce(0, 2);
        vehicle.setWheelForce(0, 3);
    }

    if (keysPressed.ArrowLeft) {
        vehicle.setSteeringValue(maxSteerVal, 0);
        vehicle.setSteeringValue(maxSteerVal, 1);
    } else if (keysPressed.ArrowRight) {
        vehicle.setSteeringValue(-maxSteerVal, 0);
        vehicle.setSteeringValue(-maxSteerVal, 1);
    } else {
        vehicle.setSteeringValue(0, 0);
        vehicle.setSteeringValue(0, 1);
    }
}
camera.position.z = 10;
camera.position.y = 70;





  // Sky Shader
  const skyGeo = new THREE.SphereGeometry(500, 32, 32);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(0x0077ff) },
      bottomColor: { value: new THREE.Color(0xffffff) },
      offset: { value: 33 },
      exponent: { value: 0.6 }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    `,
    side: THREE.BackSide
  });
  
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

function animate() {
    requestAnimationFrame(animate);
    // controls.update()
    // Update Cannon.js World
    world.step(1 / 60);
    // cannonDebugger.update();

    handleControls();
    
    // land.quaternion.copy(groundBody.quaternion);
    land.position.copy(groundBody.position);


  
    car.position.copy(carBody.position)
    car.quaternion.copy(carBody.quaternion)
    // car.rotation.y += Math.PI/2;
    

    carTopMesh.position.copy(wheelBody5.position)
    carTopMesh.quaternion.copy(wheelBody5.quaternion)
    

    
    tire1.position.copy(wheelBody1.position)
    tire1.quaternion.copy(wheelBody1.quaternion)
    tire1.rotation.set(0,Math.PI /2, 0);


    tire2.position.copy(wheelBody2.position)
    tire2.quaternion.copy(wheelBody2.quaternion)
    tire2.rotation.set(0,Math.PI /2, 0);


    tire3.position.copy(wheelBody3.position)
    tire3.quaternion.copy(wheelBody3.quaternion)
    tire3.rotation.set(0,Math.PI /2, 0);


    tire4.position.copy(wheelBody4.position)
    tire4.quaternion.copy(wheelBody4.quaternion)
    tire4.rotation.set(0,Math.PI /2, 0);


    plankMesh.position.copy(rampFloor.position)
    plankMesh.quaternion.copy(rampFloor.quaternion);


    // poleMesh.position.copy(poleBody.position)

    camera.lookAt(car.position)
    

    renderer.render(scene, camera);
}


animate();

// GSAP animations
const tl = gsap.timeline({ defaults: { duration: 1 } });
const t2 = gsap.timeline({ defaults: { duration: 2 } });
const t3 = gsap.timeline({ defaults: { duration: 5 } });
const t4 = gsap.timeline({ defaults: { duration: 20 } });

tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
t2.fromTo("canvas#webgl", { y: "100%" }, { y: "0%" });
