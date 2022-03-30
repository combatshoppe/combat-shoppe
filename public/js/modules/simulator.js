/**
 * simulator.js
 * A file for the Simulator implimentation
 */

 /** Create a new AngularJS module */
 var WindowModule = angular.module('SimulatorModule', ['DataModule'])

/**
 * The main class behind the Simulation. It handles pathfinding, running rounds of combat, and updating the displays.
 */
class Simulator {
	/**
	 * Creates a simulation for the grid
	 * @constructor
	 * @param {GridDisplay} initialDisplay - 2-dimensional matrix of Tile spaces
	 * @param {Delta[][]} deltas - a log of turn deltas, sorted in 1 dimension, where delta[0] corresponds to turn 1
	 */
	 constructor(initialDisplay, deltas) {
	 	// Init variables
	 	this.copyGrid = initialDisplay.grid; // This should be a copy, currently pass by ref
	 	this.display = initialDisplay;
	 	this.deltas = deltas;
	 }

	/**
	 * Resets the simulation back to its starting state
	 */
	reset() {
		this.currentDisplay = this.initialDisplay;

		// may need to add more so everything is reset correctly
		// for example: might need an int to keep track of current turn
	}

	/*
	 * 	
	 */
	updateDisplay() {
		this.display.grid = this.copyGrid;
		this.display._redrawGrid();
	}

	/**
	 * Run through the entire simulation until it ends
	 * @param {GridDisplay} display - display of the grid
	 * @param {Token[]} initiative - an ordered list of Token objects
	 */
	run(display, initiative) {
		let turnLimit = 30;
		for (let turn = 1; turn < turnLimit; turn++) {

			// Check for stalling edge case, currently just have turn limit

			// Check if simulation is complete
			if (simulationComplete()) {
				break;
			}

			// Run one round on grid without updating displays
			this._forward(initiative);

		}

		// Update displays and animations after simulation is complete
		this.updateDisplay();
	}

	/**
	 * Run the simulation through one turn of combat and update displays
	 */
	stepForward(gridDisplay, initiative) {
		throw 'Simulator.stepForward is not defined!';

		// Loop through all spaces for TileObjects and run their actions
		// 		or develop deltas system and run through all of those
		_forward();
		this.updateDisplay();

	}

	/**
	 * Revert the simulation back one turn of combat and update displays
	 */
	stepBackward() {
		throw 'Simulator.stepBackward is not defined!';
		_backward();
		this.updateDisplay();
	}

