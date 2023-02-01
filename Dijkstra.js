export class Dijkstra {
  constructor() {
    this.distances = new Map();
    this.previous = new Map();
    this.unvisited = new Set();
    this.edgeWeight = 1;
  }

  runDijkstra = (grid, startNode, targetNode, path, explored) => {
    for (const node of grid) {
      this.distances.set(node, Infinity);
      this.unvisited.add(node);
    }

    this.distances.set(startNode, 0);

    while (this.unvisited.size > 0) {
      let current = null;
      let closest = Infinity;
      for (const node of this.unvisited) {
        if (this.distances.get(node) < closest && !node.isObstacle) {
          closest = this.distances.get(node);
          current = node;
        }
      }

      this.unvisited.delete(current);

      if (current === targetNode) {
        let current = targetNode;
        while (current !== startNode) {
          path.unshift(current);
          current = this.previous.get(current);
        }
        path.unshift(startNode);
        return path;
      }

      if (current !== startNode) explored.push(current);

      for (const neighbor of current.neighbors) {
        if (neighbor.isObstacle) {
          continue;
        }
        const distance = this.distances.get(current) + this.edgeWeight;
        if (distance < this.distances.get(neighbor)) {
          this.distances.set(neighbor, distance);
          this.previous.set(neighbor, current);
        }
      }
    }

    return [];
  };
}
