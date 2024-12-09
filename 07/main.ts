const contents = await Deno.readTextFile("input.txt");
const lines = contents.trim().split("\n");

type Line = {
  value: number;
  operands: number[];
};

function parseLine(line: string): Line {
  const [value, other] = line.split(":");
  const operands = other.trim().split(" ");

  return {
    value: parseInt(value),
    operands: operands.map((operand) => parseInt(operand)),
  } as Line;
}

// Generate binary numbers from 0 to base^(length - 1) and map 1 and 0 to addition and subtraction, 2 to concatenation
// Felt like an easy way to generate all possible operations
function generateOperations(length: number, base: number = 2): string[][] {
  return Array(Math.pow(base, length - 1))
    .fill("0")
    .map((_, i) =>
      i
        .toString(base)
        .padStart(length - 1, "0")
        .split(""),
    );
}

function operate(operands: number[], operationSet: string[]): number {
  if (operands.length === 1) return operands[0];

  return operationSet.reduce((result, operation, index) => {
    switch (operation) {
      case "0":
        return result + operands[index + 1];
      case "1":
        return result * operands[index + 1];
      default:
        return parseInt(`${result}${operands[index + 1]}`);
    }
  }, operands[0]);
}

function checkAllOperations(line: Line, base: number = 2): boolean {
  return generateOperations(line.operands.length, base).some(
    (operationSet) => operate(line.operands, operationSet) === line.value,
  );
}

const linesParsed: Line[] = lines.map(parseLine);

// Part A

const sumA = linesParsed.filter((line) => checkAllOperations(line, 2)).reduce((acc, cur) => acc + cur.value, 0);
console.log("Part A: ", sumA);

// Part B

const sumB = linesParsed.filter((line) => checkAllOperations(line, 3)).reduce((acc, cur) => acc + cur.value, 0);
console.log("Part B: ", sumB);

// wrong, since I first did all concats then other operations; but, it should be LTR as per puzzle, makes it simpler I guess
// function operateConcat(operands: number[], operationSet: string[]) {
//   const sink: any[] = [];

//   for (let i = 0; i < operands.length; i++) {
//     sink.push(operands[i]);
//     if (i < operands.length - 1 && operationSet[i] !== "0") {
//       sink.push(",");
//     }
//   }

//   const result = sink
//     .join("")
//     .split(",")
//     .map((n) => parseInt(n));
//   console.log("Concatenated result:", result); // Added more descriptive logging

//   return result;
// }

// function checkWithConcat(line: Line): boolean {
//   console.log("Checking line:", line); // Added input logging
//   const results = generateOperations(line.operands.length)
//     .map((set) => {
//       console.log("Operation set:", set); // Added operation set logging
//       return operateConcat(line.operands, set);
//     })
//     .some((operands) => {
//       const result = checkAllOperations({ value: line.value, operands: operands });
//       console.log("Check result:", result); // Added result logging
//       return result;
//     });
//   return results;
// }

// const sumB = linesParsed.filter(checkWithConcat).reduce((acc, cur) => acc + cur.value, 0);
// console.log("Part B: ", sumB);
