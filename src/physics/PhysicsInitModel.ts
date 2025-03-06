export class PhysicsInitModel {
  restitution: number;
  friction: number;
  rollingFriction: number;
  mass: number;

  constructor(
    restitution: number,
    friction: number,
    rollingFriction: number,
    mass: number,
  ) {
    this.restitution = restitution;
    this.friction = friction;
    this.rollingFriction = rollingFriction;
    this.mass = mass;
  }
}

export const staticPhysicsInitModel = new PhysicsInitModel(0, 1, 0, 0); // used for static physics objects ie. ground
export const basicPhysicsInitModel = new PhysicsInitModel(0.25, 3, 1, 1); // used for basic physics objects ie. cubes
