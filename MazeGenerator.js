import { selectCell } from "./scripts.js";
export class MazeGenerator {
  constructor() {}

  runMazeGenerator = (Grid) => {
    // console.log(Grid.size);
    for (const node of Grid) {
      const rndNumber = Math.random() * 1; // [0-1]
      if (rndNumber < 0.05) selectCell(node.position);
    }
  };
}

// Dfs
//  // console.log(Grid.size);
//  let stack = [startNode];
//  let visitedNodes = new Set();

//  while (stack.length > 0) {
//    let currentNode = stack.pop();
//    visitedNodes.add(currentNode);

//    let unvisitedNeighbors = [];
//    for (const neighbor of currentNode.neighbors) {
//      if (!visitedNodes.has(neighbor)) {
//        unvisitedNeighbors.push(neighbor);
//      }
//    }

//    if (unvisitedNeighbors.length > 0) {
//      let randomNeighbor =
//        unvisitedNeighbors[
//          Math.floor(Math.random() * unvisitedNeighbors.length)
//        ];
//      stack.push(currentNode);
//      stack.push(randomNeighbor);
//      selectCell(currentNode.position);

//      // currentNode.neighbors.add(randomNeighbor);
//      // randomNeighbor.neighbors.add(currentNode);
//    }
