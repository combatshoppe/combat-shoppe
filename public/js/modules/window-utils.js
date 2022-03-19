/**
 * window.js
 * A file for the Window bridge
 */

/** Create a new AngularJS module */
var WindowUtilsModule = angular.module('WindowUtilsModule', ['DataModule', 'UIModule'])

/** A bridge class whose implementation is held by the display and placement
 * classes. The window knows nothing about which displays are active
 * or how to deal with them. This structure means that the UI can easily be
 * changed!
 */
class Window {
	/**
	 * Creates a visible window
	 * @constructor
	 * @param {Position} dom - DOM to attach to the window
	 * @param {Placement} placement - The placement for the controller to use
	 */
	constructor(dom, placement) {
		// Init variables
		this.drag = false;
		this.displays = [];
		this.dom = dom;
		this.placement = placement;
		// Disable default right click for the window
		this.dom.oncontextmenu = this.onClick;
		// Init the placement
		this.placement.init(this.dom.clientWidth, this.dom.clientHeight);
		// Add an onClick event to the DOM
		this.dom.onclick = this.onClick;
		this.dom.onscroll = this.onScroll;
		this.dom.onmousemove = this.onMove;
		// Save this to the DOM
		this.dom.window = this;
	}

	/**
	 * Adds a display to the window
	 * @param {Display} display - The display to add
	 */
	addDisplay(display) {
		this.placement.activateDisplay(display, this.displays);
		this.displays.push(display);
	}

	/**
	 * Remove a display from the window
	 * @param {Display} display - The display to remove
	 */
	removeDisplay(display) {
		// Get index of the display
		let i = this.displays.indexOf(display);
		// Error checking
		if (i == -1) return;
		// Remove the display if it exists
		this.displays.splice(i, 1);
		this.placement.removeDisplay(display, this.displays);
	}

	/**
	 * Handler for a click event
	 * @param {MouseEvent} event - Occurs when mouse interacts with the window
	 */
	onClick(event) {
		// Stop if this is the end of a drag
		if (event.currentTarget.window.drag) {
			event.currentTarget.window.drag = false;
			return false;
		}
		let placement = event.currentTarget.window.placement;
		let displays = event.currentTarget.window.displays;
		// Get the local position
		let position = new Position(event.offsetX, event.offsetY);
		// Left click
		if (event.button === 0) return placement.onLeftClick(position, displays);
		// Right click
		else if (event.button === 2) return placement.onRightClick(position, displays);
	}

	/**
	 * Handler for a scroll event
	 * @param {MouseEvent} event - Occurs when mouse interacts with the window
	 */
	onScroll(event) {
		let placement = event.currentTarget.window.placement;
		let displays = event.currentTarget.window.displays;
		// Get the local position and call the proper method
		let position = new Position(event.offsetX, event.offsetY);
		placement.onScroll(position, displays);
	}

	/**
	 * Handler for a move event
	 * @param {MouseEvent} event - Occurs when mouse interacts with the window
	 */
	onMove(event) {
		let placement = event.currentTarget.window.placement;
		let displays = event.currentTarget.window.displays;
		// Make sure this is a drag event
		if (event.buttons === 0 || event.button !== 0) return;
		event.currentTarget.window.drag = true;
		// Get the local position and call the proper method
		let position = new Position(event.offsetX, event.offsetY);
		placement.onDrag(position, displays, event.movementX, event.movementY);
	}
}

/**
 * Implimentation for the Dispaly class responsible for dealing with the gritty
 * details of the Window
 */
class Display {
	/**
	 * Creates a Display object
	 * @constructor
	 */
	constructor() {
		this.active = false;
		this.offset = new Position(0, 0);
		this.width = 0;
		this.height = 0;
		this.clickable = [];
	}

	/**
	 * Returns if the given position is inside the Display
	 * @param {Position} position - The position to check if it is inside the Display
	 * @returns {Boolean} - Returns true if inside the display
	 */
	in(position) {
		// Check if outside
		if (position.x > this.width) return false;
		if (position.y > this.height) return false;
		if (position.x < this.offset.x) return false;
		if (position.y < this.offset.y) return false;
		// If not outside, must be inside
		return true;
	}

