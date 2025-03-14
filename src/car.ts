import { World } from "../world";
import {
  basicPhysicsInitModel,
  carPhysicsInitModel,
  staticPhysicsInitModel,
} from "./physics/PhysicsInitModel";
import { CuboidShape } from "./shapes/ObjectShapes";
import * as THREE from "three";
import { WheelAssembly } from "./wheelAssembly";
import { Cuboid } from "./shapes/Cuboid";

const spawnHeight = 100;

export class Car {
  dimensions: CuboidShape;
  body: Cuboid;
  wheelAssemblies: any[];
  cannonObj: any;
  world: World;
  dfWheelAssembly: WheelAssembly;
  drWheelAssembly: WheelAssembly;
  pfWheelAssembly: WheelAssembly;
  prWheelAssembly: WheelAssembly;

  constructor(world: World, dimensions: CuboidShape) {
    this.dimensions = dimensions;
    this.world = world;

    this.body = this.world.createBox(
      this.dimensions,
      carPhysicsInitModel,
      new THREE.Vector3(0, spawnHeight, 0),
      0x0000ff,
    );

    this.cannonObj = this.body.cannonObj;

    this.drWheelAssembly = new WheelAssembly(
      this.world,
      this,
      new THREE.Vector3(
        this.dimensions.width * 0.4,
        -this.dimensions.height * 0.1,
        this.dimensions.depth * 0.4,
      ),
      new THREE.Vector3(
        this.dimensions.width * 0.4,
        -this.dimensions.height * 0.4,
        this.dimensions.depth * 0.4,
      ),
      new THREE.Vector3(
        this.dimensions.width * 0.4,
        this.dimensions.height * 0.3,
        0,
      ),
      spawnHeight,
    );

    this.dfWheelAssembly = new WheelAssembly(
      this.world,
      this,
      new THREE.Vector3(
        -this.dimensions.width * 0.4,
        -this.dimensions.height * 0.1,
        this.dimensions.depth * 0.4,
      ),
      new THREE.Vector3(
        -this.dimensions.width * 0.4,
        -this.dimensions.height * 0.4,
        this.dimensions.depth * 0.4,
      ),
      new THREE.Vector3(
        -this.dimensions.width * 0.4,
        this.dimensions.height * 0.3,
        0,
      ),
      spawnHeight,
    );

    this.prWheelAssembly = new WheelAssembly(
      this.world,
      this,
      new THREE.Vector3(
        this.dimensions.width * 0.4,
        -this.dimensions.height * 0.1,
        -this.dimensions.depth * 0.4,
      ),
      new THREE.Vector3(
        this.dimensions.width * 0.4,
        -this.dimensions.height * 0.4,
        -this.dimensions.depth * 0.4,
      ),
      new THREE.Vector3(
        this.dimensions.width * 0.4,
        this.dimensions.height * 0.3,
        0,
      ),
      spawnHeight,
    );

    this.pfWheelAssembly = new WheelAssembly(
      this.world,
      this,
      new THREE.Vector3(
        -this.dimensions.width * 0.4,
        -this.dimensions.height * 0.1,
        -this.dimensions.depth * 0.4,
      ),
      new THREE.Vector3(
        -this.dimensions.width * 0.4,
        -this.dimensions.height * 0.4,
        -this.dimensions.depth * 0.4,
      ),
      new THREE.Vector3(
        -this.dimensions.width * 0.4,
        this.dimensions.height * 0.3,
        0,
      ),
      spawnHeight,
    );
  }
}
