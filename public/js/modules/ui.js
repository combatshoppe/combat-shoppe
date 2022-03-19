/**
 * ui.js
 * A file for all dynamic UI elements.
 */

 /** Create a new AngularJS module */
 var uiModule = angular.module('UIModule', ['DataModule'])

/** Class representing a point. */
class ElementHTML {
	/**
	 * Default constructor
	 * @param {Position} offset - The place to put the element relative to parent
	 * @param {int} width - Width of the DOM
	 * @param {int} height - Height of the DOM
	 * @param {DOM} parent - The DOM of the parent
	 * @constructor
	 */
	constructor(offset, width, height, parent = null) {
		this.dom = null;
		create(offset, width, height, parent);
	}

	/**
	 * An inherited function that should be called in the constructor
	 * @param {Position} offset - The place to put the element relative to parent
	 * @param {DOM} parent - The DOM of the parent
	 * @param {int} width - Width of the DOM
	 * @param {int} height - Height of the DOM
	 * @param {string} element - The type of element to make
	 */
	create(offset, parent, width, height, element = 'div') {
		// Create the DOM
		this.dom = document.createElement(element);
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
	}

	/**
	 * Moves the DOM by a certain amount
	 * @param {Position} delta - The amount to move by
	 * @returns {Position} The current position the DOM is at
	 */
	move(delta) {
		// Error checking
		if (this.dom == null) return;
		// Calculate the new position
		let newPosition = new Position(parseInt(this.dom.style.left) + delta.x,
		                               parseInt(this.dom.style.top) + delta.y)
		// Actually move the element
		this.dom.style.left = newPosition.x.toString() + 'px';
		this.dom.style.top = newPosition.y.toString() + 'px';
		// Return the position
		return newPosition;
	}

	/**
	 * Moves the DOM by a certain amount and deletes if out of bounds of parent
	 * (0,0) to (width, height)
	 * @param {Position} delta - The amount to move by
	 * @returns {Boolean} True if the element was deleted
	 */
	moveAndDelete(delta) {
		let upperLeft = this.move(delta);
		if (this.dom.parentNode == null) return false;
		let upperLeft = new Position(newPosition.x + this.dom.style.width, newPosition.y);
		// Check if the position is not inside the parent
		if (!this.in(upperLeft, true)) {
			// Position is outside parent, delete!
			this.dom.remove();
			return true;
		}
		// Adjust position to lower right to check the opposite corner
		let lowerRight = new Position(newPosition.x - this.dom.style.width,
		                              newPosition.y - this.dom.style.height);
		// Check if the position is not inside the parent
		if (!this.in(lowerRight, true)) {
			// Position is outside parent, delete!
			this.dom.remove();
			return true;
		}
		// DOM is still inside parent
		return false;
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
	 * Overriden constructor for GridLine
	 * @param {Position} offset - The place to put the element relative to parent
	 * @param {int} width - Width of the DOM
	 * @param {int} height - Height of the DOM
	 * @param {DOM} parent - The DOM of the parent
	 * @constructor
	 */
	constructor(offset, width, height, parent = null) {
		this.dom = null;
		create(offset, width, height, parent);
		// Horizontal line
		if (width > height) this.dom.style.borderTop = '2px';
		// Vertical line
		else this.dom.style.borderLeft = '2px';
	}

}
