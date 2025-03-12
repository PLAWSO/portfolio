import WebGL from "three/addons/capabilities/WebGL.js";
import { CuboidShape, CylinderShape } from "./src/shapes/ObjectShapes";
import { World } from "./world";
import {
  basicHeavyPhysicsInitModel,
  basicPhysicsInitModel,
  staticPhysicsInitModel,
} from "./src/physics/PhysicsInitModel";
import * as CANNON from "cannon-es";
import * as THREE from "three";
import { basicLongSpringInitModel, basicLongStrongSpringInitModel } from "./src/physics/SpringInitModel";

let character: any;

// keyboard input
var pressedKeys = {};
window.onkeyup = function (e) {
  pressedKeys[e.key] = false;
};
window.onkeydown = function (e) {
  pressedKeys[e.key] = true;
};

// basic movement
setInterval(() => {
  if (pressedKeys["w"]) {
    character.cannonObj.applyImpulse(
      new CANNON.Vec3(-1, 0, 0),
      new CANNON.Vec3(0, 0, 0),
    );
  }
  if (pressedKeys["s"]) {
    character.cannonObj.applyImpulse(
      new CANNON.Vec3(1, 0, 0),
      new CANNON.Vec3(0, 0, 0),
    );
  }
  if (pressedKeys["a"]) {
    character.cannonObj.applyImpulse(
      new CANNON.Vec3(0, 0, 1),
      new CANNON.Vec3(0, 0, 0),
    );
  }
  if (pressedKeys["d"]) {
    character.cannonObj.applyImpulse(
      new CANNON.Vec3(0, 0, -1),
      new CANNON.Vec3(0, 0, 0),
    );
  }
  if (pressedKeys[" "]) {
    character.cannonObj.applyImpulse(
      new CANNON.Vec3(0, 5, 0),
      new CANNON.Vec3(0, 0, 0),
    );
  }
  if (pressedKeys["r"]) {
    character.cannonObj.position = new CANNON.Vec3(0, 10, 5);
    character.cannonObj.velocity = new CANNON.Vec3(0, 0, 0);
    character.cannonObj.angularVelocity = new CANNON.Vec3(0, 0, 0);
    character.cannonObj.quaternion = new CANNON.Quaternion(0, 0, 0, 1);
  }
}, 1.0 / 60.0);

window.addEventListener("DOMContentLoaded", async () => {
  if (WebGL.isWebGL2Available()) {
    startScene();
  } else {
    const warning = WebGL.getWebGL2ErrorMessage();
    document.getElementById("container")?.appendChild(warning);
  }
});

