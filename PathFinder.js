import { SEARCH_ALGORITHM, targetSelected } from "./scripts.js";
import { Node } from "./Node.js";
import { AStar } from "./AStar.js";
import { Dfs } from "./Dfs.js";
import { Bfs } from "./Bfs.js";
import { Dijkstra } from "./Dijkstra.js";
import { allowDiagonal } from "./scripts.js";
import { BidirectionalSearch } from "./BidirectionalSearch.js";
import { MazeGenerator } from "./MazeGenerator.js";

export class PathFinder {
  constructor(row, col) {
    this.startNode = null;
    this.targetNode = null;
    this.m_row = row;
    this.m_col = col;
    this.grid = new Set();
    this.path = [];
    this.explored = [];
    this.mazeGen = new MazeGenerator();
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

  initGraph = () => {
    for (let r = 0; r < this.m_row; r++) {
      for (let c = 0; c < this.m_col; c++) {
        let newNode = new Node({ row: r, col: c });
        this.Grid.add(newNode);
      }
    }
  };

  connectNeighborNodes = () => {
    const cardinalDirections = [
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, 0],
    ];

    const diagonalDirections = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    let offSets = [...cardinalDirections];

    if (allowDiagonal) {
      offSets = [...cardinalDirections, ...diagonalDirections];
    }

    for (const node of this.Grid) {
      let coord = node.position;
      let x = coord.col;
      let y = coord.row;

      for (const offset of offSets) {
        let neighborX = x + offset[0];
        let neighborY = y + offset[1];

        // check if out of bounds
        if (
          neighborX < 0 ||
          neighborY < 0 ||
          neighborX >= this.m_col ||
          neighborY >= this.m_row
        ) {
          continue;
        }

        // find the neighbor node
        // add the neighbor node to the current node's neighbors set
        for (const otherNode of this.Grid) {
          let otherCoord = otherNode.position;
          if (otherCoord.col === neighborX && otherCoord.row === neighborY) {
            node.neighbors.add(otherNode);
            break;
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

  resetPathFinder = () => {
    this.startNode = undefined;
    this.targetNode = undefined;
    this.path = [];
    this.explored = [];

    for (const node of this.Grid) {
      node.h_cost = 0;
      node.g_cost = 0;
      node.f_cost = 0;
      node.isObstacle = false;
      node.parentNode = undefined;
    }
  };

  changeAlgorithm = () => {
    this.path = [];
    this.explored = [];

    for (const node of this.Grid) {
      node.h_cost = 0;
      node.g_cost = 0;
      node.f_cost = 0;
      node.parentNode = undefined;
      node.neighbors.clear();
    }
    this.connectNeighborNodes();
  };

  runPathFinder = (searchAlgorithm) => {
    this.changeAlgorithm();
    switch (searchAlgorithm) {
      case SEARCH_ALGORITHM.DIJKSTRA:
        const algo1 = new Dijkstra();
        algo1.runDijkstra(
          this.grid,
          this.startNode,
          this.targetNode,
          this.path,
          this.explored
        );
        break;
      case SEARCH_ALGORITHM.DFS:
        const algo2 = new Dfs();
        algo2.runDfs(this.startNode, this.targetNode, this.path, this.explored);
        break;
      case SEARCH_ALGORITHM.BFS:
        const algo3 = new Bfs();
        algo3.runBfs(this.startNode, this.targetNode, this.path, this.explored);
        break;
      case SEARCH_ALGORITHM.ASTAR:
        const algo4 = new AStar();
        algo4.runAStar(
          this.startNode,
          this.targetNode,
          this.path,
          this.explored
        );
        break;
      case SEARCH_ALGORITHM.BDS:
        const algo5 = new BidirectionalSearch();
        algo5.runBidirectionalSearch(
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

  runMazeGen = () => {
    if (!targetSelected) return;
    this.mazeGen.runMazeGenerator(/*this.startNode*/ this.Grid);
  };
}
