const content = await Deno.readFile("input.txt");
const input = new TextDecoder().decode(content).trim();
const instructions = input.split("\n").join("");

// Part A

function parseMul(instruction: string) {
  return instruction
    .slice(4, instruction.length - 1)
    .split(",")
    .map((n) => parseInt(n))
    .reduce((a, b) => a * b);
}

const answerA = Array.from(instructions.matchAll(/mul\((\d+),(\d+)\)/g))
  .map((match) => match[0])
  .map((instr) => parseMul(instr))
  .reduce((a, b) => a + b);

console.log("Part A: ", answerA);

// Part B

function segregator(instructions: string[]) {
  let discard = false;

  const keepPile: string[] = [];

  instructions.forEach((instruction) => {
    if (instruction === "do()") {
      discard = false;
      return;
    }

    if (instruction === "don't()") {
      discard = true;
      return;
    }

    if (discard) return;

    keepPile.push(instruction);
  });

  return keepPile;
}

const relevantInstructions = Array.from(instructions.matchAll(/(?:mul\((\d+),(\d+)\)|(?:do|don't)\(\))/g)).map(
  (match) => match[0],
);

const answerB = segregator(relevantInstructions)
  .map((instr) => parseMul(instr))
  .reduce((a, b) => a + b);

console.log("Part B: ", answerB);
