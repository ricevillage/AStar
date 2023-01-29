import { AStar } from "./AStar.js";
import { Node } from "./Node.js";

const container = document.getElementById("container");
const solveBtn = document.getElementById("myButton1");
const clearBtn = document.getElementById("myButton2");
const pathStatus = document.getElementById("mySpan");

const Width = 35,
  Height = 22;

let pathVisualDelay = 50; // ms

export const CELL_TYPE = {
  EMPTY: "EMPTY",
  START: "START",
  TARGET: "TARGET",
  WALL: "WALL",
  PATH: "PATH",
  VISITED: "VISITED",
};

let startSelected, targetSelected;
let attachedMouseEnter;
let pathDrawn;
let pathFinder;

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

initVisualizer();

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

function drawPath() {
  if (!startSelected || !targetSelected || pathDrawn) return;

  // console.log(pathFinder.getGrid());

  pathFinder.completeGrid();
  pathFinder.connectNeighborNodes();
  pathFinder.runAStar();

  let path = pathFinder.Path;

  if (path.length === 0) {
    pathStatus.innerText = "No path found, generate new grid.";
    return;
  } else {
    pathStatus.innerText = "Shortest path found.";
  }

  // https://stackoverflow.com/a/30865841 - setTimeout
  for (let i = 1; i < path.length - 1; i++) {
    (function (i) {
      setTimeout(function () {
        const coord = { row: path[i].row, col: path[i].col };
        // console.log(x, y);
        const cell = getCellDiv(coord);
        cell.setAttribute("isSelected", true);
        cell.className = "node-shortest-path";
        // paintCell(coord, CELL_TYPE.PATH);
      }, pathVisualDelay * i);
    })(i);
  }

  pathDrawn = true;
}

function resetGrid() {
  startSelected = false;
  targetSelected = false;
  attachedMouseEnter = false;
  pathDrawn = false;
  initVisualizer();
}

function initVisualizer() {
  pathFinder = new AStar(Height, Width);
  makeGrid(Height, Width);
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

const selectCell = (position) => {
  if (pathDrawn) return;
  // console.log(position.row, position.col);
  // mountMouseDragEvent();

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
      for (const node of pathFinder.Grid) {
        let nRow = node.position.row;
        let nCol = node.position.col;
        if (nRow === position.row && nCol === position.col) {
          pathFinder.Grid.delete(node);
          return;
        }
      }
    }
    return;
  }

  cell.setAttribute("isSelected", true);
  let newNode = new Node(position);

  if (!startSelected && !targetSelected) {
    startSelected = true;
    pathFinder.StartNode = newNode;
    paintCell(position, CELL_TYPE.START);
  } else if (startSelected && !targetSelected) {
    targetSelected = true;
    pathFinder.TargetNode = newNode;
    mountMouseDragEvent();
    paintCell(position, CELL_TYPE.TARGET);
  } else if (startSelected && targetSelected) {
    newNode.isObstacle = true;
    paintCell(position, CELL_TYPE.WALL);
  }

  pathFinder.Grid.add(newNode);
};

clearBtn.addEventListener("click", resetGrid);
solveBtn.addEventListener("click", drawPath);
