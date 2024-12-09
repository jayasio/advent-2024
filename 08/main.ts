import Position from "./position.ts";

const contents = await Deno.readTextFile("input.txt");

const antennaGrid = contents
  .trim()
  .split("\n")
  .map((line) => line.split(""));

const yMax = antennaGrid.length - 1;
const xMax = antennaGrid[0].length - 1;

function checkWithinBounds(position: Position) {
  return position.x >= 0 && position.x <= xMax && position.y >= 0 && position.y <= yMax;
}

const uniqueSignals = [...new Set<string>(antennaGrid.flat())].filter((a) => a !== ".");
const uniqueSignalsData = uniqueSignals.map((signal) => {
  const positions: Position[] = [];

  antennaGrid.forEach((line, y) => {
    line.forEach((antenna, x) => {
      if (antenna === signal) {
        positions.push(new Position(x, y));
      }
    });
  });

  return { signal, positions };
});

// Part A

const antinodeGrid = Array(antennaGrid.length)
  .fill(null)
  .map(() => Array(antennaGrid[0].length));

uniqueSignalsData.forEach(({ positions }) => {
  for (let i = 0; i < positions.length; i++) {
    for (let j = 0; j < positions.length; j++) {
      if (i === j) break;

      const diff = positions[i].subtract(positions[j]);

      const a = positions[i].add(diff);
      const b = positions[j].subtract(diff);

      if (checkWithinBounds(a)) {
        antinodeGrid[a.y][a.x] = "#";
      }

      if (checkWithinBounds(b)) {
        antinodeGrid[b.y][b.x] = "#";
      }
    }
  }
});

console.log("Part A: ", antinodeGrid.flat().filter((a) => a === "#").length);

// Part B

const resonantAntinodeGrid = Array(antennaGrid.length)
  .fill(null)
  .map(() => Array(antennaGrid[0].length));

uniqueSignalsData.forEach(({ positions }) => {
  for (let i = 0; i < positions.length; i++) {
    for (let j = 0; j < positions.length; j++) {
      const diff = positions[i].subtract(positions[j]);

      let a = positions[i].add(diff);
      let b = positions[j].subtract(diff);

      if (i === j) {
        if (checkWithinBounds(a)) {
          resonantAntinodeGrid[a.y][a.x] = "#";
        }

        if (checkWithinBounds(b)) {
          resonantAntinodeGrid[b.y][b.x] = "#";
        }
      } else {
        while (checkWithinBounds(a)) {
          resonantAntinodeGrid[a.y][a.x] = "#";
          a = a.add(diff);
        }

        while (checkWithinBounds(b)) {
          resonantAntinodeGrid[b.y][b.x] = "#";
          b = b.subtract(diff);
        }
      }
    }
  }
});

console.log("Part B: ", resonantAntinodeGrid.flat().filter((a) => a === "#").length);
