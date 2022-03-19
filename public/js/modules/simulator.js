/**
 * simulator.js
 * A file for the Simulator implimentation
 */

 /** Create a new AngularJS module */
 var WindowModule = angular.module('SimulatorModule', ['DataModule'])

/** To do: explain the class here ---------------------------------------------
 * 
 */
class Simulator {
	/**
	 * Creates a simulation for the grid
	 * @constructor
	 * @param {Tile[][]} initial_grid - 2-dimensional matrix of Tile spaces
	 * @param {Delta[][]} deltas - a log of turn deltas, sorted in 1 dimension, where delta[0] corresponds to turn 1
	 */
	 constructor(initial_grid, deltas) {
	 	// Init variables
	 	this.initial_grid = initial_grid; // This should be a copy, currently pass by ref
	 	this.current_grid = initial_grid;
	 	this.deltas = deltas;
	 }

	/**
	 * Resets the simulation back to its starting state
	 */
	reset() {
		this.current_grid = this.initial_grid;

		// may need to add more so everything is reset correctly
		// for example: might need an int to keep track of current turn
	}

	/**
	 * Run through the entire simulation until it ends
	 */
	run() {
		let turn_limit = 30;
		for (let turn = 1; turn < turn_limit; turn++) {

			// Check for stalling edge case, currently just have turn limit

			// Check if simulation is complete
			if (simulationComplete()) {
				break;
			}

			// Run one round on grid
			_forward();

			// Update displays and animations
			UpdateDisplays();
		}
	}

	/**
	 * Run the simulation through one turn of combat and update displays
	 */
	stepForward() {
		throw 'Simulator.stepForward is not defined!';


		// Loop through all spaces for TileObjects and run their actions
		// 		or develop deltas system and run through all of those
		_forward();
		UpdateDisplays();

	}

	/**
	 * Revert the simulation back one turn of combat and update displays
	 */
	stepBackward() {
		throw 'Simulator.stepBackward is not defined!';
		_backward();
		UpdateDisplays();
	}

	/**
	 * Run the simulation through one turn of combat without updating displays
	 */
	_forward() {
		throw 'Simulator._forward is not defined!';
	}

	/**
	 * Revert the simulation back one turn of combat without updating displays
	 */
	_backward() {
		throw 'Simulator._backward is not defined!';
	}

	/**
	 * Calls all required components in order to update animations
	 */
	_animationUpdate() {
		throw 'Simulator._animationUpdate is not defined!';
	}

	/**
	 * Finds a path on the grid to a given destination tile
	 * @param {Position} start - the starting location
	 * @param {Position} goal - the destination location
	 * @returns {Position[]}
	 */
	 _pathfind(start, goal) {

		// Init open and closed list
		var openList = [];
		var closedList = [];
		var finalPath = [];

		// Add starting node
		let dist = start.distanceTo(goal);
		var startNode = new Node(start, 0, dist); // might need to leave f val as 0
		var currentNode = startNode;

		// Loop until destination is found or out of nodes to search
		while (openList.length > 0) {
			// Find best adjacent node and make it new current node
			currentNode = _findSmallestFNode(currentNode);
			openList.remove(currentNode);
			closedList.append(currentNode);

			// Found the goal
			if (currentNode.position == goal) {
				// Backtrack to get path

				while (currentNode != startNode) {

					// Add current node position to the list of path positions
					finalPath.append(currentNode.position);
					// Travel backwards to parent node of current node
					currentNode = currentNode.parentNode;

				}
				return finalPath;
			} 

			// Generate children
			let neighbors = [];
			let x = currentNode.position.x;
			let y = currentNode.position.y;

			/* Check if new node will be within bounds and consider that neighbor if so

			if (x < textmap.mapData.GetLength(0) - 1 && textmap.mapData[x + 1, y] == 0)
                neighbors.Add(new Vector3Int(x + 1, y, 0));
            if (x > 0 && textmap.mapData[x - 1, y] == 0)
                neighbors.Add(new Vector3Int(x - 1, y, 0));
            if (y < textmap.mapData.GetLength(1) - 1 && textmap.mapData[x, y + 1] == 0)
                neighbors.Add(new Vector3Int(x, y + 1, 0));
            if (y > 0 && textmap.mapData[x, y - 1] == 0)
                neighbors.Add(new Vector3Int(x, y - 1, 0));
            */

            // Loop through each neighbor
			neighbors.foreach((neighbor) => {

				// Child is in closedList
				if (neighbor in closedList) {
					continue;
				}

				// Create f, g, and h vals
				neighbor.g = currentNode.g + neighbor.distanceTo(currentNode);
				neighbor.h = neighbor.distanceTo(goal);
				neighbor.f = neighbor.g + neighbor.h;

				// Child is is openList
				var openListNeighbor = null;
				openList.foreach ((node) => {
					if (node.position.x == neighbor.position.x & node.position.y == neighbor.position.y) {
						openListNeighbor = node;
						break;
					}
				});

				if (neighbor.position in openList) {
					if (neighbor.position.g > openListNeighbor.position.g) {
						continue;
					}
				}

				// Add child to openList
				openList.append(neighbor);

			});
		}
	 }

	 /**
	 * Finds the Node adjacent to a given Node that is closest to the goal
	 * @param {Node} node - the Node object being checked
	 * @returns {Node}
	 */
	 _findSmallestFNode(node) {
		throw 'Simulator._findNearestTile is not defined!';
		// let smallest_f = 9999;
		// for (let i = 0; i < ) {

		// }
	 }

}

/**
 * 
 */
class Node {
	/**
	 * Creates a Node
	 * @constructor
	 * @param {Position} position - x,y coordinates of Node
	 * @param {Number} g - distance between current node and start
	 * @param {Number} h - estimated distance to goal
	 */
	 constructor(position, g, h) {
	 	// Init variables
	 	this.position = position;
	 	this.g = g;
        this.h = h;
        this.f = g + h;
        this.parent = null; // new Position(-1, -1);
	 }

	 /**
	 * Calculates the distance from current Node to another Node
	 * @param {Node} destination - the Node to calculate distance to
	 * @returns {Number}
	 */
	distanceTo(destination) {
		let x_diff = destination.position.x - this.position.x;
		let y_diff = destination.position.y - this.position.y;
		let sum = Math.pow(x_diff, 2) + Math.pow(y_diff, 2);
		return Math.sqrt(sum);
	}
}