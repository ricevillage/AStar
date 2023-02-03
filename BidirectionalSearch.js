export class BidirectionalSearch {
  constructor() {
    this.startQueue = [];
    this.targetQueue = [];
    this.startExplored = new Set();
    this.targetExplored = new Set();

    this.startToMeetingPoint = new Map();
    this.endToMeetingPoint = new Map();
  }

  runBidirectionalSearch = (startNode, targetNode, path, explored) => {
    this.startQueue.push(startNode);
    this.targetQueue.push(targetNode);
    this.startExplored.add(startNode);
    this.targetExplored.add(targetNode);

    while (this.startQueue.length > 0 && this.targetQueue.length > 0) {
      // Search from start node
      let startNode_temp = this.startQueue.shift();
      for (const neighbor of startNode_temp.neighbors) {
        if (!this.startExplored.has(neighbor) && !neighbor.isObstacle) {
          this.startToMeetingPoint.set(neighbor, startNode_temp);
          explored.push(neighbor);
          // Path found!
          if (this.targetExplored.has(neighbor)) {
            // Reconstruct path by backtracking from both end nodes to the meeting point
            this.reconstructPath(neighbor, path);
            return;
          }
          this.startQueue.push(neighbor);
          this.startExplored.add(neighbor);
        }
      }

      // Search from target node
      let targetNode_temp = this.targetQueue.shift();
      for (const neighbor of targetNode_temp.neighbors) {
        if (!this.targetExplored.has(neighbor) && !neighbor.isObstacle) {
          this.endToMeetingPoint.set(neighbor, targetNode_temp);
          explored.push(neighbor);
          // Path found!
          if (this.startExplored.has(neighbor)) {
            // Reconstruct path by backtracking from both end nodes to the meeting point
            this.reconstructPath(neighbor, path);
            return;
          }
          this.targetQueue.push(neighbor);
          this.targetExplored.add(neighbor);
        }
      }
    }

    // Path not found
  };

  reconstructPath = (meetingPoint, path) => {
    let startParent = this.startToMeetingPoint.get(meetingPoint);
    let endParent = this.endToMeetingPoint.get(meetingPoint);

    while (startParent !== undefined) {
      path.unshift(startParent);
      startParent = this.startToMeetingPoint.get(startParent);
    }

    path.push(meetingPoint);

    while (endParent !== undefined) {
      path.push(endParent);
      endParent = this.endToMeetingPoint.get(endParent);
    }
  };
}
