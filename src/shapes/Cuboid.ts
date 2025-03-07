import * as THREE from "three";
import { CuboidShape } from "./ObjectShapes";
import { PhysicsInitModel } from "../physics/PhysicsInitModel";
import * as CANNON from "cannon-es";

export class Cuboid extends THREE.Mesh {
  cannonObj: any = null;

  constructor(
    size: CuboidShape = new CuboidShape(1, 1, 1),
    physicsInit: PhysicsInitModel | undefined,
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    color: number = 0x00ff00,
    rotation: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
  ) {
    super(
      new THREE.BoxGeometry(size.width, size.height, size.depth),
      new THREE.MeshStandardMaterial({ color: color }),
    );

    this.castShadow = true;
    this.receiveShadow = true;
    this.position.copy(position);
    // TODO: figure out how to apply rotation directly to mesh

    if (physicsInit) {
      this.createCannonObject(physicsInit, size, rotation);
    }
  }

  createCannonObject(
    physicsInit: PhysicsInitModel,
    size: CuboidShape,
    rotation: THREE.Vector3,
  ) {
    this.cannonObj = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(size.width / 2, size.height / 2, size.depth / 2),
      ),
      mass: physicsInit.mass,
      position: new CANNON.Vec3(
        this.position.x,
        this.position.y,
        this.position.z,
      ),
      type: physicsInit.mass == 0 ? CANNON.Body.STATIC : CANNON.Body.DYNAMIC,
    });

    this.cannonObj.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);
  }
}