	/**
	 * Virtual function that visually creates and activates a display.
	 * @param {Position} offset - The display being removed
	 * @param {int} width - Width of the display
	 * @param {int} height - Height of the display
	 * @throws If Display.activate is not defined
	 */
	activate(offset, width, height) {
		this.offset = offset;
		this.width = width;
		this.height = height;
		this.active = true;
	}

	/**
	 * Function that removes a display from the visual window.
	 * @throws If Display.deactivate is not defined
	 */
	deactivate(display, allDisplays) {
		this.active = false;
	}

	/**
	 * Function that defines what to do when the Display is clicked and no
	 * clickable objects are able to be clicked. Unless overriden, nothing it done.
	 */
	onRightClick() {
		return;
	}

	/**
	 * Function that defines what to do when the Display is clicked and no
	 * clickable objects are able to be clicked. Unless overriden, nothing it done.
	 */
	onLeftClick() {
		return;
	}

	/**
	 * Function that defines what to do when the Display is scrolled and no
	 * clickable objects are able to be scrolled. Unless overriden, nothing it done.
	 */
	onScroll() {
		return;
	}

	/**
	 * Function that defines what to do when the Display is dragged on and no
	 * clickable objects are able to be dragged. Unless overriden, nothing it done.
	 */
	onDrag() {
		return;
	}
}

/**
 * Implimentation for the Window class responsible for placing Displays
 */
class Placement {
 	/**
 	 * Creates a Placement object
 	 * @constructor
 	 */
 	constructor() {
		this.width = 0;
		this.height = 0;
	}

	/**
 	 * Inits the placement with its width and height
 	 * @param {Position} width - Width of the window
 	 * @param {Placement} height - Height of the window
 	 */
 	init(width, height) {
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
	 * Get the display or element in the display who is clicked on, then call the
	 * proper function
	 * @param {Position} position - The display to add
	 * @param {Array[Display]} allDisplays - All existing displays
	 * @param {String} functionName - The name of the function to call
	 * @param {Array[]} args - Any additional arguments to apply to the function call
	 */
	_call(position, allDisplays, functionName, args) {
		let captured = false;
		// Loop through all displays
		allDisplays.every((display, i) => {
			// Skip if the display us not active
			if (!display.active) return true;
			// Check if the click is in the display
			if (!display.in(position)) return true;
			// Get all the display's clickable objects and pass things off to them first!
			display.clickable.every((element, i) => {
				// Check if the click is in the element
				if (!element.in(position)) return true;
				// The click was on the element! Try and let it use it
				if (args.length === 0) captured = element[functionName]();
				else captured = element[functionName].apply(element, args);
				// If the element used the click, stop
				if (captured) return false;
			});
			// The click was not on any elements of the display, so pass it off to the display
			if (args.length === 0) display[functionName]();
			else display[functionName].apply(display, args);
			return false;
		});
	}

	/**
	 * Call onRightClick for all displays
	 * @param {Position} position - Position of the mouse
	 * @param {Array[Display]} allDisplays - All existing displays
	 * @returns {Boolean}
	 */
	onRightClick(position, allDisplays) {
		this._call(position, allDisplays, "onRightClick", []);
		// Stop the context menu from appearing
		return false;
	}

	/**
	 * Call onRightClick for all displays
	 * @param {Position} position - Position of the mouse
	 * @param {Array[Display]} allDisplays - All existing displays
	 * @returns {Boolean}
	 */
	onLeftClick(position, allDisplays) {
		this._call(position, allDisplays, "onLeftClick", []);
		// Stop the context menu from appearing
		return false;
	}

	/**
	 * Call onRightClick for all displays
	 * @param {Position} position - Position of the mouse
	 * @param {Array[Display]} allDisplays - All existing displays
	 */
	onScroll(position, allDisplays) {
		this._call(position, allDisplays, "onScroll", []);
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
