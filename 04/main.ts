const content = await Deno.readFile("input.txt");
const input = new TextDecoder().decode(content).trim();
const lines = input.split("\n");

const grid = lines.map((line) => line.split(""));
const yMax = grid.length - 1;
const xMax = grid[0].length - 1;

// Part A

const directions: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, -1],
  [1, 1],
  [-1, 1],
];

function checkInDirection(x: number, y: number, deltaX: number, deltaY: number) {
  const lastX = x + deltaX * 3;
  const lastY = y + deltaY * 3;
  if (lastX > xMax || lastX < 0) return false;
  if (lastY > yMax || lastY < 0) return false;

  const word = "XMAS";
  let currX = x;
  let currY = y;
  for (let i = 0; i < word.length; i++) {
    if (grid[currY][currX] !== word[i]) return false;
    currX += deltaX;
    currY += deltaY;
  }
  return true;
}

function countWordsFormed(x: number, y: number) {
  let internalCount = 0;

  for (let i = 0; i < directions.length; i++) {
    let [deltaX, deltaY] = directions[i];
    if (checkInDirection(x, y, deltaX, deltaY)) internalCount++;
  }
  return internalCount;
}

let countA = 0;

grid.forEach((line, y) => {
  line.forEach((char, x) => {
    if (char === "X") {
      countA += countWordsFormed(x, y);
    }
  });
});

console.log("Part A: ", countA);

// Part B

function checkAisCross(x: number, y: number) {
  if (grid[y][x] !== "A" || x < 1 || x > xMax - 1 || y < 1 || y > yMax - 1) return false;

  const diagonals = [grid[y - 1][x - 1], grid[y - 1][x + 1], grid[y + 1][x - 1], grid[y + 1][x + 1]];

  if (!diagonals.every((char) => ["S", "M"].includes(char))) return false;

  if (diagonals[0] === diagonals[3] || diagonals[1] === diagonals[2]) return false;

  return true;
}

let countB = 0;

grid.forEach((line, y) => {
  line.forEach((char, x) => {
    if (char === "A" && checkAisCross(x, y)) countB++;
  });
});

console.log("Part B: ", countB);
