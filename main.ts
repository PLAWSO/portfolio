import WebGL from "three/addons/capabilities/WebGL.js";
import { Cuboid } from "./src/shapes/Cuboid";
import { Rect } from "./src/shapes/Rect";
import { World } from "./world";
import {
  basicPhysicsInitModel,
  staticPhysicsInitModel,
} from "./src/physics/PhysicsInitModel";

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

  // CUBE 1
  box = world.createBox(
    new Rect(4, 4, 4),
    basicPhysicsInitModel,
    new Ammo.btVector3(0, 40, 0),
  );

  // GROUND
  const ground = world.createBox(
    new Rect(100, 1, 100),
    staticPhysicsInitModel,
    new Ammo.btVector3(0, -1, 0),
    0x404040,
  );
}
