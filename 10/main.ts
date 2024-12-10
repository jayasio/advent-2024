import { Vector } from "./vector.ts";

const contents = await Deno.readFile("input.txt");
const input = new TextDecoder().decode(contents).trim();

const grid = input.split("\n").map((line) => line.split("").map((x) => parseInt(x)));

const zeros: Vector[] = grid
  .flatMap((line, y) => line.map((val, x) => (val === 0 ? new Vector(x, y) : null)))
  .filter((vec) => vec !== null);

function checkWithinBounds(vec: Vector) {
  return vec.x >= 0 && vec.x < grid.length && vec.y >= 0 && vec.y < grid[0].length;
}

function getValueAt(vec: Vector, grid: number[][]) {
  return grid[vec.y][vec.x];
}

function getNeighbors(vec: Vector) {
  return [
    new Vector(vec.x - 1, vec.y),
    new Vector(vec.x, vec.y - 1),
    new Vector(vec.x, vec.y + 1),
    new Vector(vec.x + 1, vec.y),
  ];
}

function getNextVecs(vec: Vector, grid: number[][]): Vector[] {
  return getNeighbors(vec).filter((v) => {
    return checkWithinBounds(v) && getValueAt(v, grid) === getValueAt(vec, grid) + 1;
  });
}

function getPeaks(vec: Vector, grid: number[][]): Vector[] {
  return getNextVecs(vec, grid).flatMap((v) => (getValueAt(v, grid) === 9 ? [v] : getPeaks(v, grid)));
}

function getUnique(vecs: Vector[]): Vector[] {
  return [...new Set(vecs.map((v) => JSON.stringify(v)))].map((str) => JSON.parse(str) as Vector);
}

// Part A

const trailScoresA = zeros.map((vec) => getUnique(getPeaks(vec, grid)));
console.log(
  "Part A: ",
  trailScoresA.reduce((a, b) => a + b.length, 0),
);

// Part B

const trailScoresB = zeros.map((vec) => getPeaks(vec, grid));
console.log(
  "Part B: ",
  trailScoresB.reduce((a, b) => a + b.length, 0),
);
