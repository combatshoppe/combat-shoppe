/**
 * window.js
 * A file for the Display and Placement implimentations of the Window bridge
 */

 /** Create a new AngularJS module */
 var WindowModule = angular.module('WindowModule', ['WindowUtilsModule'])

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
		});
		// Activate the new display
		display.activate(new Position(0, 0), this.width, this.height);
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
