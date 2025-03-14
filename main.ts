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
import { Car } from "./src/car";

let car: any;

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
    // car.cannonObj.applyImpulse(
    //   new CANNON.Vec3(-5, 0, 0),
    //   new CANNON.Vec3(0, 0, 0),
    // );
    car.drWheelAssembly.wheel.cannonObj.applyImpulse(
      new CANNON.Vec3(-100, 0, 0),
      new CANNON.Vec3(0, 2, 0),
    );
    car.prWheelAssembly.wheel.cannonObj.applyImpulse(
      new CANNON.Vec3(-100, 0, 0),
      new CANNON.Vec3(0, 2, 0),
    );
  }
  if (pressedKeys["s"]) {
    // car.cannonObj.applyImpulse(
    //   new CANNON.Vec3(5, 0, 0),
    //   new CANNON.Vec3(0, 0, 0),
    // );
    car.drWheelAssembly.wheel.cannonObj.applyImpulse(
      new CANNON.Vec3(100, 0, 0),
      new CANNON.Vec3(0, 2, 0),
    );
    car.prWheelAssembly.wheel.cannonObj.applyImpulse(
      new CANNON.Vec3(100, 0, 0),
      new CANNON.Vec3(0, 2, 0),
    );
  }
  if (pressedKeys["a"]) {
    car.cannonObj.applyImpulse(
      new CANNON.Vec3(0, 0, 5),
      new CANNON.Vec3(0, 0, 0),
    );
  }
  if (pressedKeys["d"]) {
    car.cannonObj.applyImpulse(
      new CANNON.Vec3(0, 0, -5),
      new CANNON.Vec3(0, 0, 0),
    );
  }
  if (pressedKeys[" "]) {
    car.cannonObj.applyImpulse(
      new CANNON.Vec3(0, 5, 0),
      new CANNON.Vec3(0, 0, 0),
    );
  }
  if (pressedKeys["r"]) {
    car.cannonObj.position = new CANNON.Vec3(0, 10, 5);
    car.cannonObj.velocity = new CANNON.Vec3(0, 0, 0);
    car.cannonObj.angularVelocity = new CANNON.Vec3(0, 0, 0);
    car.cannonObj.quaternion = new CANNON.Quaternion(0, 0, 0, 1);
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
  
  // makes physics do gooderer
  world.physicsWorld.solver.iterations = 200;

  const ground = world.createBox(
    new CuboidShape(1000, 1, 1000),
    staticPhysicsInitModel,
    new THREE.Vector3(0, 0, 0),
    0x404040,
  );


  car = new Car(world, new CuboidShape(20, 10, 10));
  // car = car.drWheelAssembly.wheel;
}
