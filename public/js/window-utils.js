/**
 * window-utils.js
 * A file for the Display and Placement implimentations of the Window bridge
 */

 /** imports */
 import { Position } from 'data-utils.js'

 /** A bridge class whose implementation is held by the display and placement
  * classes. The window knows nothing about which displays are active
  * or how to deal with them. This structure means that the UI can easily be
  * changed!
  */
 class Placement {
 	/**
 	 * Creates a visible window
 	 * @constructor
 	 * @param {Position} width - Width of the window
 	 * @param {Placement} height - Height of the window
 	 */
 	constructor(width, height) {
		this.width = width;
		this.height = height;
	}

	/**
	 * Virtual function that adds a display to the window. Must be overriden by a
	 * subclass.
	 * @param {Display} display - The display being added
	 * @param {Array[Display]} allDisplays - All other existing displays
	 * @throws If Placement.addDisplay is not defined
	 */
	addDisplay(display, allDisplays) {
		throw 'Placement.addDisplay is not defined!';
	}

	/**
	 * Virtual function that removes a display to the window. Must be overriden by
	 * a subclass.
	 * @param {Display} display - The display being removed
	 * @param {Array[Display]} allDisplays - All other existing displays
	 * @throws If Placement.removeDisplay is not defined
	 */
	removeDisplay(display, allDisplays) {
		throw 'Placement.removeDisplay is not defined!';
	}

	/**
	 * Call onRightClick for all displays
	 * @param {Position} position - The display to add
	 * @param {Array[Display]} allDisplays - All existing displays
	 * @param {String} functionName - The name of the function to call
	 * @param {Array[]} args - Any additional arguments to apply to the function call
	 */
	_call(position, allDisplays, functionName, args) {
		// Loop through all displays
		allDisplays.forEach((display, i) => {
			// Skip if the display us not active
			if (!display.active) continue;
			// Check if the click is in the display
			if (!display.in()) continue;
			// The mouse is over the display and can be passed off to it!
			if (args.length === 0) display[functionName]();
			else display[functionName].apply(display, args);
			return;
		});
	}

	/**
	 * Call onRightClick for all displays
	 * @param {Position} position - Position of the mouse
	 * @param {Array[Display]} allDisplays - All existing displays
	 */
	onRightClick(position, allDisplays) {
		this._call(position, allDisplays, "onRightClick");
	}

	/**
	 * Call onRightClick for all displays
	 * @param {Position} position - Position of the mouse
	 * @param {Array[Display]} allDisplays - All existing displays
	 */
	onLeftClick(position, allDisplays) {
		this._call(position, allDisplays, "onLeftClick");
	}

	/**
	 * Call onRightClick for all displays
	 * @param {Position} position - Position of the mouse
	 * @param {Array[Display]} allDisplays - All existing displays
	 */
	onScroll(position, allDisplays) {
		this._call(position, allDisplays, "onScroll");
	}

	/**
	 * Call onRightClick for all displays
	 * @param {Position} position - The display to add
	 * @param {Array[Display]} allDisplays - All existing displays
	 * @param {float} dx - The movement in the x direction
	 * @param {float} dy - The movement in the y direction
	 */
	onDrag(position, allDisplays, dx, dy) {
		this._call(position, allDisplays, "onDrag", [dx, dy]);
	}
}
