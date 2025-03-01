import WebGL from "three/addons/capabilities/WebGL.js";
import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";
import { Color } from "three";
import { Cuboid } from "./src/shapes/Cuboid";
import { Rect } from "./src/shapes/Rect";
import { World } from "./world";
import { basicPhysicsInitModel, PhysicsInitModel } from "./src/physics/PhysicsInitModel";

declare var Ammo: any;

let box: Cuboid;

document.onkeydown = function (e) {
  console.log(e.key);
  if (e.key === "w") {
    box.ammoObj.body_.applyCentralImpulse(new Ammo.btVector3(-10, 0, 0));
  }
  if (e.key === "s") {
    box.ammoObj.body_.applyCentralImpulse(new Ammo.btVector3(10, 0, 0));
  }
  if (e.key === "a") {
    box.ammoObj.body_.applyCentralImpulse(new Ammo.btVector3(0, 0, 10));
  }
  if (e.key === "d") {
    box.ammoObj.body_.applyCentralImpulse(new Ammo.btVector3(0, 0, -10));
  }
  if (e.key === " ") {
    box.ammoObj.body_.applyCentralImpulse(new Ammo.btVector3(0, 10, 0));
  }
  if (e.key === "r") {
    box.ammoObj.body_.setLinearVelocity(new Ammo.btVector3(0, 0, 0));
    box.ammoObj.body_.setAngularVelocity(new Ammo.btVector3(0, 0, 0));
    box.ammoObj.body_.setWorldTransform(box.ammoObj.transform_);
  }
};

window.addEventListener("DOMContentLoaded", async () => {
  Ammo().then((lib) => {
    Ammo = lib;

    if (WebGL.isWebGL2Available()) {
      startScene();
    } else {
      const warning = WebGL.getWebGL2ErrorMessage();
      document.getElementById("container")?.appendChild(warning);
    }
  });
});

function startScene() {
  const world = new World();

  // CUBE 3
  const cubePhysicsModel = new PhysicsInitModel(0.25, 10, 5, 0);


  box = new Cuboid(new Rect(4, 4, 4), basicPhysicsInitModel, new Ammo.btVector3(0, 40, 0));
  world.scene_.add(box);
  box.ammoObj.body_.setRestitution(0.25);
  box.ammoObj.body_.setFriction(10);
  box.ammoObj.body_.setRollingFriction(5);
  world.physicsWorld_.addRigidBody(box.ammoObj.body_);
  world.rigidBodies_.push({ mesh: box, rigidBody: box.ammoObj });




  // GROUND
  const ground = new THREE.Mesh(
    new THREE.BoxGeometry(100, 1, 100),
    new THREE.MeshStandardMaterial({ color: 0x404040 }),
  );
  ground.castShadow = false;
  ground.receiveShadow = true;
  world.scene_.add(ground);

  const rbGround = new RigidBody();
  rbGround.createBox(
    0,
    ground.position,
    ground.quaternion,
    new THREE.Vector3(100, 1, 100),
  );
  rbGround.setRestitution(0.99);
  world.physicsWorld_.addRigidBody(rbGround.body_);






}

class RigidBody {
  constructor() {}

  setRestitution(val) {
    this.body_.setRestitution(val);
  }

  setFriction(val) {
    this.body_.setFriction(val);
  }

  setRollingFriction(val) {
    this.body_.setRollingFriction(val);
  }

  createBox(mass, pos, quat, size) {
    this.transform_ = new Ammo.btTransform();
    this.transform_.setIdentity();
    this.transform_.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    this.transform_.setRotation(
      new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w),
    );
    this.motionState_ = new Ammo.btDefaultMotionState(this.transform_);

    const btSize = new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
    this.shape_ = new Ammo.btBoxShape(btSize);
    this.shape_.setMargin(0.05);

    this.inertia_ = new Ammo.btVector3(0, 0, 0);
    if (mass > 0) {
      this.shape_.calculateLocalInertia(mass, this.inertia_);
    }

    this.info_ = new Ammo.btRigidBodyConstructionInfo(
      mass,
      this.motionState_,
      this.shape_,
      this.inertia_,
    );
    this.body_ = new Ammo.btRigidBody(this.info_);

    Ammo.destroy(btSize);
  }
}
