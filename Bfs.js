export class Bfs {
  constructor() {
    this.queue = [];
    this.visited = new Set();
    this.parent = new Map();
  }

  runBfs = (startNode, targetNode, path, explored) => {
    this.queue.push(startNode);
    this.visited.add(startNode);

    while (this.queue.length > 0) {
      const currentNode = this.queue.shift();

      if (currentNode.isObstacle) continue;

      if (currentNode === targetNode) {
        let node = targetNode;
        while (node !== startNode) {
          path.push(node);
          node = this.parent.get(node);
        }
        path.push(startNode);
        break;
      }

      if (currentNode !== startNode) explored.push(currentNode);

      for (const neighbor of currentNode.neighbors) {
        if (!this.visited.has(neighbor) && !neighbor.isObstacle) {
          this.queue.push(neighbor);
          this.visited.add(neighbor);
          this.parent.set(neighbor, currentNode);
        }
      }
    }

    return path.reverse();
  };
}
