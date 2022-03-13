/**
 * window-utils.js
 * A file for the Display and Placement implimentations of the Window bridge
 */

 /** imports */
 import { Position } from './data-utils.js'

 /**
  * Implimentation for the Window class responsible for placing Displays
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
	 * Virtual function that activates a display in the window. Must be overriden
	 * by a subclass.
	 * @param {Display} display - The display being removed
	 * @param {Array[Display]} allDisplays - All other existing displays
	 * @throws If Placement.activateDisplay is not defined
	 */
	activateDisplay(display, allDisplays) {
		throw 'Placement.activateDisplay is not defined!';
	}

	/**
	 * Virtual function that removes a display from the visual window. Must be
	 * overriden by a subclass.
	 * @param {Display} display - The display being removed
	 * @param {Array[Display]} allDisplays - All other existing displays
	 * @throws If Placement.deactivateDisplay is not defined
	 */
	deactivateDisplay(display, allDisplays) {
		throw 'Placement.deactivateDisplay is not defined!';
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

/**
 * Subclass of the Placement that only holds one active window.
 */
class SinglePlacement extends Placement {
	/**
	 * Function that activates a display in the window.
	 * @param {Display} display - The display being added
	 * @param {Array[Display]} allDisplays - All other existing displays
	 */
	activateDisplay(display, allDisplays) {
		// Remove all currently active displays
		allDisplays.forEach((display, i) => {
			if (display.active) display.deactivate();
		}
		// Activate the new display
		display.activate(Position(0, 0), this.width, this.height);
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
			allDisplays[allDisplays.length - 1].activate(Position(0, 0), this.width, this.height);
		}
	}
}
