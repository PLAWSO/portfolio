import * as THREE from "three";
import { World } from "../world";
import { Cuboid } from "./shapes/Cuboid";
import { Cylinder } from "./shapes/Cylinder";
import { CuboidShape, CylinderShape } from "./shapes/ObjectShapes";
import { HingeConstraint } from "cannon-es";
import { Car } from "./car";
import * as CANNON from "cannon-es";
import { basicLongStrongSpringInitModel } from "./physics/SpringInitModel";
import {
  basicPhysicsInitModel,
  staticPhysicsInitModel,
} from "./physics/PhysicsInitModel";

const hubDimensions = new CuboidShape(2, 3, 1);
const controlArmDimensions = new CuboidShape(2, 5, 2);

export class WheelAssembly {
  hub: Cuboid;
  upperControlArm: Cuboid;
  ucaToHubHinge: HingeConstraint;
  ucaToChassisHinge: HingeConstraint;
  lowerControlArm: Cuboid;
  lcaToHubHinge: HingeConstraint;
  lcaToChassisHinge: HingeConstraint;
  wheelToHubHinge: HingeConstraint;
  spring: CANNON.Spring;
  wheel: Cylinder;

  world: any;

  constructor(
    world: World,
    chassis: Car,
    ucaMountPoint: THREE.Vector3,
    lcaMountPoint: THREE.Vector3,
    springMountPoint: THREE.Vector3,
    spawnHeight: number,
  ) {
    this.world = world;

    const spawnPoint = new THREE.Vector3().copy(ucaMountPoint);
    spawnPoint.add(new THREE.Vector3(0, spawnHeight, ucaMountPoint.z));

    this.hub = this.world.createBox(
      hubDimensions,
      basicPhysicsInitModel,
      spawnPoint,
      0x0000ff,
    );

    this.upperControlArm = this.world.createBox(
      controlArmDimensions,
      basicPhysicsInitModel,
      spawnPoint.add(new THREE.Vector3(0, 5, 0)),
      0x0000ff,
    );

    this.ucaToHubHinge = new CANNON.HingeConstraint(
      this.upperControlArm.cannonObj,
      this.hub.cannonObj,
      {
        pivotA: new CANNON.Vec3(0, controlArmDimensions.height / 2, 0),
        axisA: new CANNON.Vec3(1, 0, 0),
        pivotB: new CANNON.Vec3(0, hubDimensions.height / 2, 0),
        axisB: new CANNON.Vec3(1, 0, 0),
        collideConnected: false,
      },
    );
    this.world.physicsWorld.addConstraint(this.ucaToHubHinge);

    this.ucaToChassisHinge = new CANNON.HingeConstraint(
      this.upperControlArm.cannonObj,
      chassis.body.cannonObj,
      {
        pivotA: new CANNON.Vec3(0, -controlArmDimensions.height / 2, 0),
        axisA: new CANNON.Vec3(1, 0, 0),
        pivotB: new CANNON.Vec3(
          ucaMountPoint.x,
          ucaMountPoint.y,
          ucaMountPoint.z,
        ),
        axisB: new CANNON.Vec3(1, 0, 0),
        collideConnected: false,
      },
    );
    this.world.physicsWorld.addConstraint(this.ucaToChassisHinge);

    this.lowerControlArm = this.world.createBox(
      controlArmDimensions,
      basicPhysicsInitModel,
      spawnPoint.add(new THREE.Vector3(0, -10, 0)),
      0x0000ff,
    );

    this.lcaToHubHinge = new CANNON.HingeConstraint(
      this.lowerControlArm.cannonObj,
      this.hub.cannonObj,
      {
        pivotA: new CANNON.Vec3(0, controlArmDimensions.height / 2, 0),
        axisA: new CANNON.Vec3(1, 0, 0),
        pivotB: new CANNON.Vec3(0, -hubDimensions.height / 2, 0),
        axisB: new CANNON.Vec3(1, 0, 0),
        collideConnected: false,
      },
    );
    this.world.physicsWorld.addConstraint(this.lcaToHubHinge);

    this.lcaToChassisHinge = new CANNON.HingeConstraint(
      this.lowerControlArm.cannonObj,
      chassis.body.cannonObj,
      {
        pivotA: new CANNON.Vec3(0, -controlArmDimensions.height / 2, 0),
        axisA: new CANNON.Vec3(1, 0, 0),
        pivotB: new CANNON.Vec3(
          lcaMountPoint.x,
          lcaMountPoint.y,
          lcaMountPoint.z,
        ),
        axisB: new CANNON.Vec3(1, 0, 0),
        collideConnected: false,
      }
    )
    this.world.physicsWorld.addConstraint(this.lcaToChassisHinge);

    this.spring = this.world.createSpring(
      chassis.body.cannonObj,
      this.hub.cannonObj,
      springMountPoint,
      new THREE.Vector3(0, -1, 0),
      basicLongStrongSpringInitModel,
    )

    this.wheel = this.world.createCylinder(
      new CylinderShape(4, 4, 3, 16),
      basicPhysicsInitModel,
      spawnPoint.add(new THREE.Vector3(0, 5, ucaMountPoint.z / 1.5)),
      0x0000ff,
      new THREE.Vector3(Math.PI / 2, 0, 0),
    )

    this.wheelToHubHinge = new CANNON.HingeConstraint(
      this.wheel.cannonObj,
      this.hub.cannonObj,
      {
        // replace this           -v 2 with some wheel based parameter
        pivotA: new CANNON.Vec3(0, 3 * (ucaMountPoint.z > 0 ? -1 : 1), 0),
        axisA: new CANNON.Vec3(0, 1, 0),
        pivotB: new CANNON.Vec3(0, 0, 0),
        axisB: new CANNON.Vec3(0, 0, 1),
        collideConnected: false,
      }
    )
    this.world.physicsWorld.addConstraint(this.wheelToHubHinge);


  }
}
