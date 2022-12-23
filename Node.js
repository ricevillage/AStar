export class Node {
  h_cost = 0;
  g_cost = 0;
  f_cost = 0;
  isObstacle = false;
  parentNode;
  neighbors;
  coordinate = { row: null, col: null };

  constructor(coordinate) {
    this.coordinate = coordinate;
    this.neighbors = new Set();
  }

  setGCost(value) {
    this.g_cost = value;
  }
  setHCost(value) {
    this.h_cost = value;
  }
  setIsObstacle(value) {
    this.isObstacle = value;
  }
  setParent(parentNode) {
    this.parentNode = parentNode;
  }
  updateFCost() {
    this.f_cost = this.h_cost + this.g_cost;
  }

  getCoordinate() {
    return this.coordinate;
  }
  getGCost() {
    return this.g_cost;
  }
  getHCost() {
    return this.h_cost;
  }
  getFCost() {
    return this.f_cost;
  }
  getIsObstacle() {
    return this.isObstacle;
  }
  getParent() {
    return this.parentNode;
  }
  getNeighbors() {
    return this.neighbors;
  }
}
