/**
 * data-utils.js
 * A file for all enums and extremely basic shared classes that many files can
 * import across the app.
 */

/** Create a new AngularJS module */
var DataUtilsModule = angular.module('DataUtilsModule', [])

/**
 * Class representing a point.
 */
class Position {
	/**
   * Create a point.
   * @param {number} x - The x value.
   * @param {number} y - The y value.
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
