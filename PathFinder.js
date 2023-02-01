import { Node } from "./Node.js";
import { AStar } from "./AStar.js";
import { Dfs } from "./Dfs.js";
import { Bfs } from "./Bfs.js";
import { Dijkstra } from "./Dijkstra.js";

export class PathFinder {
  startNode;
  targetNode;
  grid;
  m_row;
  m_col;
  path;

  constructor(row, col) {
    this.m_row = row;
    this.m_col = col;
    this.grid = new Set();
    this.path = [];
    this.explored = [];
  }

  set StartNode(node) {
    this.startNode = node;
  }
  set TargetNode(node) {
    this.targetNode = node;
  }
  get StartNode() {
    return this.startNode;
  }
  get TargetNode() {
    return this.targetNode;
  }
  get Grid() {
    return this.grid;
  }
  get Path() {
    return this.path;
  }

  completeGrid = () => {
    for (let r = 0; r < this.m_row; r++) {
      for (let c = 0; c < this.m_col; c++) {
        for (const node of this.grid) {
          let nRow = node.position.row;
          let nCol = node.position.col;
          if (nRow === r && nCol === r) {
            break;
          }
        }
        let newNode = new Node({ row: r, col: c });
        this.Grid.add(newNode);
      }
    }
  };

  connectNeighborNodes = () => {
    const offSets = [-1, 0, 1];
    const offsetSize = 3;

    for (const node of this.Grid) {
      for (let i = 0; i < offsetSize; i++) {
        for (let j = 0; j < offsetSize; j++) {
          let coord = node.position;
          // {row (y), col(x)}
          let x = coord.col + offSets[j];
          let y = coord.row + offSets[i];

          // out of bounds, or same coordinate
          if (
            x < 0 ||
            y < 0 ||
            x >= this.m_col ||
            y >= this.m_row ||
            (offSets[i] === 0 && offSets[j] === 0)
          ) {
            continue;
          }

          for (const otherNode of this.Grid) {
            let coord = otherNode.position;
            // {row (y), col(x)}
            let otherX = coord.col;
            let otherY = coord.row;
            if (x === otherX && y === otherY) {
              //   console.log("(" + x + "," + y + ")\n");
              node.neighbors.add(otherNode);
              break;
            }
          }
        }
      }
    }
  };

  printNeighbors = () => {
    for (const node of this.Grid) {
      for (const neighbor of node.neighbors) {
        let coord = neighbor.position;
        // {row (y), col(x)}
        let X = coord.col;
        let Y = coord.row;
        console.log("(" + X + "," + Y + ")\n");
      }
      console.log("\n");
    }
  };

  run = (searchAlgorithm) => {
    this.completeGrid();
    this.connectNeighborNodes();

    switch (searchAlgorithm) {
      case "Dijkstra":
        const algo1 = new Dijkstra();
        algo1.runDijkstra(
          this.grid,
          this.startNode,
          this.targetNode,
          this.path,
          this.explored
        );
        break;
      case "Depth-first Search":
        const algo2 = new Dfs();
        algo2.runDfs(this.startNode, this.targetNode, this.path, this.explored);
        break;
      case "Breadth-first Search":
        const algo3 = new Bfs();
        algo3.runBfs(this.startNode, this.targetNode, this.path, this.explored);
        break;
      case "A* Search":
        const algo4 = new AStar();
        algo4.runAStar(
          this.startNode,
          this.targetNode,
          this.path,
          this.explored
        );
        break;
      default:
        console.error("Invalid search algorithm specified");
    }
  };
}