	/**
	 * Run the simulation through one turn of combat without updating displays
	 */
	_forward(initiative) {
		// throw 'Simulator._forward is not defined!';

		// Loop through ordered list of Tokens
		for (let i = 0; i < initiative.length; i++) {

			// Look at current Token on grid
			let token = initiative[i];

			let done = false;
			while (!done) {

				let currentPosition = new Position(token.row, token.column);
				let moveTo = new Position(token.row, token.column);

				done = token.behavior.do(moveTo, initiative, token);

				let positions = this._pathfind(this.copyGrid, currentPosition, moveTo);

				let pos = moveTo;
				if (positions.length > 0)
					pos = new Position(positions[positions.length-1].x, positions[positions.length-1].y);

				if (pos.x !== token.row || pos.y !== token.column) {
					console.log("PATHFINDING TO ", pos);
					// let positions = this._pathfind(this.copyGrid, currentPosition, moveTo);
					// moveTo.x = pos.x;
					// moveTo.y = pos.y;

					console.log("VALUES");
					console.log(token.row, token.column, pos.x, pos.y);
					this.copyGrid.move(token, pos, currentPosition);
				}
			}
		}
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
	 _pathfind(grid, start, goal) {

		// Init open and closed list
		let openList = [];
		let closedList = [];
		let finalPath = [];

		// Add starting node
		let dist = Node.distance(start, goal);
		let startNode = new Node(start, 0, dist); // might need to leave f val as 0
		let currentNode = startNode;
		openList.push(currentNode);

		// Loop until destination is found or out of nodes to search
		while (openList.length > 0) {

			// Find best adjacent node and make it new current node
			currentNode = Simulator._findSmallestFNode(openList);
			// Remove the new current node from the openList
			let index = openList.indexOf(currentNode);
			openList.splice(index, 1);

			// Found the goal
			if (currentNode.position.equals(goal)) {

				// Backtrack to get path
				while (currentNode != null) {

					// Add current node position to the list of path positions
					finalPath.push(currentNode.position);

					// Travel backwards to parent node of current node
					currentNode = currentNode.parent;

				}
				finalPath = finalPath.reverse();
				finalPath.pop();
				console.log(finalPath);
				return finalPath;
			}

			// Generate children
			let x = currentNode.position.x;
			let y = currentNode.position.y;
			
			let neighbors = []

			// Check if each adjacent tile is walkable
		 	if (Simulator.isPassable(grid, x+1, y))
		 		neighbors.push(new Position(x+1, y));
		 	if (Simulator.isPassable(grid, x+1, y+1))
		 		neighbors.push(new Position(x+1, y+1));
		 	if (Simulator.isPassable(grid, x, y+1))
		 		neighbors.push(new Position(x, y+1));
		 	if (Simulator.isPassable(grid, x-1, y+1))
		 		neighbors.push(new Position(x-1, y+1));
		 	if (Simulator.isPassable(grid, x-1, y))
		 		neighbors.push(new Position(x-1, y));
		 	if (Simulator.isPassable(grid, x-1, y-1))
		 		neighbors.push(new Position(x-1, y-1));
		 	if (Simulator.isPassable(grid, x, y-1))
		 		neighbors.push(new Position(x, y-1));
		 	if (Simulator.isPassable(grid, x+1, y-1))
		 		neighbors.push(new Position(x+1, y-1));

			// Loop through each neighbor position
			neighbors.forEach((neighbor) => {

				// Create f, g, and h vals
				neighbor.g = currentNode.g + Node.distance(currentNode.position, neighbor);
				neighbor.h = Node.distance(neighbor, goal);
				neighbor.f = neighbor.g + neighbor.h;

				let weight = 1;

				// If neighbor is is openList
				let openNode = null;
				openList.forEach((node) => {
					if (neighbor.equals(node.position)) {
						// neighbor.parent = currentNode;
						if (currentNode.g + weight <= neighbor.g) {
							
							openNode = node;
							return;	
						}
					}
				});

				// If neighbor is in closedList
				let closedNode = false;
				closedList.forEach((node) => {
					if (neighbor.equals(node.position)) {
						// neighbor.parent = currentNode;
						if (currentNode.g + weight <= neighbor.g) {

							closedNode = node;
							return;	
						}
					}
				});			

				// If not in open and closed lists, add node to open list
				let newNode = new Node(new Position(neighbor.x, neighbor.y), neighbor.g, neighbor.h, currentNode);
				openList.push(newNode);
			});
		}
	}

	/**
	 * Finds the Node with the smallest f value from a list of Nodes
	 * @param {Node[]} list - the list of Nodes being checked
	 * @returns {Node}
	 */
	static _findSmallestFNode(list) {
		let minF = 99999;
		let tempNode = null;
		list.forEach((node) => {
			if (node.f < minF) {
				minF = node.f;
				tempNode = node;
			}
		});
		return tempNode;
	}


	/**
	 * Finds a Tile on a given grid and checks to see if the space is passable while pathfinding.
	 * @param {Grid} grid - the grid containing the Tile data
	 * @param {int} x - the x value of the Tile being checked
	 * @param {int} y - the y value of the Tile being checked
	 * @returns {Boolean}
	 */
	static isPassable(grid, x, y) {
	 	let tile = grid.get(x, y);

	 	// Return true if Tile contains nothing
	 	if (typeof(tile) === "undefined")
	 		return true;

	 	// Loop through all objects on Tile
	 	tile.foreach((tileObject) => {
	 		// Return false if the object is not passable
	 		if (typeof(tileObject) === "Wall") {
				return false;								// May need to update this to handle more cases
	 		}
	 	});

	 	// Return true if all objects on Tile are passable
	 	return true;
	}

}

/**
 * A helper which holds a Position and several heuristics for pathfinding purposes.
 */
class Node {
	/**
	 * Creates a Node
	 * @constructor
	 * @param {Position} position - x,y coordinates of Node
	 * @param {Number} g - distance between current node and start
	 * @param {Number} h - estimated distance to goal
	 */
	constructor(position, g, h, parent = null) {
	 	// Init variables
	 	this.position = position;
	 	this.g = g;
		this.h = h;
		this.f = g + h;
		this.parent = parent; // new Position(-1, -1);
	}

	/**
	 * Calculates the distance from between two Positions
	 * @param {Position} start - the Position to calculate distance from
	 * @param {Position} goal - the Position to calculate distance to
	 * @returns {Number}
	 */
	static distance(start, goal) {
		let xDiff = Math.abs(start.x - goal.x);
		let yDiff = Math.abs(start.y - goal.y);
		let sum = Math.pow(xDiff, 2) + Math.pow(yDiff, 2);
		return Math.sqrt(sum);
	}
}
