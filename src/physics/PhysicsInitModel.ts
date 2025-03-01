
export class PhysicsInitModel {
  restitution: number;
  friction: number;
  rollingFriction: number;
  mass: number;

  constructor(restitution: number, friction: number, rollingFriction: number, mass: number) {
    this.restitution = restitution;
    this.friction = 10;
    this.rollingFriction = 5;
    this.mass = 0;
  }
}

export const staticPhysicsInitModel = new PhysicsInitModel(0, 0, 0, 0); // used for static physics objects ie. ground
export const basicPhysicsInitModel = new PhysicsInitModel(0.25, 10, 5, 1); // used for basic physics objects ie. cubes