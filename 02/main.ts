const content = await Deno.readFile("input.txt");
const input = new TextDecoder().decode(content).trim();
const lines = input.split("\n");

const reports: number[][] = lines.map((line) =>
  line.split(" ").map((n) => parseInt(n))
);

// TEST data

// const reports: number[][] = [
//   [7, 6, 4, 2, 1],
//   [1, 2, 7, 8, 9],
//   [9, 7, 6, 2, 1],
//   [1, 3, 2, 4, 5],
//   [8, 6, 4, 4, 1],
//   [1, 3, 6, 7, 9],
// ];

// IGNORE
//
// function deepCompare(a: number[], b: number[]) {
//   return a.every((n, i) => n === b[i]);
// }

// function isOneDirectional(report: number[]) {
//   return deepCompare(report, report.toSorted()) || deepCompare(report, report.toSorted().toReversed());
// }

// console.log(reports.map((report) => isOneDirectional(report)));

const reportsDiffs: number[][] = reports.map((report) =>
  report.map((n, i) => (i === 0 ? null : n - report[i - 1])).filter((n) =>
    n !== null
  )
);

// PART A: Safe reports

const safeReports = reportsDiffs.filter((reportDiff) => {
  const isIncreasing = reportDiff.every((n) => n > 0);
  const isDecreasing = reportDiff.every((n) => n < 0);
  const withinSafeRange = reportDiff.every((n) =>
    Math.abs(n) >= 1 && Math.abs(n) <= 3
  );
  return withinSafeRange && (isIncreasing || isDecreasing);
});
console.log("Part A: ", safeReports.length);

// PART B: Safe reports with tolerance

// IGNORE
//
// const safeReportsWithTolerance = reportsDiffs.filter((reportDiff) => {
//   const isIncreasing = reportDiff.map((n) => n > 0).filter((val) => !val).length <= 1;
//   const isDecreasing = reportDiff.map((n) => n < 0).filter((val) => !val).length <= 1;
//   const withinSafeRange = reportDiff.map((n) => Math.abs(n) >= 1 && Math.abs(n) <= 3).filter((val) => !val).length <= 1;
//   return withinSafeRange && (isIncreasing || isDecreasing);
// });
// console.log(safeReportsWithTolerance.length);

function isSafe(report: number[], toleratedOnce = false) {
  // if (report[1] - report[0] === 0) return false;

  const ascending = [
    report[1] - report[0] > 0,
    report[2] - report[1] > 0,
    report[3] - report[2] > 0,
  ].filter((val) => val).length >= 2;

  for (let i = 1; i < report.length; i++) {
    const diff = report[i] - report[i - 1];

    if (
      diff === 0 ||
      (diff < 0 && ascending) ||
      (diff > 0 && !ascending) ||
      !(Math.abs(diff) >= 1 && Math.abs(diff) <= 3)
    ) {
      if (toleratedOnce) {
        return false;
      } else {
        const splicedReport = [...report.slice(0, i - 1), ...report.slice(i)];
        console.log("spliced: ", splicedReport);
        return isSafe(splicedReport, true);
      }
    }
  }

  console.log("safe: ", report);
  return true;
}

const testReports = reports.map((report) => isSafe(report)).filter((val) =>
  val
);
console.log("Part B: ", testReports.length);
