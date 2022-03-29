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
	 * @member {String} src - Optional
	 * @member {int} _id - Not set by the constructor, and is overriden if attempted to set
	 */
	name = null;
	description = '';
	src = '';
	_id = null;

	/**
	 * Get a position in the grid
	 * @param {Object} object - Object which to copy variables from
	 */
	make(object) {
		if (object == null) { return; }
		// Move all valid variables from object to this
		Object.keys(object).forEach((key) => {
			if (!(key in this)) { return; }
			if (key.startsWith('_')) { return; }
			this[key] = object[key];
		});
		// Set the id
		// TODO: Use UUID here instead, counter is not unique!
		this._id = DataModule.counter++;
		// Lastly, make sure no variable in this is set to null
		Object.keys(this).forEach((key) => {
			if (this[key] === null || this[key] == undefined) {
				throw new Error(`${this.constructor.name}.${key} is not an optional variable!`);
			}
		});
	}

	/**
	 * Create the DataSchema from an object
	 * @param {Object} object - Object which to copy variables from
	 * @throws If this.key is not defined when it is NOT an optional variable
	 * @constructor
	 */
	 constructor(object) { this.make(object); }
};

/**
 * Class used to hold Action data
 */
class ActionSchema extends DataSchema {
	/**
	 * Member variables
	 * @member {String} damageRadius - Optional
	 * @member {String} primaryDice - Optional
	 * @member {int} primaryDamage - Optional
	 * @member {String} secondaryDice - Optional
	 * @member {int} secondaryDamage - Optional
	 * @member {Boolean} _isSpell - Static
	 * @member {TargetType} target - Optional
	 * @member {int} range - Optional
	 * @member {ActionType} type - Optional
	 */
	damageRadius = 0;
	primaryDice = '1d6+0';
	primaryDamage = 0;
	secondaryDice = '0d0+0';
	secondaryDamage = 0;
	_isSpell = false;
	speed = 30;
	target = 0;
	range = 1;
	type = 0;

	/**
	 * Create the ActionSchema from an object
	 * @param {Object} object - Object which to copy variables from
	 * @throws If this.key is not defined when it is NOT an optional variable
	 * @constructor
	 */
	 constructor(object) { super(); this.make(object); }
}

/**
 * Class used to hold Action data
 */
class CreatureSchema extends DataSchema {
	int = 10;
	cha = 10;
	con = 10;
	dex = 10;
	wis = 10;
	str = 10;
	actions = [];
	defaultBehavior = 0;

	/**
	 * Create the ActionSchema from an object
	 * @param {Object} object - Object which to copy variables from
	 * @throws If this.key is not defined when it is NOT an optional variable
	 * @constructor
	 */
	 constructor(object) { super(); this.make(object); }
}
