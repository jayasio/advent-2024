const content = await Deno.readFile("input.txt");
const input = new TextDecoder().decode(content).trim();
const lines = input.split("\n");

const reports: number[][] = lines.map((line) =>
  line.split(" ").map((n) => parseInt(n))
);

// Part A

function checkReport(report: number[]) {
  return (
    (report.every((n, i) => (i === 0 ? true : n > report[i - 1])) ||
      report.every((n, i) => (i === 0 ? true : n < report[i - 1]))) &&
    report.every((
      n,
      i,
    ) => (i === 0
      ? true
      : Math.abs(n - report[i - 1]) >= 1 && Math.abs(n - report[i - 1]) <= 3)
    )
  );
}

console.log("Part A: ", reports.filter(checkReport).length);

// Part B

function checkReportWithTolerance(report: number[]) {
  return Array(report.length)
    .fill(0)
    .some((_, i) =>
      checkReport([...report.slice(0, i), ...report.slice(i + 1)])
    );
}

console.log("Part B: ", reports.filter(checkReportWithTolerance).length);
