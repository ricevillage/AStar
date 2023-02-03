import { Node } from "./Node.js";
import { PathFinder } from "./PathFinder.js";

const container = document.getElementById("container");
const solveBtn = document.getElementById("startButton");
const clearBtn = document.getElementById("clearButton");
const pathStatus = document.getElementById("mySpan");
const pathFindingList = document.querySelector(".pathFindingList");
const diagonalToggleSwitch = document.getElementById("diagonalToggleSwitch");

const Width = 40,
  Height = 22;

const pathVisualDelay = 50; // ms
const exploredVisualDelay = 10;

export const CELL_TYPE = {
  EMPTY: "EMPTY",
  START: "START",
  TARGET: "TARGET",
  WALL: "WALL",
  PATH: "PATH",
  VISITED: "VISITED",
};

export const SEARCH_ALGORITHM = {
  NONE: "---Select Algorithm---",
  DIJKSTRA: "Dijkstra",
  DFS: "Depth-first Search",
  BFS: "Breadth-first Search",
  ASTAR: "A* Search",
  BDS: "Bidirectional Search",
};

let startSelected, targetSelected;
let attachedMouseEnter;
let pathDrawn;
let pathFinder;
let searchAlgorithm;
export let allowDiagonal;

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// https://stackoverflow.com/a/57550587
function makeGrid(rows, cols) {
  removeAllChildNodes(container);

  container.style.setProperty("--grid-rows", rows);
  container.style.setProperty("--grid-cols", cols);

  for (let i = 0; i < rows * cols; i++) {
    let cell = document.createElement("div");
    // cell.innerText = i + 1;
    cell.className = "grid-item";
    const coord = getCoord(i);
    cell.setAttribute("Cellrow", coord.row);
    cell.setAttribute("CellCol", coord.col);
    cell.setAttribute("isSelected", false);
    // mousedown
    cell.addEventListener("click", function () {
      selectCell(coord);
    });

    container.appendChild(cell);
  }
}

function getCoord(index) {
  // index = row * Width + col;
  const row = Math.floor(index / Width);
  const col = index % Width;
  return { row, col };
}

const disableButtons = () => {
  solveBtn.disabled = true;
  clearBtn.disabled = true;
  pathFindingList.disabled = true;
  diagonalToggleSwitch.disabled = true;
};

const enableButtons = () => {
  solveBtn.disabled = false;
  clearBtn.disabled = false;
  pathFindingList.disabled = false;
  diagonalToggleSwitch.disabled = false;
};

const handleDiagonal = () => {
  allowDiagonal = !allowDiagonal;
  let backgroundColor = allowDiagonal ? "lightgreen" : "buttonface";

  diagonalToggleSwitch.style.backgroundColor = backgroundColor;
};

// https://stackoverflow.com/a/61093874
export function getCellDiv(position) {
  const cell = document.querySelector(
    "div[CellRow='" + position.row + "'][CellCol='" + position.col + "']"
  );
  return cell;
}

export function paintCell(position, type) {
  let color;
  if (type === CELL_TYPE.START) {
    color = "Blue";
  } else if (type === CELL_TYPE.TARGET) {
    color = "Red";
  } else if (type === CELL_TYPE.WALL) {
    color = "Black";
  } else if (type === CELL_TYPE.EMPTY) {
    color = "White";
  } else if (type === CELL_TYPE.PATH) {
    color = "Aqua";
  } else if (type == CELL_TYPE.VISITED) {
    color = "LightPink";
  }

  let cell = getCellDiv(position);
  cell.style.background = color;
}

const resetGridState = () => {
  const classes = ["node-visited", "node-shortest-path"];
  for (let r = 0; r < Height; r++) {
    for (let c = 0; c < Width; c++) {
      const position = { row: r, col: c };
      let cell = getCellDiv(position);
      if (
        cell.classList.contains("node-visited") ||
        cell.classList.contains("node-shortest-path")
      ) {
        cell.setAttribute("isSelected", false);
        cell.classList.remove(...classes);
        cell.classList.add("grid-item");
        cell.innerText = "";
      }
    }
  }
};

