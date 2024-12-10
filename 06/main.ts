const contents = await Deno.readTextFile("test-input.txt");

const grid = contents.split("\n").map((line) => line.split(""));

function checkWithinBounds([x, y]: [number, number]) {
  return !(x < 0 || x > grid[0].length - 1 || y < 0 || y > grid.length - 1);
}

function getValueAtPos([x, y]: [number, number]) {
  return grid[y][x];
}

const directions = ["Up", "Right", "Down", "Left"];

function getNextPos(
  directionIndex: number,
  [x, y]: [number, number],
): [number, number] {
  switch (directions[directionIndex]) {
    case "Up":
      return [x, y - 1];
    case "Right":
      return [x + 1, y];
    case "Down":
      return [x, y + 1];
    case "Left":
      return [x - 1, y];
    default:
      return [x, y];
  }
}

function getInitGuardPos(): [number, number] {
  let pos: [number, number];
  grid.find((row, y) => {
    row.find((cell, x) => {
      if (cell === "^") {
        pos = [x, y];
        return true;
      }
    });
  });
  return pos!;
}

let directionIndex = 0;
let guardPos = getInitGuardPos();

while (guardPos && checkWithinBounds(guardPos)) {
  grid[guardPos[1]][guardPos[0]] = "X";

  if (
    checkWithinBounds(getNextPos(directionIndex, guardPos)) &&
    getValueAtPos(getNextPos(directionIndex, guardPos)) === "#"
  ) {
    directionIndex = (directionIndex + 1) % 4;
  }

  guardPos = getNextPos(directionIndex, guardPos);
}

console.log(grid.map((line) => line.join("")).join("\n"));

// TODO: check reason for why count is 1 more than expected in test case alone
const count = grid.map((line) => line.filter((x) => x === "X").length).reduce(
  (a, b) => a + b,
  0,
);
console.log(count);
