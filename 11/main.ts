const contents = await Deno.readTextFile("input.txt");
const array = contents.trim().split(" ");

// Part A

function operateStone(n: string): string[] {
  if (n === "0") return ["1"];
  if (n.length % 2 === 0) {
    return [parseInt(n.slice(0, n.length / 2)).toString(), parseInt(n.slice(n.length / 2)).toString()];
  }
  return [(parseInt(n) * 2024).toString()];
}

function blink(array: string[], times: number): string[] {
  if (times === 0) return array;
  return blink(array.map((n) => operateStone(n)).flat(), times - 1);
}

console.time("Part A");
console.log("Part A: ", blink(array, 25).length);
console.timeEnd("Part A");

// Part B

// Try 5: Works! After a bit of help from Reddit, learnt about caching and a new way of recursing (branched recursions)

const cache = new Map<string, number>();

function optimisedOperateStone(n: string, times: number): number {
  const key = `${n}x${times}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  let result: number;
  if (times === 0) {
    result = 1;
  } else if (n === "0") {
    result = optimisedOperateStone("1", times - 1);
  } else if (n.length % 2 === 0) {
    result =
      optimisedOperateStone(parseInt(n.slice(0, n.length / 2)).toString(), times - 1) +
      optimisedOperateStone(parseInt(n.slice(n.length / 2)).toString(), times - 1);
  } else {
    result = optimisedOperateStone((parseInt(n) * 2024).toString(), times - 1);
  }

  cache.set(key, result);
  return result;
}

function optimisedBlink(array: string[], times: number): number {
  return array.reduce((sum, n) => sum + optimisedOperateStone(n, times), 0);
}

console.time("Part B");
console.log("Part B: ", optimisedBlink(array, 75));
console.timeEnd("Part B");

// Try 4: Works! But is slower than the brute-force solution

// const cache = new Map<string, number>();

// function optimisedOperateStone(n: string, times: number): number | string[] {
//   const cached = cache.get(`${n}x${times}`);
//   if (cached !== undefined) return cached;

//   return operateStone(n);
// }

// function optimisedBlink(array: string[], times: number): number {
//   if (times === 0) return array.length;

//   const res = array.map((n) => optimisedOperateStone(n, times)).flat();
//   return (
//     res.filter((x) => typeof x === "number").reduce((a, b) => a + b, 0) +
//     optimisedBlink(
//       res.filter((x) => typeof x === "string"),
//       times - 1,
//     )
//   );
// }

// console.time("Part B");
// console.log("Part B: ", optimisedBlink(array, 25));
// console.timeEnd("Part B");

// // Try 3: Better but still overflows memory; I think the cache works tho, idk how cache works IRL, but guessing this way only... wondering if I can use the previous idea of calculating counts per digit, maybe cache the counts instead of the array itself?

// const cache = new Map<string, string[]>();

// function optimisedOperateStone(n: string): string[] {
//   const cached = cache.get(n);
//   if (cached !== undefined) return cached;

//   let next: string[];

//   if (n === "0") {
//     next = ["1"];
//   } else if (n.length % 2 === 0) {
//     next = [parseInt(n.slice(0, n.length / 2)).toString(), parseInt(n.slice(n.length / 2)).toString()];
//   } else {
//     next = [(parseInt(n) * 2024).toString()];
//   }

//   cache.set(n, next);
//   return next;
// }

// function optimisedBlink(array: string[], times: number): string[] {
//   if (times === 0) return array;
//   return optimisedBlink(array.map((n) => optimisedOperateStone(n)).flat(), times - 1);
// }
// console.time("Part B");
// console.log("Part B: ", optimisedBlink(array, 25).length);
// console.timeEnd("Part B");

// // Try 2: Won't work too; tried to convert even nums to counts while odd numbers are strings and operated; but what if even numbers have 0s in between??

// function optimisedOperate(array: (string | number)[], times: number): (string | number)[] {
//   return array.flatMap((n) => {
//     if (typeof n === "number") {
//       if (n === 1) return [1];
//       return [n / 2, n / 2];
//     } else {
//       if (n === "0") return ["1"];
//       if (n.length % 2 === 0)
//         return [parseInt(n.slice(0, n.length / 2)).toString(), parseInt(n.slice(n.length / 2)).toString()];
//       return [(parseInt(n) * 2024).toString()];
//     }
//   });
// }

// // Try 1: Wont't work since to get number of digits when * 2024, we will need the actual number at each step

// function operateAndConvertToCounts(array: string[]): number[] {
//   return array.flatMap((n) => {
//     if (n === "0") return [1];
//     if (n.length % 2 === 0) return [n.length / 2, n.length / 2];
//     if (["1", "3"].includes(n)) return [4];
//     return [n.length + 3];
//   });
// }

// console.log(operate(array, 1));
// console.log("Part B: ", operateAndConvertToCounts(array));
