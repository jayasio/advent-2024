// Content processing

const content = await Deno.readFile("input.txt");
const [rules, updates] = new TextDecoder()
  .decode(content)
  .split("\n\n")
  .map((input) => input.trim());

const rulePairs = rules.split("\n").map((rule) =>
  rule.split("|").map((n) => parseInt(n))
);
const updateArrays = updates.split("\n").map((rule) =>
  rule.split(",").map((n) => parseInt(n))
);

// Get unique page numbers from rulePairs

const uniqueNums = [...new Set(rulePairs.flat())];
console.log(uniqueNums);

// Create 2d matrix of relations between pages

const relationMatrix: ("T" | "F" | "_")[][] = [];

uniqueNums.forEach((_) =>
  relationMatrix.push(new Array(uniqueNums.length).fill("_"))
);

rulePairs.forEach(([small, large]) => {
  const x = uniqueNums.indexOf(small);
  const y = uniqueNums.indexOf(large);
  relationMatrix[x][y] = "T";
  relationMatrix[y][x] = "F";
});

console.log("   " + uniqueNums.join(" "));
console.log(
  relationMatrix.map((row, i) => uniqueNums[i] + "  " + row.join("  ")).join(
    "\n",
  ),
);

// *** See below for an interesting alternate solution I tried, but it didn't work out

// From here, checking whether a pair of numbers obeys the rules is just checking the matrix whether it's "T" or "F"

function checkObeysRule(a: number, b: number) {
  return relationMatrix[uniqueNums.indexOf(a)][uniqueNums.indexOf(b)] === "T";
}

// Part A

const sumMidPages = updateArrays
  .filter((update) =>
    update.every((n, i) => (i === 0 ? true : checkObeysRule(update[i - 1], n)))
  )
  .map((update) => update[Math.floor(update.length / 2)])
  .reduce((a, b) => a + b, 0);

console.log("Part A: ", sumMidPages);

// Part B

const sumMidPagesOnlyPrevDiscardedOnes = updateArrays
  .filter((update) =>
    !update.every((n, i) => (i === 0 ? true : checkObeysRule(update[i - 1], n)))
  )
  .map((update) => update.toSorted((a, b) => (checkObeysRule(a, b) ? -1 : 1)))
  .map((update) => update[Math.floor(update.length / 2)])
  .reduce((a, b) => a + b, 0);

console.log("Part B: ", sumMidPagesOnlyPrevDiscardedOnes);

// *** Now the alternate solution

// // This is actually a good solution (logically at first atleast)! It works with the test case. BUT, I made an assumption that the rules are realistic in the same way as a physical book, but there seems to be cyclic loops in the rules. However the set of udpates to check seem to be carefully picked to avoid the loop cases in them. Might be to avoid the kind of solutions that I've written here.
// // The trees themselves make sense, but the forest does not.

// const ranks = uniqueNums.map((num, i) => {
//   return { value: num, rank: relationMatrix[i].filter((x) => x === "T").length };
// });

// const sortedByRank = ranks.toSorted((a, b) => b.rank - a.rank);

// console.log(sortedByRank);

// function isDescendingByRank(arr: any) {
//   function isDescending(arr: number[]) {
//     return arr.every((x, i) => i === 0 || x < arr[i - 1]);
//   }

//   return isDescending(arr.map((a) => a.rank));
// }

// const updatesByRanks = updateArrays.map((arr) => arr.map((n) => ranks.find((num) => num.value === n)!));

// const justCorrects = updatesByRanks.filter((arr) => isDescendingByRank(arr));

// const sum = justCorrects.map((arr) => arr[Math.floor(arr.length / 2)].value).reduce((a, b) => a + b, 0);

// console.log(sum);

// // This is the thought process:

// // Create a Set of unique page numbers.
// // Create a 2d grid, with unique numbers in both axes.
// // For each rule "X|Y": If value in X axis has to come before value in Y axis, mark grid[X][Y] as "T"; This would make grid[Y][X] "F"
// // After going through all the values, the grid is filled.
// // Take each row and count the number of "T" for that row. This becomes the "Rank" of the value associated with this row.
// // Replacing the updates with the ranks, updates with descending ranks can be considered correct.
// // It can be seen with test input that

// //    47 53 97 13 61 75 29
// // 47  _  T  F  T  T  F  T (4 Ts => greater than 4 others => Rank: 4)
// // 53  F  _  F  T  F  F  T
// // 97  T  T  _  T  T  T  T
// // 13  F  F  F  _  F  F  F (0 Ts => smallest number => Rank: 0)
// // 61  F  T  F  T  _  F  T
// // 75  T  T  F  T  T  _  T
// // 29  F  F  F  T  F  F  _
// // [
// //   { value: 97, rank: 6 },
// //   { value: 75, rank: 5 },
// //   { value: 47, rank: 4 },
// //   { value: 61, rank: 3 },
// //   { value: 53, rank: 2 },
// //   { value: 29, rank: 1 },
// //   { value: 13, rank: 0 }
// // ]
// // This works corectly on the test input, and after further processing, I can get the final answer of 143.

// // BUT doesn't work on main input; I get an average rank for each value, which I can't understand! If every page has the same rank, what's the first page??

// // In the test case, the equivalent would be each value getting a rank of 3, instead of range of 1-6. This happens with the actual input (using test values for illustration):

// // [
// //   { value: 97, rank: 3 },
// //   { value: 75, rank: 3 },
// //   { value: 47, rank: 3 },
// //   { value: 61, rank: 3 },
// //   { value: 53, rank: 3 },
// //   { value: 29, rank: 3 },
// //   { value: 13, rank: 3 }
// // ]
