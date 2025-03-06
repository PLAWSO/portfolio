export class CuboidShape {
  width: number;
  height: number;
  depth: number;

  constructor(width: number, height: number, depth: number) {
    this.width = width;
    this.height = height;
    this.depth = depth;
  }
}

export class CylinderShape {
  radiusTop: number;
  radiusBottom: number;
  height: number;
  radialSegments: number;

  constructor(
    radiusTop: number,
    radiusBottom: number,
    height: number,
    radialSegments: number,
  ) {
    this.radiusTop = radiusTop;
    this.radiusBottom = radiusBottom;
    this.height = height;
    this.radialSegments = radialSegments;
  }
}
