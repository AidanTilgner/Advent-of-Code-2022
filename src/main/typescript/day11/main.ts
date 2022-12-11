import { readFileSync } from "fs";

const input = readFileSync("./test-input.txt").toString();
const lines = input.split("\n");

const startTime = new Date();
console.log("Started at: ", startTime.getTime());

interface Monkey {
  items: number[]; // worry levels of items in order they will be inspected
  operation: {
    first: number | "old";
    second: number | "old";
    op: "+" | "*";
  }; // how worry level changes as item is inspected, for example, worry level might be multiplied by 19 when inspected
  test: {
    divisor: number;
    ifTrue: number;
    ifFalse: number;
  }; // does an operation apply to the new worry
}

const monkeys: Monkey[] = [];

let newMonkey: Partial<Monkey> = {};
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes("Monkey")) {
    continue;
  }
  if (line.includes("Starting items: ")) {
    const items = line
      .replace("Starting items: ", "")
      .split(",")
      .map((c) => Number(c));
    newMonkey.items = items;
  }
  if (line.includes("Operation: ")) {
    const operation = line.replace("Operation: new = ", "").trim();
    const splitOp = operation.split(" ");
    const [first, op, second] = splitOp;
    newMonkey.operation = {
      first: first === "old" ? "old" : Number(first),
      second: second === "old" ? "old" : Number(second),
      op: op as "+" | "*",
    };
  }
  if (line.includes("Test: ")) {
    const divisor = Number(line.split(" divisible by ")[1].trim());
    const [condition1, condition2] = [lines[i + 1], lines[i + 2]];
    const ifTrue = Number(
      condition1.replace("If true: throw to monkey", "").trim()
    );
    const ifFalse = Number(
      condition2.replace("If false: throw to monkey", "").trim()
    );
    newMonkey.test = {
      divisor,
      ifTrue,
      ifFalse,
    };
    monkeys.push(newMonkey as Monkey);
    newMonkey = {};
    i += 2;
  }
}

const superModulo = monkeys.reduce((acc, curr) => {
  return acc * curr.test.divisor;
}, 1);

const inspections: { [key: number]: number } = {};

const getSmallestCongruentModulo = (x: number, y: number) => {
  const r = x % y;
  return r + y;
};

const performOperationFor = (
  first: number | "old",
  second: number | "old",
  op: "+" | "*",
  currentWorry: number,
  index: number
) => {
  // parse the number because it could be "old", if this is the case, set it to the current worry level
  const getRealNumber = (n: number | "old") => (n === "old" ? currentWorry : n);
  // get the real numbers for the first and second
  const realFirst = getRealNumber(first);
  const realSecond = getRealNumber(second);
  switch (op) {
    case "+":
      return realFirst + realSecond;
    case "*":
      return realFirst * realSecond;
  }
};

const performMonkeyBusiness = (monkey: Monkey, index: number) => {
  while (monkey.items.length > 0) {
    // get the current item, which will always be the first, because we shift it out later
    const item = monkey.items[0];
    // perform the operation to get the new value of the item
    let newValue = performOperationFor(
      monkey.operation.first,
      monkey.operation.second,
      monkey.operation.op,
      item,
      index
    );
    newValue = newValue % superModulo;

    const passesTest = newValue % monkey.test.divisor === 0;
    if (passesTest) {
      monkey.items.shift();
      monkeys[monkey.test.ifTrue].items.push(newValue);
    } else {
      monkey.items.shift();
      monkeys[monkey.test.ifFalse].items.push(newValue);
    }
    inspections[index] = inspections[index] ? inspections[index] + 1 : 1;
  }
};

for (let i = 0; i < 10000; i++) {
  monkeys.forEach((m, i) => {
    performMonkeyBusiness(m, i);
  });
  console.log("-".repeat(20));
  console.log("Round: ", i + 1);
  monkeys.forEach((m, i) => {
    console.log(`Monkey ${i}: `, m.items);
  });
}

console.log("Inspections: ", inspections);
// find the two highest values in this object
const mappedMonkeys = Object.entries(inspections).sort((a, b) => b[1] - a[1]);
const twoHighest = mappedMonkeys.slice(0, 2);

const totalMonkeyBusiness = twoHighest.reduce((acc, curr) => {
  return acc * curr[1];
}, 1);

const endTime = new Date();

console.log("Total monkey business: ", totalMonkeyBusiness);

const timeElapsed = endTime.getTime() - startTime.getTime();

const seconds = Math.floor((timeElapsed / 1000) % 60);
const minutes = Math.floor((timeElapsed / (1000 * 60)) % 60);
const hours = Math.floor((timeElapsed / (1000 * 60 * 60)) % 24);

console.log("Ended at: ", endTime.getTime());
console.log(`Time elapsed: ${hours}:${minutes}:${seconds}`);
