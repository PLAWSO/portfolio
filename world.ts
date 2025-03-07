import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";
import { CuboidShape, CylinderShape } from "./src/shapes/ObjectShapes";
import { PhysicsInitModel } from "./src/physics/PhysicsInitModel";
import { Cuboid } from "./src/shapes/Cuboid";
import * as CANNON from "cannon-es";
import { Cylinder } from "./src/shapes/Cylinder";

const fov = 90;
const aspect = window.innerWidth / window.innerHeight;
const near = 1.0;
const far = 1000.0;
const scale = 4;
const doPhysics = true;

interface PhysicsObject {
  mesh: THREE.Mesh;
  rigidBody: CANNON.Body;
}

export class World {
  physicsWorld: CANNON.World;
  threejs: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;

  physicsObjects: PhysicsObject[] = [];
  springs: CANNON.Spring[] = [];

  lastSecondFrames = 0;
  totalFrames = 0;

  constructor() {
    this.initialize();
  }

  initialize() {
    this.startCannon();

    this.startScene();

    this.startCamera();

    this.scene = new THREE.Scene();

    this.startEnvLight();

    this.startFrameRateCounter();

    const controls = new MapControls(this.camera, this.threejs.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 20, 0);
    controls.update();

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      "./assets/skybox/east.png",
      "./assets/skybox/west.png",
      "./assets/skybox/up.png",
      "./assets/skybox/down.png",
      "./assets/skybox/north.png",
      "./assets/skybox/south.png",
    ]);
    this.scene.background = texture;

    this.physicsObjects = [];

    this.startRender();
  }

  startCannon() {
    this.physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -100, 0),
    });
  }

  startScene() {
    this.threejs = new THREE.WebGLRenderer({
      antialias: false,
    });
    this.threejs.shadowMap.enabled = true;
    this.threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this.threejs.shadowMap.enabled = true;

    document.body.appendChild(this.threejs.domElement);

    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize_();
      },
      false,
    );
  }

  onWindowResize_() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.threejs.setSize(window.innerWidth / scale, window.innerHeight / scale);
  }

  startCamera() {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(75, 20, 0);
    this.onWindowResize_();
  }

  startEnvLight() {
    let light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this.scene.add(light);

    let ambientLight = new THREE.AmbientLight(0x101010);
    this.scene.add(ambientLight);
  }

  startFrameRateCounter() {
    setInterval(() => {
      let htmlFrameCounter = document.getElementById("info");
      if (htmlFrameCounter) {
        htmlFrameCounter.innerHTML = `FPS: ${this.lastSecondFrames}`;
      }
      this.lastSecondFrames = 0;
    }, 1000);
  }

  startRender() {
    this.doAnimationFrame();
  }

  doAnimationFrame() {
    requestAnimationFrame((t) => {
      if (doPhysics) {
        this.doPhysicsStep();
      }
      this.threejs.render(this.scene, this.camera);
      this.lastSecondFrames++;
      this.totalFrames++;
      this.doAnimationFrame();
    });
  }

  doPhysicsStep() {
    this.physicsWorld.fixedStep();

    this.physicsObjects.forEach((physicsObj, i) => {
      physicsObj.mesh.position.copy(physicsObj.rigidBody.position);
      physicsObj.mesh.quaternion.copy(physicsObj.rigidBody.quaternion);
      // if (this.totalFrames % 480 == 0 && i == 0) {
      //   console.log("POS: ", this.physicsObjects[i].rigidBody.quaternion);
      // }
    });

    this.springs.forEach((spring) => {
      spring.applyForce();
    });
  }

  createBox(
    size?: CuboidShape,
    physicsInit?: PhysicsInitModel,
    position?: any,
    color?: number,
    rotation?: THREE.Vector3,
  ) {
    const box = new Cuboid(size, physicsInit, position, color, rotation);
    this.scene.add(box);
    console.log("ADDING BOX: ", box.cannonObj);
    if (physicsInit) {
      this.physicsWorld.addBody(box.cannonObj);
      this.physicsObjects.push({ mesh: box, rigidBody: box.cannonObj });
    }

    return box;
  }

  createCylinder(
    size?: CylinderShape,
    physicsInit?: PhysicsInitModel,
    position?: any,
    color?: number,
    rotation?: THREE.Vector3,
  ) {
    const cylinder = new Cylinder(size, physicsInit, position, color, rotation);
    this.scene.add(cylinder);
    console.log("ADDING CYLINDER: ", cylinder.cannonObj);
    if (physicsInit) {
      this.physicsWorld.addBody(cylinder.cannonObj);
      this.physicsObjects.push({
        mesh: cylinder,
        rigidBody: cylinder.cannonObj,
      });
    }
    return cylinder;
  }
}
