import { Node } from "./Node.js";
import { getCellDiv, paintCell, CELL_TYPE } from "./scripts.js";

export class AStar {
  startNode;
  targetNode;
  openSet;
  closedSet;
  grid;
  m_row;
  m_col;
  path;

  constructor(row, col) {
    this.m_row = row;
    this.m_col = col;
    this.grid = new Set();
    this.openSet = new Set();
    this.closedSet = new Set();
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

  heuristic = (currNode, targetNode) => {
    let targetNodeCord = targetNode.position;
    let currNodeCord = currNode.position;
    // {row (y), col(x)}

    let dx = Math.abs(targetNodeCord.col - currNodeCord.col);
    let dy = Math.abs(targetNodeCord.row - currNodeCord.row);
    return Math.sqrt(dx * dx + dy * dy);
  };

  getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

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

  runAStar = () => {
    this.openSet.add(this.startNode);

    while (this.openSet.size !== 0) {
      let currentNode = null;
      let min_FCost = Infinity;

      for (const node of this.openSet) {
        if (node.fCost < min_FCost) {
          min_FCost = node.fCost;
          currentNode = node;
        }
      }

      this.openSet.delete(currentNode);
      this.closedSet.add(currentNode);

      if (currentNode === this.targetNode) {
        console.log("path found\n");
        // print path via parent
        while (currentNode) {
          let coord = currentNode.position;
          // {row (y), col(x)}
          let col = coord.col;
          let row = coord.row;
          this.path.unshift({ col, row });
          //   console.log("(" + X + "," + Y + ")\n");
          currentNode = currentNode.parent;
        }
        return;
      }

      if (currentNode.neighbors === null) return;
      let neighbors = currentNode.neighbors;

      // let temp = [];

      for (const neighborNode of neighbors) {
        if (
          neighborNode.isObstacle === true ||
          this.closedSet.has(neighborNode)
        ) {
          continue;
        }

        let temp_gCost =
          currentNode.gCost + this.heuristic(currentNode, neighborNode);

        if (
          temp_gCost < neighborNode.gCost ||
          !this.openSet.has(neighborNode)
        ) {
          // temp.push(neighborNode.position);

          neighborNode.gCost = temp_gCost;
          let h_Cost = this.heuristic(neighborNode, this.targetNode);
          neighborNode.hCost = h_Cost;
          neighborNode.fCost = h_Cost + temp_gCost;
          neighborNode.parent = currentNode;
          if (!this.openSet.has(neighborNode)) {
            this.openSet.add(neighborNode);
          }
        }

        const cell = getCellDiv(neighborNode.position);
        // const G_cost = Math.round(neighborNode.gCost).toString();
        // const H_Cost = Math.round(neighborNode.HCost).toString();
        const FCost = Math.round(neighborNode.fCost).toString();

        if (neighborNode !== this.targetNode) {
          // cell.innerText = FCost;
          // cell.className = "node-visited";
          // paintCell(neighborNode.position, CELL_TYPE.VISITED);

          let coord = neighborNode.position;
          // {row (y), col(x)}
          let col = coord.col;
          let row = coord.row;
          this.explored.push({ col, row, FCost });
        }
      }
    }
  };
}
