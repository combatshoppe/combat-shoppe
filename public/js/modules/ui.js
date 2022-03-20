/**
 * ui.js
 * A file for all dynamic UI elements.
 */

 /** Create a new AngularJS module */
 var uiModule = angular.module('UIModule', ['DataUtilsModule'])

/** Class representing a point. */
class ElementHTML {
	/**
	 * Member variables
	 * @member {DOM} dom - DOM linked to the class
	 * @member {string} element - The type of element to make when created
	 */
	dom = null;
	_elementType = 'div';

	/**
	 * Default constructor
	 * @param {Position} offset - The place to put the element relative to parent
	 * @param {int} width - Width of the DOM
	 * @param {int} height - Height of the DOM
	 * @param {DOM} parent - The DOM of the parent
	 * @constructor
	 */
	constructor(offset, width, height, parent = null) {
		// Create the DOM
		this.dom = document.createElement(this._elementType);
		// Add the parent to the child
		if (parent != null) parent.appendChild(this.dom);
		// The element is positioned relative to its first positioned (not static)
		// ancestor element. Find details here:
		// https://www.w3schools.com/cssref/pr_class_position.asp
		// https://www.javascripttutorial.net/javascript-dom/javascript-style/
		this.dom.style.position = 'absolute';
		// Set the actual position and size
		this.dom.style.left = offset.x.toString() + 'px';
		this.dom.style.top = offset.y.toString() + 'px';
		this.dom.style.width = width.toString() + 'px';
		this.dom.style.height = height.toString() + 'px';
		// Run any extra code inherited classes need to call
		this._create(offset, width, height);
	}

	/**
	 * A virtual function to add additional code to the constructor
	 */
	delete() {
		if (this.dom != null) this.dom.remove();
	}

	/**
	 * Moves the DOM by a certain amount
	 * @param {float} dx - The movement in the x direction
	 * @param {float} dy - The movement in the y direction
	 * @returns {Position} The current position the DOM is at
	 * @returns {int} 1 for North, 2 for East, 3 for South, 4 for West
	 */
	move(dx, dy) {
		// Error checking
		if (this.dom == null) return;
		// Calculate the new position
		let upperLeft = new Position(parseInt(this.dom.style.left) + dx,
		                             parseInt(this.dom.style.top) + dy)
		// Actually move the element
		this.dom.style.left = upperLeft.x.toString() + 'px';
		this.dom.style.top = upperLeft.y.toString() + 'px';
		// Check if the position is not inside the parent
		let parentRect = this.dom.parentNode.getBoundingClientRect();
		upperLeft.x -= parentRect.left;
		upperLeft.y -= parentRect.top;
		if (upperLeft.x > parentRect.width) return 2;
		if (upperLeft.y > parentRect.height) return 3;
		// Adjust position to lower right to check the opposite corner
		let lowerRight = new Position(upperLeft.x + parseInt(this.dom.style.width),
		                              upperLeft.y + parseInt(this.dom.style.height));
		// Check if the position is not inside the parent
		if (lowerRight.x < 0) return 4;
		if (lowerRight.y < 0) return 1;
		// DOM is still inside parent
		return 0;
	}

	/**
	 * Returns if the given poistion is inside the element
	 * @param {Position} position - The position to check if it is inside the element
	 * @returns {Boolean}
	 */
	in(position, useParent = false) {
		// Set the DOM to use
		let dom = (useParent) ? this.dom.parentNode : this.dom
		// Error checking
		if (dom == null) return false;
		// Check if outside
		if (position.x > dom.style.width + dom.style.left) return false;
		if (position.y > dom.style.height + dom.style.top) return false;
		if (position.x < dom.style.left) return false;
		if (position.y < dom.style.top) return false;
		// If not outside, must be inside
		return true;
	}

	/**
	 * A virtual function to add additional code to the constructor
	 */
	_create() { }

	/**
	 * Function that defines what to do when the ElementHTML is clicked. Unless
	 * overriden, nothing it done.
	 * @returns {Boolean} - Returns true if the ElementHTML did something with the event
	 */
	onRightClick() {
		return false;
	}

	/**
	 * Function that defines what to do when the ElementHTML is clicked. Unless
	 * overriden, nothing it done.
	 * @returns {Boolean} - Returns true if the ElementHTML did something with the event
	 */
	onLeftClick() {
		return false;
	}

	/**
	 * Function that defines what to do when the ElementHTML is scrolled on. Unless
	 * overriden, nothing it done.
	 * @returns {Boolean} - Returns true if the ElementHTML did something with the event
	 */
	onScroll() {
		return false;
	}

	/**
	 * Function that defines what to do when the ElementHTML is clicked. Unless
	 * overriden, nothing it done.
	 * @returns {Boolean} - Returns true if the ElementHTML did something with the event
	 */
	onDrag() {
		return false;
	}
}

/**
 * Subclass of the ElementHTML that represents non clickable grid lines.
 */
class GridLine extends ElementHTML {
	/**
 	 * A virtual function to add additional code to the constructor
 	 * @param {Position} offset - The place to put the element relative to parent
 	 * @param {int} width - Width of the DOM
 	 * @param {int} height - Height of the DOM
 	 */
	_create(offset, width, height) {
		// Horizontal line
		if (width > height) {
			this.dom.style.borderTop = height.toString() + 'px';
			this.dom.style.borderTopColor = 'black';
			this.dom.style.borderTopStyle = 'solid';
		}
		// Vertical line
		else {
			this.dom.style.borderLeft = width.toString() + 'px';
			this.dom.style.borderLeftColor = 'black';
			this.dom.style.borderLeftStyle = 'solid';
		}
		this.dom.style.padding = '0px';
		this.dom.style.visibility = 'visible'
	}

}
