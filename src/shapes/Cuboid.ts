import * as THREE from "three";
import { Rect } from "./Rect";
import { PhysicsInitModel } from "../physics/PhysicsInitModel";

declare var Ammo: any;

export class Cuboid extends THREE.Mesh implements Rect {
  width: number;
  height: number;
  depth: number;
  mass: number;
  quat: any;

  ammoObj: any = {};

  constructor(
    size: Rect = new Rect(1, 1, 1),
    physicsInit: PhysicsInitModel | undefined,
    position: any = new Ammo.btVector3(0, 0, 0),
    color: number = 0x00ff00,
    quat: any = new Ammo.btQuaternion(0, 0, 0, 1),
  ) {
    super(
      new THREE.BoxGeometry(size.width, size.height, size.depth),
      new THREE.MeshStandardMaterial({ color: color }),
    );

    this.castShadow = true;
    this.receiveShadow = true;

    this.width = size.width;
    this.height = size.height;
    this.depth = size.depth;
    this.quat = quat;
    this.position.set(position.x(), position.y(), position.z());

    if (physicsInit) {
      this.createAmmoObject(physicsInit);
    }
  }

  createAmmoObject(physicsInit: PhysicsInitModel) {
    this.mass = physicsInit.mass;

    this.ammoObj.transform_ = new Ammo.btTransform();
    this.ammoObj.transform_.setIdentity();
    this.ammoObj.transform_.setOrigin(
      new Ammo.btVector3(this.position.x, this.position.y, this.position.z),
    );

    const quat = this.quaternion;
    this.ammoObj.transform_.setRotation(
      new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w),
    );

    this.ammoObj.motionState_ = new Ammo.btDefaultMotionState(
      this.ammoObj.transform_,
    );

    const btSize = new Ammo.btVector3(
      this.width * 0.5,
      this.height * 0.5,
      this.depth * 0.5,
    );
    this.ammoObj.shape_ = new Ammo.btBoxShape(btSize);
    this.ammoObj.shape_.setMargin(0.05);

    this.ammoObj.mass = this.mass;
    this.ammoObj.inertia_ = new Ammo.btVector3(0, 0, 0);
    if (this.ammoObj.mass > 0) {
      this.ammoObj.shape_.calculateLocalInertia(
        this.ammoObj.mass,
        this.ammoObj.inertia_,
      );
    }

    this.ammoObj.info_ = new Ammo.btRigidBodyConstructionInfo(
      this.ammoObj.mass,
      this.ammoObj.motionState_,
      this.ammoObj.shape_,
      this.ammoObj.inertia_,
    );
    this.ammoObj.body_ = new Ammo.btRigidBody(this.ammoObj.info_);

    Ammo.destroy(btSize);

    this.ammoObj.body_.setRestitution(physicsInit.restitution);
    this.ammoObj.body_.setFriction(physicsInit.friction);
    this.ammoObj.body_.setRollingFriction(physicsInit.rollingFriction);
  }

  get bottom() {
    return this.position.y - this.height / 2;
  }
}
