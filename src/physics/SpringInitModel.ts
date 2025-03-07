export class SpringInitModel {
  restLength: number;
  stiffness: number;
  damping: number;

  constructor(restLength: number, stiffness: number, damping: number) {
    this.restLength = restLength;
    this.stiffness = stiffness;
    this.damping = damping;
  }
}

export const basicSpringInitModel = new SpringInitModel(5, 50, 2);
export const basicLongSpringInitModel = new SpringInitModel(25, 50, 2);
