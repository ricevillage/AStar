export class Node {
  #h_cost = 0;
  #g_cost = 0;
  #f_cost = 0;
  #isObstacle = false;
  #parentNode;
  #neighbors = new Set();
  #position = { row: null, col: null };

  constructor(position) {
    this.#position = position;
  }

  set gCost(value) {
    this.#g_cost = value;
  }
  set hCost(value) {
    this.#h_cost = value;
  }
  set fCost(value) {
    this.#f_cost = value;
  }
  set isObstacle(value) {
    this.#isObstacle = value;
  }
  set parent(parentNode) {
    this.#parentNode = parentNode;
  }

  get position() {
    return this.#position;
  }
  get gCost() {
    return this.#g_cost;
  }
  get hCost() {
    return this.#h_cost;
  }
  get fCost() {
    return this.#f_cost;
  }
  get isObstacle() {
    return this.#isObstacle;
  }
  get parent() {
    return this.#parentNode;
  }
  get neighbors() {
    return this.#neighbors;
  }
}
