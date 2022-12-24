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
  }

  setStartNode(node) {
    this.startNode = node;
  }
  setTargetNode(node) {
    this.targetNode = node;
  }
  getStartNode() {
    return this.startNode;
  }
  getTargetNode() {
    return this.targetNode;
  }
  getGrid() {
    return this.grid;
  }
  getPath() {
    return this.path;
  }

  heuristic = (currNode, targetNode) => {
    let targetNodeCord = targetNode.getCoordinate();
    let currNodeCord = currNode.getCoordinate();
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
        this.getGrid().forEach((node) => {
          let nRow = node.coordinate.row;
          let nCol = node.coordinate.col;
          if (nRow === r && nCol === r) {
            return;
          }
        });
        let newNode = new Node({ row: r, col: c });
        this.getGrid().add(newNode);
      }
    }
  };

  connectNeighborNodes = () => {
    const offSets = [-1, 0, 1];
    const offsetSize = 4;

    for (const node of this.getGrid()) {
      for (let i = 0; i < offsetSize; i++) {
        for (let j = 0; j < offsetSize; j++) {
          let coord = node.getCoordinate();
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

          for (const otherNode of this.getGrid()) {
            let coord = otherNode.getCoordinate();
            // {row (y), col(x)}
            let otherX = coord.col;
            let otherY = coord.row;
            if (x === otherX && y === otherY) {
              //   console.log("(" + x + "," + y + ")\n");
              node.getNeighbors().add(otherNode);
              break;
            }
          }
        }
      }
    }
  };

  printNeighbors = () => {
    for (const node of this.getGrid()) {
      for (const neighbor of node.getNeighbors()) {
        let coord = neighbor.getCoordinate();
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

    while (this.openSet.length !== 0) {
      let currentNode = null;
      let min_FCost = 1e9;

      for (const node of this.openSet) {
        if (node.getFCost() < min_FCost) {
          min_FCost = node.getFCost();
          currentNode = node;
        }
      }

      this.openSet.delete(currentNode);
      this.closedSet.add(currentNode);

      if (currentNode === this.targetNode) {
        console.log("path found\n");
        // print path via parent
        while (currentNode) {
          let coord = currentNode.getCoordinate();
          // {row (y), col(x)}
          let col = coord.col;
          let row = coord.row;
          this.path.unshift({ col, row });
          //   console.log("(" + X + "," + Y + ")\n");
          currentNode = currentNode.getParent();
        }
        return;
      }

      if (currentNode.getNeighbors() === null) return;
      let neighbors = currentNode.getNeighbors();

      // let temp = [];

      for (const neighborNode of neighbors) {
        if (
          neighborNode.getIsObstacle() === true ||
          this.closedSet.has(neighborNode)
        ) {
          continue;
        }

        let temp_gCost =
          currentNode.getGCost() + this.heuristic(currentNode, neighborNode);

        if (
          temp_gCost < neighborNode.getGCost() ||
          !this.openSet.has(neighborNode)
        ) {
          // temp.push(neighborNode.getCoordinate());

          neighborNode.setGCost(temp_gCost);
          let hCost = this.heuristic(neighborNode, this.targetNode);
          neighborNode.setHCost(hCost);
          neighborNode.updateFCost(); // adds the two above
          neighborNode.setParent(currentNode);
          if (!this.openSet.has(neighborNode)) {
            this.openSet.add(neighborNode);
          }
        }

        const cell = getCellDiv(neighborNode.getCoordinate());
        // const G_cost = Math.round(neighborNode.getGCost()).toString();
        // const H_Cost = Math.round(neighborNode.getHCost()).toString();
        const FCost = Math.round(neighborNode.getFCost()).toString();

        if (neighborNode !== this.targetNode) {
          cell.innerText = FCost;
          cell.className = "node-visited";
          // paintCell(neighborNode.getCoordinate(), CELL_TYPE.VISITED);
          // this.explored.push(temp);
        }
      }
    }
  };
}
