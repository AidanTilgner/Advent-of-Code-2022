import { readFileSync } from "fs";

const lines = readFileSync("./input.txt", "utf8").toString().split("\n");

let X = 1;

const jobQueue: {
  cyclesLeft: number;
  execute: Function;
  withValue: any | null;
  type: string;
}[] = [];

const commands: {
  [command: string]: {
    defaultCycles: number;
    execute: Function;
  };
} = {
  addx: {
    defaultCycles: 2,
    execute: (v: number) => (X += v),
  },
  noop: { defaultCycles: 1, execute: () => {} },
};

for (const instruction of lines) {
  if (!instruction) {
    continue;
  }
  const [command, value] = instruction.split(" ");
  const newCommand = commands[command];
  jobQueue.unshift({
    cyclesLeft: newCommand.defaultCycles,
    execute: newCommand.execute,
    withValue: Number(value) || null,
    type: command,
  });
}

const Screen: string[][] = [
  Array(40).fill("."),
  Array(40).fill("."),
  Array(40).fill("."),
  Array(40).fill("."),
  Array(40).fill("."),
  Array(40).fill("."),
];

const modifyScreen = (x: number, y: number, value: string) => {
  if (Screen.at(y)?.at(x)) {
    const newRow = Screen[y];
    newRow[x] = value;
    Screen[y] = newRow;
  }
};

const drawCurrentSpriteRow = () => {
  const sprite = [X - 1, X, X + 1];
  const row = Array(40).fill(".");
  sprite.forEach((s) => {
    row[s] = "#";
  });
  console.log(row.join(" "));
};

const drawCurrentPixelPosition = (pixel: { x: number; y: number }) => {
  const row = Array(40).fill(".");
  row[pixel.x] = "#";
  console.log(row.join(" "));
};

const drawScreen = () => {
  Screen.forEach((row) => {
    console.log(row.join(" "));
  });
};

const checkPixelIsShown = (pixel: { x: number; y: number }) => {
  const spriteRange = [X - 1, X, X + 1];
  const isShown = spriteRange.includes(pixel.x);
  return isShown;
};

const handleDrawing = (cycle: number) => {
  const row = Math.floor(cycle / 40);
  const column = cycle % 40;
  const currentPixel = { x: column - 1, y: row };
  console.log("-".repeat(100));
  console.log("Cycle: ", cycle, "Row: ", row, "Column: ", column - 1);
  drawCurrentSpriteRow();
  drawCurrentPixelPosition(currentPixel);
  console.log("-".repeat(100));
  if (checkPixelIsShown(currentPixel)) {
    modifyScreen(currentPixel.x, currentPixel.y, "#");
  }
  drawScreen();
  console.log("-".repeat(100));
};

const interestingSignals: number[] = [];
let cycle = 1;
let currentJob: {
  cyclesLeft: number;
  execute: Function;
  withValue: any | null;
  type: string;
} | null = null;

while (jobQueue.length || currentJob) {
  if (!currentJob) {
    currentJob = jobQueue.pop() || null;
  }

  const signal = cycle * X;

  if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
    interestingSignals.push(signal);
  }

  handleDrawing(cycle);

  if (currentJob !== null) {
    if (currentJob.cyclesLeft > 0) {
      currentJob.cyclesLeft--;
    }
    if (currentJob.cyclesLeft === 0) {
      currentJob.execute(currentJob.withValue);
      currentJob = jobQueue.pop() || null;
    }
  }

  cycle++;
}

console.log("Value of X: ", X);
console.log("interesting signals: ", interestingSignals);
console.log(
  "Signals sum: ",
  interestingSignals.reduce((acc, curr) => acc + curr, 0)
);
console.log("Amount of cycles: ", cycle);
