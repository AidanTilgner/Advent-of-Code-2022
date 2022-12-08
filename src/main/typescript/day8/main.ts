import { readFileSync } from "fs";

const lines = readFileSync("./input.txt").toString().split("\r\n");

const forest = lines.map((l) => {
  return l.split("");
});

console.log("Forest: ", forest);

interface Node {
  value: number;
  top: {
    value: number;
    coords: string;
  };
  right: {
    value: number;
    coords: string;
  };
  bottom: {
    value: number;
    coords: string;
  };
  left: {
    value: number;
    coords: string;
  };
}

// keys will be i + j coordinates
const forestAdjacency: {
  [key: string]: Node;
} = {};

const parseValue = (value: string): number => {
  if (value === "outside") {
    return -1;
  }
  return parseInt(value);
};

const buildAdjacency = () => {
  for (let i = 0; i < forest.length; i++) {
    const row = forest[i];
    for (let j = 0; j < row.length; j++) {
      const char = row[j];
      const keyName = `${i},${j}`;
      const [topEl, bottomEl, rightEl, leftEl] = [
        forest[i - 1]?.[j] || "outside",
        forest[i + 1]?.[j] || "outside",
        forest[i]?.[j + 1] || "outside",
        forest[i]?.[j - 1] || "outside",
      ];
      forestAdjacency[keyName] = {
        value: parseValue(char),
        top: {
          value: parseValue(topEl),
          coords: `${i - 1},${j}`,
        },
        right: {
          value: parseValue(rightEl),
          coords: `${i},${j + 1}`,
        },
        bottom: {
          value: parseValue(bottomEl),
          coords: `${i + 1},${j}`,
        },
        left: {
          value: parseValue(leftEl),
          coords: `${i},${j - 1}`,
        },
      };
    }
  }
};

buildAdjacency();

const checkVisibility = (coords: string) => {
  const root = forestAdjacency[coords];
  // return true if all trees between current node and left are either less than the current value, or the edge
  const checkDirection = (
    node: Node,
    dir: "top" | "right" | "bottom" | "left"
  ): boolean => {
    if (node.value === -1) {
      return true;
    }
    if (node.value >= root.value) {
      return false;
    }
    const checkNode = forestAdjacency[node[dir].coords] || null;
    return checkNode ? checkDirection(checkNode, dir) : true;
  };
  const leftNode = forestAdjacency[root.left.coords] || null;
  const visibleToLeft = leftNode ? checkDirection(leftNode, "left") : true;
  const rightNode = forestAdjacency[root.right.coords] || null;
  const visibleToRight = rightNode ? checkDirection(rightNode, "right") : true;
  const topNode = forestAdjacency[root.top.coords] || null;
  const visibleToTop = topNode ? checkDirection(topNode, "top") : true;
  const bottomNode = forestAdjacency[root.bottom.coords] || null;
  const visibleToBottom = bottomNode
    ? checkDirection(bottomNode, "bottom")
    : true;

  const visible =
    visibleToLeft || visibleToTop || visibleToRight || visibleToBottom;

  return visible;
};

let numTreesVisible: number = 0;

const findTreesVisible = () => {
  for (let i = 0; i < forest.length; i++) {
    const row = forest[i];
    for (let j = 0; j < row.length; j++) {
      const isVisible = checkVisibility(`${i},${j}`);
      if (isVisible) {
        numTreesVisible++;
      }
    }
  }
};

findTreesVisible();

console.log("Total Visible Trees:", numTreesVisible);

function getNode(coords: string) {
  return forestAdjacency[coords] || null;
}

const calculateScenicScore = (coords: string) => {
  const root = forestAdjacency[coords];
  // return true if all trees between current node and left are either less than the current value, or the edge
  const checkDirection = (
    node: Node,
    dir: "top" | "right" | "bottom" | "left",
    numTrees: number
  ): number => {
    if (node.value === -1) {
      return numTrees - 1;
    }
    if (node.value >= root.value) {
      return numTrees + 1;
    }

    numTrees = numTrees + 1;

    const toTest = forestAdjacency[node[dir].coords];
    if (!toTest || toTest.value === -1) {
      return numTrees;
    }
    return checkDirection(toTest, dir, numTrees);
  };
  const getDirectionViewability = (
    node: Node,
    dir: "top" | "right" | "bottom" | "left"
  ) => {
    return node ? checkDirection(node, dir, 0) : 0;
  };

  const viewabilityToLeft = getDirectionViewability(
    getNode(root.left.coords),
    "left"
  );
  const viewabilityToRight = getDirectionViewability(
    getNode(root.right.coords),
    "right"
  );
  const viewabilityToTop = getDirectionViewability(
    getNode(root.top.coords),
    "top"
  );
  const viewabilityToBotton = getDirectionViewability(
    getNode(root.bottom.coords),
    "bottom"
  );

  const visibility =
    viewabilityToLeft *
    viewabilityToRight *
    viewabilityToTop *
    viewabilityToBotton;

  return visibility;
};

let highestScore: number = 0;

const findHighestScenicScore = () => {
  for (let i = 0; i < forest.length; i++) {
    const row = forest[i];
    for (let j = 0; j < row.length; j++) {
      const score = calculateScenicScore(`${i},${j}`);
      if (score > highestScore) {
        highestScore = score;
      }
    }
  }
};

findHighestScenicScore();
console.log("Highest Scenic Score: ", highestScore);
