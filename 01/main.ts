const content = await Deno.readFile("input.txt");
const input = new TextDecoder().decode(content).trim();
const lines = input.split("\n");

const first: number[] = [];
const second: number[] = [];

lines.map((line) => {
  const [firstPart, secondPart] = line.split("   ");
  first.push(parseInt(firstPart));
  second.push(parseInt(secondPart));
});

first.sort();
second.sort();

// PART A: total distance
let totalDistance = 0;
lines.forEach((_, index) => {
  totalDistance += Math.abs(first[index] - second[index]);
});
console.log("Part A:", totalDistance);

// PART B: similarity score
let totalSimilarity = 0;
first.forEach((n) => {
  totalSimilarity += n * second.filter((m) => n === m).length;
});
console.log("Part B:", totalSimilarity);
