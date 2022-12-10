import { readFileSync } from "fs";

const movements = readFileSync("./input.txt").toString().split("\n");

const positions: { x: number; y: number }[] = [
  { x: 250, y: 250 },
  { x: 250, y: 250 },
  { x: 250, y: 250 },
  { x: 250, y: 250 },
  { x: 250, y: 250 },
  { x: 250, y: 250 },
  { x: 250, y: 250 },
  { x: 250, y: 250 },
  { x: 250, y: 250 },
  { x: 250, y: 250 },
];
const visited: { x: number; y: number }[][] = [];
const visitedSpaces = new Set<string>();

const moveHead = (direction: string, amount: number) => {
  let isNegative = false;
  let toChange: "x" | "y" = "x";
  switch (direction) {
    case "U":
      isNegative = false;
      toChange = "y";
      break;
    case "D":
      isNegative = true;
      toChange = "y";
      break;
    case "L":
      isNegative = true;
      toChange = "x";
      break;
    case "R":
      isNegative = false;
      toChange = "x";
      break;
  }

  for (let i = 0; i < amount; i++) {
    positions[0][toChange] += isNegative ? -1 : 1;
    visited[0] = [...(visited[0] || []), { ...positions[0] }];
    moveTail(1);
  }
};

const moveTail = (index: number) => {
  // recursively move through each item in the tail, passing the new position to the next one
  // each time
  // determine if the current node needs to move based on the parent node, and if so, move it
  // and then call this function again with the new position
  const node = positions[index];

  if (!node) {
    return;
  }

  const parent = positions[index - 1];

  const shouldMove =
    Math.abs(parent.x - node.x) > 1 || Math.abs(parent.y - node.y) > 1;

  if (shouldMove) {
    if (parent.x > node.x) {
      node.x++;
    }
    if (parent.x < node.x) {
      node.x--;
    }
    if (parent.y > node.y) {
      node.y++;
    }
    if (parent.y < node.y) {
      node.y--;
    }
  }

  visited[index] = [...(visited[index] || []), { ...node }];
  if (index === positions.length - 1) {
    visitedSpaces.add(`${node.x},${node.y}`);
  }
  moveTail(index + 1);
};

const visualize = () => {
  // make an array of 20 rows, each with 20 columns
  const grid: string[][] = [];
  for (let i = 0; i < 40; i++) {
    grid.push([]);
    for (let j = 0; j < 40; j++) {
      grid[i].push(".");
    }
  }
  // mark the start
  grid[0][0] = "S";

  // mark the nodes
  positions.forEach((p, index) => {
    if (index === 0) {
      grid[p.x][p.y] = "H";
      return;
    }
    grid[p.x][p.y] = index.toString();
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
