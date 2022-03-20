/**
 * window.js
 * A file for the Display and Placement implimentations of the Window bridge
 */

 /** Create a new AngularJS module */
 var WindowModule = angular.module('WindowModule', ['WindowUtilsModule', 'UIModule'])

 /**
  * Subclass of the Placement that only holds one active window.
  */
 class GridDisplay extends Display {
	/**
 	 * Member variables
 	 * @member {Tile[][]} grid - 2D array representing the grid
 	 * @member {int} gridSize - the size of each grid square in px
 	 * @member {int} gridX - the number of grid columns
 	 * @member {int} gridY - the number of grid rows
 	 * @member {Position} offset - the offset of the grid
	 * @member {GridLine[]} hLines - Array of grid lines
	 * @member {GridLine[]} vLines - Array of grid lines
 	 */
	 grid = new Grid();
	 gridSize = 100;
	 gridX = 0;
	 gridY = 0;
	 offset = new Position(0, 0);
	 hLines = [];
	 vLines = [];

	/**
 	 * Clear the grid.
 	 */
 	_deleteGrid() {
 		// Error check, then get global offset
 		if (this.parent == null) return;
 		// Clear the grid
 		this.vLines.forEach((line) => { line.delete(); });
 		this.vLines = [];
 		this.hLines.forEach((line) => { line.delete(); });
 		this.hLines = [];
 		// Reset some varibales
 		this.gridWidth = 0;
 		this.gridX = 0;
 		this.gridY = 0;
 	}

	/**
	 * Clear the grid and redraw it.
	 */
	_redrawGrid() {
		// Delete the current grid
		this._deleteGrid();
		// Get the bounds of the parent
		let rect = this.parent.getBoundingClientRect();
		// Make the vertical grid lines
		for (let x = 0; x < this.width; x += this.gridSize) {
			this.gridX += 1;
			this.vLines.push(new GridLine(new Position(rect.left + x, rect.top),
			                              2, this.height, this.parent));
		}
		// Make the horizontal grid lines
		for (let y = 0; y < this.height; y += this.gridSize) {
			this.gridY += 1;
			this.hLines.push(new GridLine(new Position(rect.left, rect.top + y),
			                              this.width, 2, this.parent));
		}
	}

	/**
 	 * Virtual function that visually creates and activates a display.
 	 */
 	_activate() {
		this._redrawGrid();
 	}

 	/**
 	 * Function that removes a display from the visual window.
 	 */
 	_deactivate() {
		this._deleteGrid();
 	}

	/**
	 * Function that defines what to do when the Display is clicked and no
	 * clickable objects are able to be clicked. Unless overriden, nothing it done.
	 * @param {Position} position - The position of the click
	 */
	onLeftClick(position) {
		console.log(`${Math.floor((position.x + this.offset.x) / this.gridSize)}, ${Math.floor((position.y + this.offset.y) / this.gridSize)}`);
	}

	/**
	 * Function that defines what to do when the Display is scrolled and no
	 * clickable objects are able to be scrolled. Unless overriden, nothing it done.
	 * @param {float} direction - The distance scrolled
	 */
	onScroll(direction) {
		// Zoom
		this.gridSize += direction * -5;
		// Keep a max and minimum zoom
		this.gridSize = Math.min(this.gridSize, 250);
		this.gridSize = Math.max(this.gridSize, 50);
		// Remake the grid
		this._redrawGrid();
	}

	/**
	 * Function that defines what to do when the Display is dragged on and no
	 * clickable objects are able to be dragged. Unless overriden, nothing it done.
	 * @param {float} dx - The movement in the x direction
	 * @param {float} dy - The movement in the y direction
	 */
	onDrag(dx, dy) {
		let isOutOfBounds = 0, x = 0, y = 0;
		// Adjust the offset
		this.offset.x -= dx;
		this.offset.y -= dy;
		// Loop through all horizontal lines
		this.hLines.forEach((line, i) => {
			// Move the line and see if it is out of bounds
			isOutOfBounds = line.move(0, dy);
			// If the line is visible and just moved out of bounds, move it to the other side
			// OR if the line is moving up and out of bounds up, move it to the other side
			// OR if the line is moving down and out of bounds down, move it to the other side
			if (isOutOfBounds) {
				if (line.dom.style.visibility === 'visible' ||
				    (dy < 0 && isOutOfBounds === 1) || (dy > 0 && isOutOfBounds === 3)) {
					// Move the line to the other side for the grid
					line.move(0, -this.gridSize * this.gridY * Math.abs(dy) / dy);
					// Hide the line until it is in bounds again
					line.dom.style.visibility = 'hidden';
				}
				// Reset the flag variable
				isOutOfBounds = 0;
			}
			// Line is not out of bounds, make sure it can be seen
			else line.dom.style.visibility = 'visible';
		});
		// Loop through all vertical lines
		this.vLines.forEach((line, i) => {
			// Move the line and see if it is out of bounds
			isOutOfBounds = line.move(dx, 0);
			// Line is out of bounds
			if (isOutOfBounds) {
				// If the line is visible and just moved out of bounds, move it to the other side
				// OR if the line is moving left and out of bounds left, move it to the other side
				// OR if the line is moving right and out of bounds right, move it to the other side
				if (line.dom.style.visibility === 'visible' ||
				    (dx < 0 && isOutOfBounds === 4) || (dx > 0 && isOutOfBounds === 2)) {
					// Move the line to the other side for the grid
					line.move(-this.gridSize * this.gridX * Math.abs(dx) / dx, 0);
					// Hide the line until it is in bounds again
					line.dom.style.visibility = 'hidden';
				}
				// Reset the flag variable
				isOutOfBounds = 0;
			}
			// Line is not out of bounds, make sure it can be seen
			else line.dom.style.visibility = 'visible';
		});
	}
 }

/**
 * Subclass of the Placement that only holds one active window.
 */
class SinglePlacement extends Placement {
	/**
	 * Function that activates a display in the window.
	 * @param {Display} display - The display being added
	 * @param {Array[Display]} allDisplays - All other existing displays
	 */
	activateDisplay(parent, display, allDisplays) {
		// Remove all currently active displays
		allDisplays.forEach((display, i) => {
			if (display.active) display.deactivate();
		});
		// Activate the new display
		display.activate(new Position(0, 0), parent, this.width, this.height);
	}

	/**
	 * Function that deactivates a display in the window.
	 * @param {Display} display - The display being removed
	 * @param {Array[Display]} allDisplays - All other existing displays
	 */
	deactivateDisplay(display, allDisplays) {
		// Remove the display
		display.deactivate();
		// Activate a display if we have another to activate
		if (allDisplays.length !== 0) {
			allDisplays[allDisplays.length - 1].activate(new Position(0, 0), this.width, this.height);
		}
	}
}
