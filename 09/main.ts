const contents = await Deno.readTextFile("input.txt");

const line = contents.trim();

const chunkyDisk: string[][] = line
  .split("")
  .map((x, i) =>
    Array(parseInt(x)).fill(i % 2 === 0 ? Math.floor(i / 2) : ".")
  );

function getChecksum(disk: string[]): number {
  return disk.reduce(
    (a, b, i) => a + (isNaN(parseInt(b)) ? 0 : parseInt(b)) * i,
    0,
  );
}

// Part A

function defragmentA(disk: string[]): string[] {
  const defragmentingDisk: string[] = [...disk];

  let emptyIndex = defragmentingDisk.indexOf(".");
  let lastIndex = defragmentingDisk.length - 1;

  while (emptyIndex !== -1 && lastIndex !== 0 && emptyIndex <= lastIndex) {
    while (defragmentingDisk[lastIndex] === ".") {
      lastIndex--;
    }

    defragmentingDisk[emptyIndex] = defragmentingDisk[lastIndex];
    defragmentingDisk[lastIndex] = ".";

    emptyIndex = defragmentingDisk.indexOf(".");
    lastIndex--;
  }

  return defragmentingDisk;
}

const checksumA = getChecksum(defragmentA(chunkyDisk.flat()));
console.log("Part A: ", checksumA);

// Part B

function defragmentB(disk: string[][]): string[] {
  let defragmentingDisk: string[][] = disk;

  let cursor = defragmentingDisk.length - 1;

  while (cursor >= 0) {
    if (defragmentingDisk[cursor].includes(".")) {
      cursor--;
      continue;
    }

    const emptyIndex = defragmentingDisk.findIndex(
      (x, i) =>
        i < cursor && x.includes(".") &&
        x.length >= defragmentingDisk[cursor].length,
    );

    if (emptyIndex === -1) {
      cursor--;
      continue;
    }

    const diff = defragmentingDisk[emptyIndex].length -
      defragmentingDisk[cursor].length;

    defragmentingDisk[emptyIndex] = [...defragmentingDisk[cursor]];
    defragmentingDisk[cursor] = Array(defragmentingDisk[cursor].length).fill(
      ".",
    );

    if (diff !== 0) {
      defragmentingDisk = [
        ...defragmentingDisk.slice(0, emptyIndex + 1),
        Array(diff).fill("."),
        ...defragmentingDisk.slice(emptyIndex + 1),
      ];
      cursor++;
    }

    cursor--;

    // console.log(defragmentingDisk.flat().join(""));
  }

  return defragmentingDisk.flat();
}

const checksumB = getChecksum(defragmentB(chunkyDisk));
console.log("Part B: ", checksumB);

// // IGNORE
// function defragmentB(chunkyDisk: string[][]): string[] {
//   let defragmentingDisk: string[][] = [...chunkyDisk.filter((x) => x.length > 0)];

//   let cursor = defragmentingDisk.length - 1;

//   while (cursor >= 0) {
//     const emptyIndex: number = defragmentingDisk.findIndex(
//       (x) => x.includes(".") && x.length >= defragmentingDisk[cursor].length,
//     );

//     if (emptyIndex !== -1 && emptyIndex < cursor) {
//       const diff = defragmentingDisk[emptyIndex].length - defragmentingDisk[cursor].length;

//       const temp = [...defragmentingDisk[emptyIndex]];
//       defragmentingDisk[emptyIndex] = [...defragmentingDisk[cursor]];
//       defragmentingDisk[cursor] = [...temp];

//       if (diff !== 0) {
//         defragmentingDisk = [
//           ...defragmentingDisk.slice(0, cursor),
//           Array(diff).fill("."),
//           ...defragmentingDisk.slice(cursor),
//         ];
//         cursor++;
//       }
//     }

//     do {
//       cursor--;
//     } while (cursor >= 0 && defragmentingDisk[cursor].includes("."));

//     console.log(defragmentingDisk, cursor);
//   }

//   return defragmentingDisk.flat();
// }
