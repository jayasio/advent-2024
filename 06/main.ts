const contents = await Deno.readTextFile("input.txt");

type Vector = [number, number];

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

const grid = contents
  .trim()
  .split("\n")
  .map((line) => line.split(""));
// console.log(grid[0].length, grid.length);

function checkWithinBounds([x, y]: Vector) {
  return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length;
}

function getValueAt([x, y]: Vector, grid: string[][]) {
  return grid[y][x];
}

function getNextVec([x, y]: Vector, direction: Direction): Vector {
  switch (direction) {
    case Direction.Up:
      return [x, y - 1];
    case Direction.Right:
      return [x + 1, y];
    case Direction.Down:
      return [x, y + 1];
    case Direction.Left:
      return [x - 1, y];
  }
}

function getVecFromGrid(value: string, grid: string[][]): Vector {
  const y = grid.findIndex((row) => row.includes(value));
  const x = grid[y].indexOf(value);
  return [x, y];
}

const initPos: Vector = getVecFromGrid("^", grid);

function getWalkingMap(grid: string[][]): string[][] {
  let guardPos = initPos;
  let direction = 0;
  const workingGrid = grid.map((row) => [...row]);

  outer: while (checkWithinBounds(guardPos)) {
    const [x, y] = guardPos;

    workingGrid[y][x] = "X";

    let nextVec: Vector;
    do {
      nextVec = getNextVec(guardPos, direction % 4);
      if (!checkWithinBounds(nextVec)) break outer;
      direction += getValueAt(nextVec, workingGrid) === "#" ? 1 : 0;
    } while (getValueAt(nextVec, workingGrid) === "#");

    guardPos = getNextVec(guardPos, direction % 4);
  }

  return workingGrid;
}

// Part A

console.log(
  "Part A: ",
  getWalkingMap(grid)
    .flatMap((row) => row.filter((value) => value === "X"))
    .reduce((a, b) => a + b.length, 0),
);

//  Part B

// Try 3

function checkIfLoops(grid: string[][]): boolean {
  let guardPos = initPos;
  let direction = 0;
  const workingGrid: string[][] = grid.map((row) => [...row]);
  const countGrid = grid.map((row) => row.map((_) => 0));

  outer: while (checkWithinBounds(guardPos)) {
    const [x, y] = guardPos;

    if (countGrid[y][x] > 4) return true;

    countGrid[y][x]++;

    let nextVec: Vector;
    do {
      nextVec = getNextVec(guardPos, direction % 4);
      if (!checkWithinBounds(nextVec)) break outer;
      direction += getValueAt(nextVec, workingGrid) === "#" ? 1 : 0;
    } while (getValueAt(nextVec, workingGrid) === "#");

    guardPos = getNextVec(guardPos, direction % 4);
  }

  return false;
}

function getStrategicPoints(grid: string[][]) {
  const map = getWalkingMap(grid);
  const potentialPoints: Vector[] = [];

  map.forEach((row, y) => {
    row.forEach((v, x) => {
      if (v === "X") {
        potentialPoints.push([x, y]);
      }
    });
  });

  return potentialPoints.filter(([x, y]) => {
    const temp = grid.map((row) => [...row]);
    temp[y][x] = "#";
    return checkIfLoops(temp);
  });
}

function getUnique<T>(vals: T[]): T[] {
  return [...new Set(vals.map((v) => JSON.stringify(v)))].map((str) =>
    JSON.parse(str) as T
  );
}

console.log("Part B: ", getUnique(getStrategicPoints(grid)).length);

// Try 2

// function getStrategicPoints(grid: string[][]) {
//   const map = getWalkingMap(grid, true)!;
//   // console.log(map);

//   let strategicPoints: Vector[] = [];

//   map.forEach((row, y) =>
//     row.forEach((value, x) => {
//       // console.clear();
//       console.log(x, y);
//       console.log(value);

//       if (value === "#" || value === ".") return;

//       const nextVec = getNextVec([x, y], parseInt(value) % 4);
//       if (!checkWithinBounds(nextVec) || getValueAt(nextVec, grid) === "#") return;

//       let temp = grid.map((row) => [...row]);
//       temp[nextVec[1]][nextVec[0]] = "#";
//       console.log(nextVec);
//       let tempMap = getWalkingMap(temp, true);
//       console.log(tempMap ? getValueAt(nextVec, tempMap) : "null");
//       if (tempMap === null) strategicPoints.push(nextVec);
//     }),
//   );

//   return strategicPoints;
// }

// console.log("Part B: ", getUnique(getStrategicPoints(grid)).length, getUnique(getStrategicPoints(grid)));

// Try 1

// function getStrategicPoints(grid: string[][]) {
//   const workingGrid = getWalkingMap(grid, true);
//   let maps: string[][][] = [];

//   workingGrid.forEach((row, y) =>
//     row.forEach((value, x) => {
//       if (!["0", "1", "2", "3"].includes(value)) return;

//       const nextVec = getNextVec([x, y], parseInt(value) % 4);
//       if (!checkWithinBounds(nextVec)) return;
//       if (getValueAt(nextVec) === "#") return;

//       let tempGrid = grid.map((row) => [...row]);
//       tempGrid[nextVec[1]][nextVec[0]] = "#";
//       maps.push(getWalkingMap(tempGrid, true));
//     }),
//   );

//   console.log(maps);

//   return maps.filter((map) => map.toString() === [["loop"]].toString()).length;
// }

// console.log("Part B: ", getStrategicPoints(grid));

// Try 0

// const contents = await Deno.readTextFile("test-input.txt");

// const grid = contents.split("\n").map((line) => line.split(""));

// function checkWithinBounds([x, y]: [number, number]) {
//   return !(x < 0 || x > grid[0].length - 1 || y < 0 || y > grid.length - 1);
// }

// function getValueAtPos([x, y]: [number, number]) {
//   return grid[y][x];
// }

// const directions = ["Up", "Right", "Down", "Left"];

// function getNextPos(
//   directionIndex: number,
//   [x, y]: [number, number],
// ): [number, number] {
//   switch (directions[directionIndex]) {
//     case "Up":
//       return [x, y - 1];
//     case "Right":
//       return [x + 1, y];
//     case "Down":
//       return [x, y + 1];
//     case "Left":
//       return [x - 1, y];
//     default:
//       return [x, y];
//   }
// }

// function getInitGuardPos(): [number, number] {
//   let pos: [number, number];
//   grid.find((row, y) => {
//     row.find((cell, x) => {
//       if (cell === "^") {
//         pos = [x, y];
//         return true;
//       }
//     });
//   });
//   return pos!;
// }

// let directionIndex = 0;
// let guardPos = getInitGuardPos();

// while (guardPos && checkWithinBounds(guardPos)) {
//   grid[guardPos[1]][guardPos[0]] = "X";

//   if (
//     checkWithinBounds(getNextPos(directionIndex, guardPos)) &&
//     getValueAtPos(getNextPos(directionIndex, guardPos)) === "#"
//   ) {
//     directionIndex = (directionIndex + 1) % 4;
//   }

//   guardPos = getNextPos(directionIndex, guardPos);
// }

// console.log(grid.map((line) => line.join("")).join("\n"));

// // TODO: check reason for why count is 1 more than expected in test case alone
// const count = grid.map((line) => line.filter((x) => x === "X").length).reduce(
//   (a, b) => a + b,
//   0,
// );
// console.log(count);
