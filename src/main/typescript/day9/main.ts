import { readFileSync } from "fs";

const movements = readFileSync("./test-input.txt").toString().split("\n");

const positions: number[][] = [
  [15, 15],
  [15, 15],
  [15, 15],
  [15, 15],
  [15, 15],
  [15, 15],
  [15, 15],
  [15, 15],
  [15, 15],
  [15, 15],
];
const visited: number[][][] = [];
const visitedSpaces = new Set<string>();

const moveHead = (direction: string, amount: number) => {
  let isNegative = false;
  let toChange = 0;
  switch (direction) {
    case "U":
      isNegative = false;
      toChange = 0;
      break;
    case "D":
      isNegative = true;
      toChange = 0;
      break;
    case "L":
      isNegative = true;
      toChange = 1;
      break;
    case "R":
      isNegative = false;
      toChange = 1;
      break;
  }

  for (let i = 0; i < amount; i++) {
    positions[0][toChange] += isNegative ? -1 : 1;
    visited[0] = [...(visited[0] ? visited[0] : []), [...positions[0]]];
    moveTail();
  }
};

const moveTail = () => {
  // go through each tail position after the head
  // if the tail node is not within 1 of the previous node in either direction, move it to where that node was last

  for (let i = 1; i < positions.length; i++) {
    const moveI = Math.abs(positions[i - 1][0] - positions[i][0]) > 1;
    const moveJ = Math.abs(positions[i - 1][1] - positions[i][1]) > 1;

    console.log("previous node current position: ", positions[i - 1]);
    console.log("current node current position: ", positions[i]);
    if (moveI || moveJ) {
      console.log(
        "Moving tail to: ",
        visited[i - 1][visited[i - 1].length - 2]
      );
      const lastHead = visited[i - 1][visited[i - 1].length - 2];
      positions[i] = [...lastHead];
      visited[i] = [...(visited[i] ? visited[i] : []), [...lastHead]];
      visitedSpaces.add(lastHead.join(","));
    }
  }

  visualize();
};

const visualize = () => {
  // make an array of 20 rows, each with 20 columns
  const grid: string[][] = [];
  for (let i = 0; i < 50; i++) {
    grid.push([]);
    for (let j = 0; j < 50; j++) {
      grid[i].push(".");
    }
  }
  // mark the start
  grid[0][0] = "S";

  // mark the nodes
  positions.forEach((p, index) => {
    if (index === 0) {
      grid[p[0]][p[1]] = "H";
      return;
    }
    grid[p[0]][p[1]] = index.toString();
  });

  // reverse the arrays so that they're the opposite direction
  const reversedGrid = grid.reverse();

  console.log("-".repeat(20));
  reversedGrid.forEach((row) => {
    console.log(row.join(" "));
  });
  console.log("-".repeat(20));
};

movements.forEach((m) => {
  console.log("Moving: ", m);
  const [direction, amountString] = m.split(" ");
  const amount = Number(amountString);
  moveHead(direction, amount);
});

console.log("total: ", visitedSpaces.size);
console.log("Visited: ", visitedSpaces);