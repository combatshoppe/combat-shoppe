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
	 * @member {int} toHitBonus - Optional
	 */
	damageRadius = 0;
	primaryDice = '1d6+0';
	primaryDamage = 0;
	secondaryDice = '0d0+0';
	secondaryDamage = 0;
	maxUses = 1;
	_isSpell = false;
	speed = 30;
	target = 0;
	range = 1;
	type = 0;
	toHitBonus = 0;

	/**
	 * Create the ActionSchema from an object
	 * @param {Object} object - Object which to copy variables from
	 * @throws If this.key is not defined when it is NOT an optional variable
	 * @constructor
	 */
	 constructor(object) { super(); this.make(object); }
}

class CreatureSchema extends DataSchema {
	/**
	 * Member variables
	 * @member {int} int - Optional
	 * @member {int} cha - Optional
	 * @member {int} dex - Optional
	 * @member {int} str - Optional
	 * @member {int} con - Optional
	 * @member {int} wis - Optional
	 * @member {int} speed - optional
	 * @member {int} ac - Optional
	 * @member {int} pb - Optional
	 * @member {int} hp - Optional
	 * @member {DamageType[]} dmgResistances - Optional
	 * @member {DamageType[]} dmgImmunities - Optional
	 * @member {int} darkvision - optional
	 * @member {int} truesight - optional
	 * @member {int[]} actions - Optional
	 * @member {int[]} features - Optional
	 * @member {BehaviorType []} defaultBehavior - Optional
	 */
	int = 10;
	cha = 10;
	dex = 10;
	str = 10;
	con = 10;
	wis = 10;
	speed = 0;
	ac = 0;
	pb = 1;
	hp = 1;
	dmgResistances = [];
	dmgImmunities = [];
	darkvision = 0;
	truesight = 0;
	actions = [];
	features = [];
	defaultBehavior = "";

    constructor(object) {
        super(); this.make(object);
	}

}
/*
let a = new CreatureSchema({name: 'donnie', int : 13});
let b = new CreatureSchema(a);



console.log(JSON.stringify(a));
console.log(b);

let re = new RegExp("[-+][0-9]*");
let str = '"(+17)"';

console.log(str.match(re)[0]);
*/
//https://regex101.com/
//[A-z ]*\.