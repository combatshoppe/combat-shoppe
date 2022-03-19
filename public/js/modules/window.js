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
 	 * Virtual function that visually creates and activates a display.
 	 */
 	_activate() {
		console.log(`dom = ${this.parent}`)
		//let test = new GridLine(new Position(0, 0), 2, this.height, this.parent);
 	}

 	/**
 	 * Function that removes a display from the visual window.
 	 */
 	_deactivate() {

 	}

	/**
	 * Function that defines what to do when the Display is dragged on and no
	 * clickable objects are able to be dragged. Unless overriden, nothing it done.
	 * @param {float} dx - The movement in the x direction
	 * @param {float} dy - The movement in the y direction
	 */
	onDrag(dx, dy) {
		console.log("Test");
		return;
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
