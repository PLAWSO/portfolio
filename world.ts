import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";
import { CuboidShape, CylinderShape } from "./src/shapes/ObjectShapes";
import { PhysicsInitModel } from "./src/physics/PhysicsInitModel";
import { SpringInitModel } from "./src/physics/SpringInitModel";
import { Cuboid } from "./src/shapes/Cuboid";
import * as CANNON from "cannon-es";
import { Cylinder } from "./src/shapes/Cylinder";
import cannonDebugger from "cannon-es-debugger";

const fov = 90;
const aspect = window.innerWidth / window.innerHeight;
const near = 1.0;
const far = 1000.0;
const scale = 1;

interface PhysicsObject {
  mesh: THREE.Mesh;
  rigidBody: CANNON.Body;
}

interface SpringHelper {
  line: THREE.Line;
  spring: CANNON.Spring;
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
  cannonDebugger: any = null;
  doPhysics: boolean = true;
  frameRate: number = 60;
  springHelpers: SpringHelper[] = [];

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

    this.startCannonDebug();

    this.startRender();
  }

  startCannon() {
    this.physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -100, 0),
    });
  }

  startCannonDebug() {
    this.cannonDebugger = cannonDebugger(this.scene, this.physicsWorld, {
      color: 0xafafaf,
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
      if (this.doPhysics) {
        this.doPhysicsStep();
        if (this.cannonDebugger) {
          this.cannonDebugger.update();
          this.updateSpringHelpers();
        }
      }

      this.threejs.render(this.scene, this.camera);
      this.lastSecondFrames++;
      this.totalFrames++;
      this.doAnimationFrame();
    });
  }

  updateSpringHelpers() {
    this.springHelpers.forEach((springHelper) => {
      const bodyAPos = springHelper.spring.bodyA.position;
      const bodyBPos = springHelper.spring.bodyB.position;
      springHelper.line.geometry.setFromPoints([
        new THREE.Vector3(bodyAPos.x, bodyAPos.y, bodyAPos.z),
        new THREE.Vector3(bodyBPos.x, bodyBPos.y, bodyBPos.z),
      ]);
    });
  }

  doPhysicsStep() {
    this.physicsWorld.fixedStep();

    this.physicsObjects.forEach((physicsObj, i) => {
      physicsObj.mesh.position.copy(physicsObj.rigidBody.position);
      physicsObj.mesh.quaternion.copy(physicsObj.rigidBody.quaternion);
      // if (this.totalFrames % this.frameRate == 0 && i == 0) {
      //   console.log("POS: ", physicsObj.rigidBody.quaternion);
      // }
    });

    this.springs.forEach((spring, i) => {
      spring.applyForce();
      // if (this.totalFrames % this.frameRate == 0 && i == 0) {
      //   console.log("POS: ", spring);
      // }
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
    console.log("ADDING BOX: ", box);
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
    console.log("ADDING CYLINDER: ", cylinder);
    if (physicsInit) {
      this.physicsWorld.addBody(cylinder.cannonObj);
      this.physicsObjects.push({
        mesh: cylinder,
        rigidBody: cylinder.cannonObj,
      });
    }
    return cylinder;
  }

  createSpring(
    bodyA: CANNON.Body,
    bodyB: CANNON.Body,
    options: SpringInitModel,
  ) {
    const spring = new CANNON.Spring(bodyA, bodyB, {
      restLength: options.restLength,
      stiffness: options.stiffness,
      damping: options.damping,
    });
    this.springs.push(spring);
    console.log("ADDING SPRING: ", spring);

    if (this.cannonDebugger) {
      const bodyAPos = spring.bodyA.position;
      const bodyBPos = spring.bodyB.position;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(bodyAPos.x, bodyAPos.y, bodyAPos.z),
        new THREE.Vector3(bodyBPos.x, bodyBPos.y, bodyBPos.z),
      ]);
      const springLine = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({ color: 0xff0000 }),
      );
      this.scene.add(springLine);
      this.springHelpers.push({ line: springLine, spring });
    }

    return spring;
  }
}
