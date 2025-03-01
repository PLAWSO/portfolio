import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";
import { Rect } from "./src/shapes/Rect";
import {
  basicPhysicsInitModel,
  PhysicsInitModel,
} from "./src/physics/PhysicsInitModel";
import { Cuboid } from "./src/shapes/Cuboid";

declare var Ammo: any;

const fov = 90;
const aspect = window.innerWidth / window.innerHeight;
const near = 1.0;
const far = 1000.0;
const scale = 4;

export class World {
  // might not need to store these -v keeping in case for now
  collisionConfiguration_: any;
  dispatcher_: any;
  broadphase_: any;
  solver_: any;

  physicsWorld_: any;
  threejs_: any;
  camera_: any;
  scene_: any;
  rigidBodies_: any[];
  tmpTransform_: any;
  previousRAF_: any;
  lastSecondFrames: number = 0;

  constructor() {
    this.initialize();
  }

  initialize() {
    this.startAmmo();

    this.startScene();

    this.startCamera();

    this.scene_ = new THREE.Scene();

    this.startEnvLight();

    this.startFrameRateCounter();

    const controls = new MapControls(this.camera_, this.threejs_.domElement);
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
    this.scene_.background = texture;

    this.rigidBodies_ = [];

    this.tmpTransform_ = new Ammo.btTransform();

    this.previousRAF_ = null;

    this.startRender();
  }

  startAmmo() {
    this.collisionConfiguration_ = new Ammo.btDefaultCollisionConfiguration();
    this.dispatcher_ = new Ammo.btCollisionDispatcher(
      this.collisionConfiguration_,
    );
    this.broadphase_ = new Ammo.btDbvtBroadphase();
    this.solver_ = new Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld_ = new Ammo.btDiscreteDynamicsWorld(
      this.dispatcher_,
      this.broadphase_,
      this.solver_,
      this.collisionConfiguration_,
    );
    this.physicsWorld_.setGravity(new Ammo.btVector3(0, -100, 0));
  }

  startScene() {
    this.threejs_ = new THREE.WebGLRenderer({
      antialias: false,
    });
    this.threejs_.shadowMap.enabled = true;
    this.threejs_.shadowMap.type = THREE.PCFSoftShadowMap;
    this.threejs_.shadowMap.enabled = true;

    document.body.appendChild(this.threejs_.domElement);

    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize_();
      },
      false,
    );
  }

  onWindowResize_() {
    this.camera_.aspect = window.innerWidth / window.innerHeight;
    this.camera_.updateProjectionMatrix();
    this.threejs_.setSize(
      window.innerWidth / scale,
      window.innerHeight / scale,
    );
  }

  startCamera() {
    this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera_.position.set(75, 20, 0);
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
    this.scene_.add(light);

    let ambientLight = new THREE.AmbientLight(0x101010);
    this.scene_.add(ambientLight);
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
      if (this.previousRAF_ === null) {
        this.previousRAF_ = t;
      }

      this.doPhysicsStep(t - this.previousRAF_);
      this.threejs_.render(this.scene_, this.camera_);
      this.doAnimationFrame();
      this.previousRAF_ = t;
      this.lastSecondFrames++;
    });
  }

  doPhysicsStep(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;

    this.physicsWorld_.stepSimulation(timeElapsedS, 10);

    for (let i = 0; i < this.rigidBodies_.length; ++i) {
      this.rigidBodies_[i].rigidBody.motionState_.getWorldTransform(
        this.tmpTransform_,
      );
      const pos = this.tmpTransform_.getOrigin();
      const quat = this.tmpTransform_.getRotation();
      const pos3 = new THREE.Vector3(pos.x(), pos.y(), pos.z());
      const quat3 = new THREE.Quaternion(
        quat.x(),
        quat.y(),
        quat.z(),
        quat.w(),
      );

      this.rigidBodies_[i].mesh.position.copy(pos3);
      this.rigidBodies_[i].mesh.quaternion.copy(quat3);
    }
  }

  createBox(
    size?: Rect,
    physicsInit?: PhysicsInitModel,
    position?: any,
    quat?: any,
    color?: number,
  ) {
    const box = new Cuboid(size, physicsInit, position, quat, color);
    this.scene_.add(box);
    this.physicsWorld_.addRigidBody(box.ammoObj.body_);
    this.rigidBodies_.push({ mesh: box, rigidBody: box.ammoObj });

    return box;
  }
}
