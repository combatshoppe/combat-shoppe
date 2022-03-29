/**
 * window.js
 * A file for the Display and Placement implimentations of the Window bridge
 */

/** Create a new AngularJS module */
var WindowModule = angular.module('WindowModule', ['SimulatorUtils', 'WindowUtilsModule', 'UiModule'])

/**
 * Subclass of the Placement that only holds one active window.
 */
class GridDisplay extends Display {
	/**
 	 * Member variables
 	 * @member {Grid} grid - the number of grid rows
 	 * @member {Position} gridOffset - the offset of the grid
	 * @member {GridLine[]} hLines - Array of grid lines
	 * @member {GridLine[]} vLines - Array of grid lines
	 * @member {TileObject[]} objects - Array of all TileObjects
	 * @member {TileObject} selectedObject - Array of all TileObjects
 	 */
	 grid = new Grid();
	 gridOffset = new Position(0, 0);
	 hLines = [];
	 vLines = [];
	 objects = [];
	 selectedObject = null;

	/**
	 * Adds a token to the grid at the nearest unoccupied spot to row, col with a given schema
	 * @param {int} row - The position of the click
	 * @param {int} column - The position of the click
	 * @returns {Token} - the token created
	 */
	addToken(column, row, schema) {
		// Find the nearest spot to col, row that is empty
		let done = false;
		let a = 0;
		while (!done) {
			for (let x = a; x >= -a; --x) {
				for (let y = a; y >= -a; --y) {
					if (this.grid.get(new Position(x, y)) === undefined) {
						column += x;
						row += y;
						done = true;
					}
				}
				if (done) break;
			}
			a += 1;
		}
		// Get the offset of the parent plust row/col
		let offset = new Position(row * this.grid.size, column * this.grid.size);
		offset.x += this.offset.x - this.gridOffset.x
		offset.y += this.offset.y - this.gridOffset.y
		// Make the token
		let token = new Token(offset, this.grid.size, this.grid.size, this.parent);

		// To Do: token.row is undefined for some reason

		token.setSchema(STOCK_SCHEMA);
		token.setPosition(column, row);
		// Save and rteturn the token
		this.grid.add(new Position(column, row), token);
		this.objects.push(token);
		return token;
	}

	/**
 	 * Clear the grid.
 	 */
 	_deleteGrid() {
 		// Error check, then get global offset
 		if (this.parent == null) return;
		// Remove the objects
		this.objects.forEach((object, i) => {
			object.delete();
		});
 		// Clear the grid
 		this.vLines.forEach((line) => { line.delete(); });
 		this.vLines = [];
 		this.hLines.forEach((line) => { line.delete(); });
 		this.hLines = [];
 	}

