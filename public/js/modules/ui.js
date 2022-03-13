/**
 * ui.js
 * A file for all dynamic UI elements.
 */

 /** Create a new AngularJS module */
 var uiModule = angular.module('uiModule', ['DataModule'])

/** Class representing a point. */
class ElementHTML {
	/**
	 * 'Virtual' constructor
	 * @constructor
	 */
	constructor() {
		this.dom = null;
		create(Position(0, 0));
	}

	/**
	 * An inherited function that should be called in the constructor
	 * @param {Position} position - The place to put the element relative to parent
	 * @param {string} element - The type of element to make
	 * @param {DOM} parent - The DOM of the parent
	 */
	create(position, element = 'div', parent = null) {
		// Error checking
		if (this.dom === null) return;
		// Create the DOM
		this.dom = document.createElement(element);
		// The element is positioned relative to its first positioned (not static)
		// ancestor element. Find details here:
		// https://www.w3schools.com/cssref/pr_class_position.asp
		// https://www.javascripttutorial.net/javascript-dom/javascript-style/
		this.dom.style.position = 'absolute';
		// Set the actual position
		this.dom.style.left = position.x.toString() + 'px';
		this.dom.style.top = position.y.toString() + 'px';
	}

	/**
	 * Moves the DOM by a certain amount
	 * @param {Position} delta - The amount to move by
	 */
	move(delta) {
		// Error checking
		if (this.dom == null) return;
		// Actually move the element
		this.dom.style.left = (parseInt(this.dom.style.left) + delta.x).toString() + 'px';
		this.dom.style.top = (parseInt(this.dom.style.top) + delta.y).toString() + 'px';
	}

	/**
	 * Returns if the given poistion is inside the element
	 * @param {Position} position - The position to check if it is inside the element
	 * @returns {Boolean}
	 */
	in(position) {
		// Error checking
		if (this.dom == null) return;
		// Check if outside
		if (position.x > this.this.dom.style.width) return false;
		if (position.y > this.this.dom.style.height) return false;
		if (position.x < this.this.dom.style.left) return false;
		if (position.y < this.this.dom.style.top) return false;
		// If not outside, must be inside
		return true;
	}
}
