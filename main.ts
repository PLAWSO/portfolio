import WebGL from "three/addons/capabilities/WebGL.js";
import { Cuboid } from "./src/shapes/Cuboid";
import { CuboidShape, CylinderShape } from "./src/shapes/ObjectShapes";
import { World } from "./world";
import {
  basicHeavyPhysicsInitModel,
  basicPhysicsInitModel,
  staticPhysicsInitModel,
} from "./src/physics/PhysicsInitModel";
import * as CANNON from "cannon-es";
import * as THREE from "three";

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
      new CANNON.Vec3(0, 1, 0),
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

  // // BASIC EXAMPLE
  // // CUBE 1
  // box = world.createBox(
  //   new Rect(4, 4, 4),
  //   basicPhysicsInitModel,
  //   new Ammo.btVector3(0, 40, 0),
  // );

  // // GROUND
  // const ground = world.createBox(
  //   new Rect(100, 1, 100),
  //   staticPhysicsInitModel,
  //   new Ammo.btVector3(0, -1, 0),
  //   0x404040,
  // );

  const redBox = world.createBox(
    new CuboidShape(2, 10, 2),
    basicPhysicsInitModel,
    new THREE.Vector3(0, 10, 0),
    0xff0000,
  );

  const blueBox = world.createBox(
    new CuboidShape(2, 10, 2),
    basicPhysicsInitModel,
    new THREE.Vector3(0, 10, 5),
    0x0000ff,
    new THREE.Vector3(0, 0, Math.PI / 2),
  );

  const ground = world.createBox(
    new CuboidShape(1000, 1, 1000),
    staticPhysicsInitModel,
    new THREE.Vector3(0, 0, 0),
    0x404040,
  );

  // character = world.createBox(
  //   new CuboidShape(5, 0.5, 2),
  //   basicPhysicsInitModel,
  // );

  // const vehicle = new CANNON.RigidVehicle({
  //   chassisBody: character.cannonObj,
  // });

  character = world.createCylinder(
    new CylinderShape(5, 5, 5, 160),
    basicHeavyPhysicsInitModel,
    new THREE.Vector3(10, 10, 0),
    0x0000ff,
    new THREE.Vector3(Math.PI / 2, 0, 0),
  );

  const buddyCube = world.createBox(
    new CuboidShape(2, 2, 2),
    basicPhysicsInitModel,
    new THREE.Vector3(10, 10, 5),
    0x00ff00,
  );

  // const group = new THREE.Group();
  // group.add(character);
  // group.add(buddyCube);

  // world.scene.add(group);

  const suspensionSpring = new CANNON.Spring(character.cannonObj, buddyCube.cannonObj, {
    restLength: 0.5,  // Distance when uncompressed
    stiffness: 50,     // How strong the spring is
    damping: 2         // Controls how much the spring resists motion
  });

  world.springs.push(suspensionSpring);

  // world.physicsWorld.addBody(suspensionSpring);

  setInterval(() => {
    console.log("CHAR: ", character.position);
  }, 1000);
}
