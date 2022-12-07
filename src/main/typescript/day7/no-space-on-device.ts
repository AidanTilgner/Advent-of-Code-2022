import { readFileSync } from "fs";

// then find the total sum of the sizes of the the directories

// get actual input from "./input.txt" file
const input = readFileSync("./input.txt", "utf8");

interface File {
  name: string;
  size: number;
}

interface Directory {
  name: string;
  size: number;
  directories: Directory[];
  files: File[];
}

// go through input, and create a new directory, which will be the root directory

// go through each line of the input
const lines = input.split("\r\n");

const isCdCommand = (line: string) => line.startsWith("$ cd");
const isLsCommand = (line: string) => line.startsWith("$ ls");
const isCommand = (line: string) => line.startsWith("$");

// Example Input:
/*
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
*/

const createTreeFromInput = () => {
  const rootDirectory: Directory = {
    name: "/",
    size: 0,
    directories: [],
    files: [],
  };
  const directoryStack: Directory[] = [rootDirectory];

  const currentDirectory = () => directoryStack[directoryStack.length - 1];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (isCdCommand(line)) {
      const directoryName = line.replace("$ cd ", "").trim();
      if (directoryName === "..") {
        directoryStack.pop();
        continue;
      }
      const newDirectory: Directory = {
        name: directoryName,
        size: 0,
        directories: [],
        files: [],
      };
      currentDirectory().directories.push(newDirectory);
      directoryStack.push(newDirectory);
      continue;
    }
    if (isLsCommand(line)) {
      // the next lines will be files and directories
      // until we hit another command
      continue;
    }
    if (!isCommand(line)) {
      const isDir = line.startsWith("dir ");
      const isFile = !isDir;

      if (isDir) {
      }
      if (isFile) {
        const [size, name] = line.split(" ");
        const newFile: File = {
          name,
          size: parseInt(size),
        };
        currentDirectory().files.push(newFile);
      }
    }
  }
  return rootDirectory.directories[0];
};

const rootDirectory = createTreeFromInput();

const traverseTreeAndAddSizes = (directory: Directory) => {
  let size = 0;
  for (const file of directory.files) {
    size += file.size;
  }
  for (const child of directory.directories) {
    const dirSize = traverseTreeAndAddSizes(child);
    size += dirSize;
  }
  directory.size = size;
  return size;
};

const traverseAndLog = (directory: Directory, depth: number) => {
  // basically output a tree structure, showing a directory and its children, both files and directories
  const indent = " ".repeat(depth * 2) + "| ";
  console.log(`${indent}${directory.name} (dir, totalSize=${directory.size})`);
  for (const file of directory.files) {
    console.log(`${indent} ${file.name} (file, size=${file.size})`);
  }
  for (const child of directory.directories) {
    traverseAndLog(child, depth + 1);
  }
};

const findDirectoriesUnderThreshold = (
  directory: Directory,
  threshold: number
) => {
  // recursively go through the tree, and find all directories that are under the threshold
  // return an array of directories that are under the threshold
  const directoriesToSum: Directory[] = [];

  if (directory.size <= threshold) {
    directoriesToSum.push(directory);
  }

  for (const child of directory.directories) {
    const childDirectoriesToSum = findDirectoriesUnderThreshold(
      child,
      threshold
    );
    directoriesToSum.push(...childDirectoriesToSum);
  }

  return directoriesToSum;
};

traverseTreeAndAddSizes(rootDirectory);
traverseAndLog(rootDirectory, 0);
const part1 = findDirectoriesUnderThreshold(rootDirectory, 100000);

let pt1_total = 0;
for (const directory of part1) {
  pt1_total += directory.size;
}

console.log("PART 1 TOTAL:", pt1_total);

console.log("-".repeat(80));

const totalDiskSpace = 70000000;
const requiredUnusedSpace = 30000000;
const totalUsedSpace = rootDirectory.size;

console.log("TOTAL USED SPACE:", totalUsedSpace);
console.log("TOTAL DISK SPACE:", totalDiskSpace);
console.log("REQUIRED UNUSED SPACE:", requiredUnusedSpace);

// require at least 30000000 bytes of unused space

const availableSpace = totalDiskSpace - totalUsedSpace;

console.log("AVAILABLE SPACE", availableSpace);
const amountToFree = requiredUnusedSpace - (totalDiskSpace - totalUsedSpace);
console.log("AMOUNT TO FREE:", amountToFree);

const findDirectoriesAboveThreshold = (
  directory: Directory,
  threshold: number
) => {
  // recursively go through the tree, and find all directories that are under the threshold
  // return an array of directories that are under the threshold
  const directoriesToSum: Directory[] = [];

  if (directory.size >= threshold) {
    directoriesToSum.push(directory);
  }

  for (const child of directory.directories) {
    const childDirectoriesToSum = findDirectoriesAboveThreshold(
      child,
      threshold
    );
    directoriesToSum.push(...childDirectoriesToSum);
  }

  return directoriesToSum;
};

const findSmallestDirectoryWhichSatisfies = () => {
  // traverse the tree, and find the smallest directory that satisfies the requirement
  const dirsToCheck = findDirectoriesAboveThreshold(
    rootDirectory,
    amountToFree
  );
  let smallestDirectory: Directory | null = null;
  for (const directory of dirsToCheck) {
    if (!smallestDirectory) {
      smallestDirectory = directory;
      continue;
    }
    if (
      directory.size < smallestDirectory.size &&
      directory.size > amountToFree
    ) {
      smallestDirectory = directory;
    }
  }
  return smallestDirectory;
};

const smallestDirectory = findSmallestDirectoryWhichSatisfies();

console.log("SMALLEST DIRECTORY:", smallestDirectory);
