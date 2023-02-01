export class Dfs {
  constructor() {
    this.stack = [];
    this.visited = new Set();
  }

  runDfs = (startNode, targetNode, path, explored) => {
    this.stack.push(startNode);

    while (this.stack.length > 0) {
      const currentNode = this.stack.pop();

      if (currentNode.isObstacle) continue;

      if (currentNode === targetNode) {
        path.push(currentNode);
        break;
      }

      if (currentNode !== startNode) explored.push(currentNode);

      if (!this.visited.has(currentNode)) {
        this.visited.add(currentNode);
        for (const neighbor of currentNode.neighbors) {
          if (!this.visited.has(neighbor) && !neighbor.isObstacle) {
            this.stack.push(neighbor);
          }
        }
        path.push(currentNode);
      }
    }
  };
}
