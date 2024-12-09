export default class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(other: Position) {
    return new Position(this.x + other.x, this.y + other.y);
  }

  subtract(other: Position) {
    return new Position(this.x - other.x, this.y - other.y);
  }
}