function drawPath() {
  if (
    !startSelected ||
    !targetSelected ||
    // pathDrawn ||
    searchAlgorithm === undefined ||
    searchAlgorithm === SEARCH_ALGORITHM.NONE
  )
    return;

  resetGridState();
  pathFinder.runPathFinder(searchAlgorithm);

  let explored = pathFinder.explored;
  let path = pathFinder.Path;

  if (path.length === 0) {
    pathStatus.innerText = "No path found, generate new grid.";
    return;
  } else {
    pathStatus.innerText = "Shortest path found.";
  }

  disableButtons();

  // https://stackoverflow.com/a/30865841 - setTimeout
  for (let i = 0; i < explored.length; i++) {
    (function (i) {
      setTimeout(function () {
        const coord = {
          row: explored[i].position.row,
          col: explored[i].position.col,
        };
        const cell = getCellDiv(coord);
        cell.setAttribute("isSelected", true);
        cell.className = "node-visited";
        if (searchAlgorithm === SEARCH_ALGORITHM.ASTAR) {
          const FCost = Math.round(explored[i].fCost).toString();
          cell.innerText = FCost;
        }

        // Check if the last iteration of the first animation
        if (i === explored.length - 1) {
          // Second animation
          for (let i = 1; i < path.length - 1; i++) {
            (function (i) {
              setTimeout(function () {
                const coord = {
                  row: path[i].position.row,
                  col: path[i].position.col,
                };
                const cell = getCellDiv(coord);
                cell.setAttribute("isSelected", true);
                cell.className = "node-shortest-path";

                enableButtons();
              }, pathVisualDelay * i);
            })(i);
          }
        }
      }, exploredVisualDelay * i);
    })(i);
  }

  pathDrawn = true;
}

function resetGrid() {
  startSelected = false;
  targetSelected = false;
  attachedMouseEnter = false;
  pathDrawn = false;
  pathFinder.resetPathFinder();
  makeGrid(Height, Width);
}

function initVisualizer() {
  pathFinder = new PathFinder(Height, Width);
  makeGrid(Height, Width);
  allowDiagonal = false;
  pathFinder.initGraph();
  pathFinder.connectNeighborNodes();
}

function mountMouseDragEvent() {
  if (startSelected && targetSelected && !attachedMouseEnter) {
    for (let i = 0; i < Height * Width; i++) {
      const coord = getCoord(i);
      const cell = getCellDiv(coord);
      const isCellClicked = cell.getAttribute("isSelected");
      if (isCellClicked === "false") {
        // mousedown & left click
        cell.addEventListener("mouseenter", function (event) {
          if (event.buttons === 1) {
            selectCell(coord);
          }
        });
      }
    }
    attachedMouseEnter = true;
  }
}

const getNode = (position) => {
  for (const node of pathFinder.Grid) {
    let nRow = node.position.row;
    let nCol = node.position.col;
    if (nRow === position.row && nCol === position.col) {
      return node;
    }
  }
  return null;
};

const selectCell = (position) => {
  if (pathDrawn) return;

  const cell = getCellDiv(position);
  const isCellClicked = cell.getAttribute("isSelected");

  if (isCellClicked === "true") {
    const cellStart = pathFinder.StartNode.position;
    const cellTarget = pathFinder.TargetNode.position;
    if (
      startSelected &&
      targetSelected &&
      cellStart !== position &&
      cellTarget !== position
    ) {
      paintCell(position, CELL_TYPE.EMPTY);
      cell.setAttribute("isSelected", false);
      let node = getNode(position);
      node.isObstacle = false;
    }
    return;
  }

  cell.setAttribute("isSelected", true);
  let selectedNode = getNode(position);

  if (!startSelected && !targetSelected) {
    startSelected = true;
    pathFinder.StartNode = selectedNode;
    paintCell(position, CELL_TYPE.START);
  } else if (startSelected && !targetSelected) {
    targetSelected = true;
    pathFinder.TargetNode = selectedNode;
    mountMouseDragEvent();
    paintCell(position, CELL_TYPE.TARGET);
  } else if (startSelected && targetSelected) {
    selectedNode.isObstacle = true;
    paintCell(position, CELL_TYPE.WALL);
  }
};

const selectAlgorithm = () => {
  searchAlgorithm = pathFindingList.options[pathFindingList.selectedIndex].text;
};

clearBtn.addEventListener("click", resetGrid);
solveBtn.addEventListener("click", drawPath);
pathFindingList.addEventListener("change", selectAlgorithm);
initVisualizer();
diagonalToggleSwitch.addEventListener("click", handleDiagonal);
