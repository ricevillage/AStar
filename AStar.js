export class AStar {
  openSet;
  closedSet;

  constructor() {
    this.openSet = new Set();
    this.closedSet = new Set();
  }

  // manhattanDistance
  heuristic = (currNode, targetNode) => {
    let targetNodeCord = targetNode.position;
    let currNodeCord = currNode.position;
    // {row (y), col(x)}

    let dx = Math.abs(targetNodeCord.col - currNodeCord.col);
    let dy = Math.abs(targetNodeCord.row - currNodeCord.row);
    return Math.sqrt(dx * dx + dy * dy);
  };

  runAStar = (startNode, targetNode, path, explored) => {
    this.openSet.add(startNode);

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

      if (currentNode === targetNode) {
        console.log("path found\n");
        // print path via parent
        while (currentNode) {
          path.unshift(currentNode);
          //   console.log("(" + X + "," + Y + ")\n");
          currentNode = currentNode.parent;
        }
        return;
      }

      if (currentNode.neighbors === null) return;
      let neighbors = currentNode.neighbors;

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
          neighborNode.gCost = temp_gCost;
          let h_Cost = this.heuristic(neighborNode, targetNode);
          neighborNode.hCost = h_Cost;
          // neighborNode.fCost = 0; //dijkstra
          neighborNode.fCost = h_Cost + temp_gCost;
          neighborNode.parent = currentNode;
          if (!this.openSet.has(neighborNode)) {
            this.openSet.add(neighborNode);
          }
        }

        if (neighborNode !== targetNode) {
          explored.push(neighborNode);
        }
      }
    }
  };
}