function startScene() {
  const world = new World();

  // const redBox = world.createBox(
  //   new CuboidShape(2, 10, 2),
  //   basicPhysicsInitModel,
  //   new THREE.Vector3(0, 10, 0),
  //   0xff0000,
  // );

  // const blueBox = world.createBox(
  //   new CuboidShape(2, 10, 2),
  //   basicPhysicsInitModel,
  //   new THREE.Vector3(0, 10, 5),
  //   0x0000ff,
  //   new THREE.Vector3(0, 0, Math.PI / 2),
  // );

  const ground = world.createBox(
    new CuboidShape(1000, 1, 1000),
    staticPhysicsInitModel,
    new THREE.Vector3(0, 0, 0),
    0x404040,
  );

  // character = world.createCylinder(
  //   new CylinderShape(5, 5, 5, 160),
  //   basicHeavyPhysicsInitModel,
  //   new THREE.Vector3(10, 10, 0),
  //   0x0000ff,
  //   new THREE.Vector3(Math.PI / 2, 0, 0),
  // );

  // const buddyCube = world.createBox(
  //   new CuboidShape(2, 2, 2),
  //   basicPhysicsInitModel,
  //   new THREE.Vector3(10, 10, 5),
  //   0x00ff00,
  // );

  // const spring = world.createSpring(
  //   character.cannonObj,
  //   buddyCube.cannonObj,
  //   basicLongSpringInitModel,
  // );

  // const brick = world.createBox(
  //   new CuboidShape(10, 6, 6),
  //   staticPhysicsInitModel,
  //   new THREE.Vector3(0, 10, 0),
  //   0x0000ff,
  // );

  // const dfWheel = world.createCylinder(
  //   new CylinderShape(2, 2, 2, 8),
  //   basicPhysicsInitModel,
  //   new THREE.Vector3(-4, 8, 5),
  //   0x0000ff,
  //   new THREE.Vector3(Math.PI / 2, 0, 0),
  // );

  // character = world.createCylinder(
  //   new CylinderShape(2, 2, 2, 8),
  //   basicPhysicsInitModel,
  //   new THREE.Vector3(4, 8, 5),
  //   0x0000ff,
  //   new THREE.Vector3(Math.PI / 2, 0, 0),
  // );

  // const pfWheel = world.createCylinder(
  //   new CylinderShape(2, 2, 2, 8),
  //   basicPhysicsInitModel,
  //   new THREE.Vector3(-4, 8, -5),
  //   0x0000ff,
  //   new THREE.Vector3(Math.PI / 2, 0, 0),
  // );

  // const prWheel = world.createCylinder(
  //   new CylinderShape(2, 2, 2, 8),
  //   basicPhysicsInitModel,
  //   new THREE.Vector3(4, 8, -5),
  //   0x0000ff,
  //   new THREE.Vector3(Math.PI / 2, 0, 0),
  // );

  // const lock = new CANNON.LockConstraint(
  //   character.cannonObj,
  //   dfWheel.cannonObj,
  // );

  // world.physicsWorld.addConstraint(lock);


  // const localPivotA = new CANNON.Vec3(10, 0, 0);
  // const localPivotB = new CANNON.Vec3(0, 0, 0);
  // const ptp = new CANNON.PointToPointConstraint(character.cannonObj, localPivotA, drWheel.cannonObj, localPivotB);
  // world.physicsWorld.addConstraint(ptp);

  // kinda working example
  // const hinge = new CANNON.HingeConstraint(
  //   brick.cannonObj,
  //   character.cannonObj,
  //   {
  //     pivotA: new CANNON.Vec3(4, -1, -4),
  //     axisA: new CANNON.Vec3(1, 0, 0),
  //     pivotB: new CANNON.Vec3(10, 0, 0),
  //     axisB: new CANNON.Vec3(0, 1, 0),
  //     collideConnected: false,
  //   }
  // )

  character = world.createBox(
    new CuboidShape(5, 10, 5),
    basicPhysicsInitModel,
    new THREE.Vector3(20, 20, 20),
    0x0000ff,
  )

  const body = world.createBox(
    new CuboidShape(50, 30, 30),
    basicHeavyPhysicsInitModel,
    new THREE.Vector3(0, 20, 0),
    0x0000ff,
  );

  // const hinge = new CANNON.HingeConstraint(
  //   brick.cannonObj,
  //   character.cannonObj,
  //   {
  //     pivotA: new CANNON.Vec3(4, -1, -4),
  //     axisA: new CANNON.Vec3(1, 0, 0),
  //     pivotB: new CANNON.Vec3(10, 0, 0),
  //     axisB: new CANNON.Vec3(0, 1, 0),
  //     collideConnected: false,
  //   }
  // )

  // world.physicsWorld.addConstraint(hinge);

  const topHubTrackingPoint = world.createTrackingPoint(
    character,
    new THREE.Vector3(0, 5, 0),
    0xff0000,
  );

  // const topFrontHubTrackingPoint = world.createTrackingPoint(
  //   character,
  //   new THREE.Vector3(-0.5, 0.5, 0),
  //   0xff0000,
  // );

  // const bottomHubTrackingPoint = world.createTrackingPoint(
  //   character,
  //   new THREE.Vector3(0, -5, 0),
  //   0xff0000,
  // );

  // const topBodyTrackingPoint = world.createTrackingPoint(
  //   body,
  //   new THREE.Vector3(20, 0, 12),
  //   0xff0000,
  // );

  const upperControlArm = world.createBox(
    new CuboidShape(1, 10, 1),
    basicPhysicsInitModel,
    new THREE.Vector3(20, 50, 12),
    0x0000ff,
  );

  const lowerControlArm = world.createBox(
    new CuboidShape(1, 10, 1),
    basicPhysicsInitModel,
    new THREE.Vector3(20, 50, 10),
    0x0000ff,
  );

  // const ucaTopTrackingPoint = world.createTrackingPoint(
  //   upperControlArm,
  //   new THREE.Vector3(0, 5, 0),
  //   0xff0000,
  // );

  

  // const bottomFrontHubTrackingPoint = world.createTrackingPoint(
  //   character,
  //   new THREE.Vector3(-0.5, -0.5, 0),
  //   0xff0000,
  // );

  const hingeUCAtoHub = new CANNON.HingeConstraint(
    upperControlArm.cannonObj,
    character.cannonObj,
    {
      pivotA: new CANNON.Vec3(0, 5, 0),
      axisA: new CANNON.Vec3(1, 0, 0),
      pivotB: new CANNON.Vec3(0, 5, 0),
      axisB: new CANNON.Vec3(1, 0, 0),
      collideConnected: false,
    }
  )

  const hingeUCAtoBody = new CANNON.HingeConstraint(
    upperControlArm.cannonObj,
    body.cannonObj,
    {
      pivotA: new CANNON.Vec3(0, -5, 0),
      axisA: new CANNON.Vec3(1, 0, 0),
      pivotB: new CANNON.Vec3(20, 0, 12),
      axisB: new CANNON.Vec3(1, 0, 0),
      collideConnected: false,
    }
  )

  const hingeLCAtoHub = new CANNON.HingeConstraint(
    lowerControlArm.cannonObj,
    character.cannonObj,
    {
      pivotA: new CANNON.Vec3(0, 5, 0),
      axisA: new CANNON.Vec3(1, 0, 0),
      pivotB: new CANNON.Vec3(0, -5, 0),
      axisB: new CANNON.Vec3(1, 0, 0),
      collideConnected: false,
      maxForce: Number.MAX_SAFE_INTEGER,
    }
  )

  const hingeLCAtoBody = new CANNON.HingeConstraint(
    lowerControlArm.cannonObj,
    body.cannonObj,
    {
      pivotA: new CANNON.Vec3(0, -5, 0),
      axisA: new CANNON.Vec3(1, 0, 0),
      pivotB: new CANNON.Vec3(20, -10, 12),
      axisB: new CANNON.Vec3(1, 0, 0),
      collideConnected: false,
      maxForce: Number.MAX_SAFE_INTEGER,
    }
  )

  world.physicsWorld.addConstraint(hingeUCAtoHub);
  world.physicsWorld.addConstraint(hingeUCAtoBody);
  world.physicsWorld.addConstraint(hingeLCAtoHub);
  world.physicsWorld.addConstraint(hingeLCAtoBody);

  const spring = world.createSpring(
    character.cannonObj,
    body.cannonObj,
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(20, 20, 0),
    basicLongStrongSpringInitModel,
  );

  // const topFrontTrackingPoint = world.createTrackingPoint(
  //   hub,
  //   new THREE.Vector3(0, 0, 3),
  //   0xff0000,
  // );






  // setInterval(() => {
  //   console.log("CHAR: ", character.position);
  // }, 1000);
}