	/**
	 * Clear the grid and redraw it.
	 */
	_redrawGrid() {
		// Delete the current grid
		this._deleteGrid();
		// Make the objects
		this.objects.forEach((object, i) => {
			let offset = new Position(object.column * this.grid.size, object.row * this.grid.size);
			offset.x += -this.gridOffset.x + this.offset.x;
			offset.y += -this.gridOffset.y + this.offset.y;
			object.make(offset, this.grid.size, this.grid.size, this.parent);
		});
		// Make the vertical grid lines
		for (let x = -(this.gridOffset.x % this.grid.size); x < this.width; x += this.grid.size) {
			let offset = new Position(x + this.offset.x, this.offset.y);
			this.vLines.push(new GridLine(offset, 2, this.height, this.parent));
		}
		// Make the horizontal grid lines
		for (let y = -(this.gridOffset.y % this.grid.size); y < this.height; y += this.grid.size) {
			let offset = new Position(this.offset.x, y + this.offset.y);
			this.hLines.push(new GridLine(offset, this.width, 2, this.parent));
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
		let clampPosition = new Position(0, 0);
		clampPosition.x = Math.floor((position.x + this.gridOffset.x) / this.grid.size);
		clampPosition.y = Math.floor((position.y + this.gridOffset.y) / this.grid.size);
		let tile = this.grid.get(clampPosition);
		// Click on empyt space
		if (tile === undefined || tile.objects.length === 0) {
			this.selectedObject = null;
			return;
		}
		// Click on filled space
		this.selectedObject = tile.objects[0];
	}

	/**
	 * Function that defines what to do when the Display is scrolled and no
	 * clickable objects are able to be scrolled. Unless overriden, nothing it done.
	 * @param {float} direction - The distance scrolled
	 */
	onScroll(direction) {
		// Zoom
		this.grid.size += direction * -5;
		// Keep a max and minimum zoom
		this.grid.size = Math.min(this.grid.size, 250);
		this.grid.size = Math.max(this.grid.size, 50);
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
		this.gridOffset.x -= dx;
		this.gridOffset.y -= dy;
		// Loop thru all of the TileObjects
		this.objects.forEach((object, i) => {
			object.move(dx, dy);
		});
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
					line.move(0, -this.grid.size * this.hLines.length * Math.abs(dy) / dy);
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
					line.move(-this.grid.size * this.vLines.length * Math.abs(dx) / dx, 0);
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

	onKeyPress(key) {
		if (this.selectedObject === null) return;
		console.log(key)
		if (key === 'ArrowUp') {
			console.log('up')
		}
		if (key === 'ArrowDown') {

		}
		if (key === 'ArrowLeft') {

		}
		if (key === 'ArrowRight') {

		}
	}
}

/**
 * Subclass of the Placement that only holds one active window.
 */
class InitiativeDisplay extends Display {
	/**
 	 * Member variables
 	 * @member {Position} offset - the offset of the grid
 	 * @member {Image} image - the offset of the grid
 	 */
	_rank = 0;
	token = null;
	image = null;
	text = null;

	/**
 	 * Gets the initiative of the displat
 	 */
	getInitiative() {
		return this._rank;
	}

	/**
	 * Initializes a token into the display and rolls its initiative
	 * @member {Token} token - the token to link
	 * @returns {InitiativeDisplay}
	 */
	linkToken(token) {
		this._rank = token.roll(StatType.Initiative);
		this.token = token;
		return this;
	}

	/**
 	 * Virtual function that visually creates and activates a display.
 	 */
 	_activate() {
		this.image = new Image(this.offset, this.height, this.height, this.parent);
		this.image.setImage(this.token.data.src);
		this.text = new Text(this.offset, this.width, this.height, this.parent);
		this.text.setText(this.getInitiative().toString());
 	}

 	/**
 	 * Function that removes a display from the visual window.
 	 */
 	_deactivate() {
		if (this.image !== null) this.image.delete();
		if (this.text !== null) this.text.delete();
		this.image = null;
		this.text = null;
 	}

	/**
	 * Function that defines what to do when the Display is clicked and no
	 * clickable objects are able to be clicked. Unless overriden, nothing it done.
	 * @param {Position} position - The position of the click
	 */
	onLeftClick(position) {
		console.log("CLICK")
	}

	/**
	 * Function that defines what to do when the Display is scrolled and no
	 * clickable objects are able to be scrolled. Unless overriden, nothing it done.
	 * @param {float} direction - The distance scrolled
	 */
	onScroll(direction) {

	}

	/**
	 * Function that defines what to do when the Display is dragged on and no
	 * clickable objects are able to be dragged. Unless overriden, nothing it done.
	 * @param {float} dx - The movement in the x direction
	 * @param {float} dy - The movement in the y direction
	 */
	onDrag(dx, dy) {

	}
}

/**
 * Subclass of the Placement that only holds one active window.
 */
class AddTokenDisplay extends Display {
	/**
 	 * Member variables
 	 * @member {Position} offset - the offset of the grid
 	 * @member {Image} image - the offset of the grid
 	 */
	_rank = -4503599627370495;
	_src = 'https://cdn.onlinewebfonts.com/svg/img_45824.png';
	image = null;

	/**
 	 * Virtual function that visually creates and activates a display.
 	 */
 	_activate() {
		this.image = new Image(this.offset, this.height, this.height, this.parent);
		this.image.setImage(this._src);
 	}

 	/**
 	 * Function that removes a display from the visual window.
 	 */
 	_deactivate() {
		if (this.image !== null) this.image.delete();
		this.image = null;
 	}

	/**
	 * Function that defines what to do when the Display is clicked and no
	 * clickable objects are able to be clicked. Unless overriden, nothing it done.
	 * @param {Position} position - The position of the click
	 */
	onLeftClick(position) {
		let token = globalGrid.addToken(0, 0, STOCK_SCHEMA);
		globalSideWindow.addDisplay(new InitiativeDisplay().linkToken(token));
	}
}

/**
 * Subclass of the Placement that only holds one active window.
 */
class SinglePlacement extends Placement {
	/**
	 * Function that activates a display in the window.
	 * @param {Display} parent - The DOM parent the display is in
	 * @param {Display} display - The display being added
	 * @param {Array[Display]} allDisplays - All other existing displays
	 */
	activateDisplay(parent, display, allDisplays) {
		// Remove all currently active displays
		allDisplays.forEach((display, i) => {
			if (display.active) display.deactivate();
		});
		// Activate the new display
		let rect = parent.getBoundingClientRect();
		display.activate(new Position(rect.x, rect.y), parent, this.displayWidth, this.displayHeight);
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
			allDisplays[allDisplays.length - 1].activate(new Position(0, 0), this.displayWidth, this.displayHeight);
		}
	}
}

/**
 * Subclass of the Placement that only holds a sorted list of placements.
 */
class SortedListPlacement extends Placement {
	/**
	 * Function that activates a display in the window.
	 * @param {Display} parent - The DOM parent the display is in
	 * @param {Display} display - The display being added
	 * @param {Array[Display]} allDisplays - All other existing displays
	 */
	activateDisplay(parent, display, allDisplays) {
		// Preload the display at the default position
		let rect = parent.getBoundingClientRect();
		display.activate(new Position(rect.x, rect.y), parent, this.width, this.displayHeight);
		// Sort the current display list
		allDisplays.sort(function(a, b) { return a._rank < b._rank ? 1 : -1; });
		// Update the position of every display in list
		let y = 0;
		allDisplays.forEach((_display, i) => {
			// If the display is not active, skip it
			if (!_display.active) return;
			// If the display is not in the calculated position, deactivate it and reactivate it
			let rect = _display.parent.getBoundingClientRect();
			if (_display.offset.y !== rect.y + y) {
				_display.deactivate();
				_display.activate(new Position(rect.x, rect.y + y), parent, this.width, this.displayHeight);
			}
			// Increase the y position of the display
			y += _display.height;
		});
	}

	/**
	 * Function that deactivates a display in the window.
	 * @param {Display} display - The display being removed
	 * @param {Array[Display]} allDisplays - All other existing displays
	 */
	deactivateDisplay(display, allDisplays) {
		// Remove the display
		display.deactivate();
	}
}
