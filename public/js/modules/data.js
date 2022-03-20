/**
 * data.js
 * A file for all schema objects
 */

/** Create a new AngularJS module */
var DataModule = angular.module('DataModule', ['DataUtilsModule'])

/** Create a counter var and lock for the DataSchema to have unique ids */
DataModule.counter = 0;

/**
 * Class for a generic statblock base. Created using new DataSchema({name: 'name'});
 */
class DataSchema {
	/**
	 * Member variables
	 * @member {String} name - Required
	 * @member {String} description - Optional
	 * @member {int} id - Not set by the constructor, and is overriden if attempted to set
	 */
	name = null;
	description = '';
	id = null;

	/**
	 * Get a position in the grid
	 * @param {Object} object - Object which to copy variables from
	 * @throws If this.key is not defined when it is NOT an optional variable
	 * @constructor
	 */
	constructor(object) {
		// Move all valid variables from object to this
		Object.keys(object).forEach((key) => {
			if (!this.hasOwnProperty(key)) { return; }
			this[key] = object[key];
		});
		// Set the id
		this.id = DataModule.counter++;
		// Lastly, make sure no variable in this is set to null
		Object.keys(this).forEach((key) => {
			if (this[key] === null || this[key] == undefined) {
				throw new Error(`${this.constructor.name}.${key} is not an optional variable!`);
			}
		});
	}
};

/**
 * Class used to hold Action data
 */
class ActionSchema {
	
}
