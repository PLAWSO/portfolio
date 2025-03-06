import * as THREE from "three";
import { CylinderShape } from "./ObjectShapes";
import { PhysicsInitModel } from "../physics/PhysicsInitModel";
import * as CANNON from "cannon-es";

export class Cylinder extends THREE.Mesh {
  cannonObj: any = null;

  constructor(
    size: CylinderShape = new CylinderShape(1, 1, 1, 16),
    physicsInit: PhysicsInitModel | undefined,
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    color: number = 0x00ff00,
    rotation: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
  ) {
    super(
      new THREE.CylinderGeometry(
        size.radiusTop,
        size.radiusBottom,
        size.height,
        size.radialSegments,
        32,
      ),
      new THREE.MeshStandardMaterial({ color: color }),
    );

    // setup mesh
    this.castShadow = true;
    this.receiveShadow = true;
    this.position.copy(position);

    // setup rigidbody
    if (physicsInit) {
      this.createCannonObject(physicsInit, size, rotation);
    }
  }

  createCannonObject(
    physicsInit: PhysicsInitModel,
    size: CylinderShape,
    rotation: THREE.Vector3,
  ) {
    this.cannonObj = new CANNON.Body({
      shape: new CANNON.Cylinder(
        size.radiusTop,
        size.radiusBottom,
        size.height,
        size.radialSegments,
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
